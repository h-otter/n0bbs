import json
from urllib.parse import urlparse
import datetime
import time
from django.db import connection
from django.db.utils import OperationalError
from django.core import serializers
from django.utils import timezone
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from bbs.models import Response, Thread


# TODO: コメントのレンダリング
# r.markdown_rendered | safe | linebreaksbr
class ThreadConsumer(AsyncWebsocketConsumer):
    groups = ['broadcast']


    @database_sync_to_async
    def getResponses(self, thread_id):
        res = Response.objects.filter(thread__id=self.room_name).order_by("responded_at")
        res = map(lambda r: r.get_dict(), res)

        return list(res)

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['thread_id']
        self.room_group_name = "thread_{}".format(self.room_name)

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        responses = await self.getResponses(self.room_name)
        await self.send(text_data=json.dumps({
            "type": 'all_responses',
            "message": {
                "responses": responses,
            },
        }))

    # @database_sync_to_async
    # def markRead(self, thread_id, message):
    #     Response.objects.create(
    #         thread_id=thread_id,
    #         responded_by=self.scope["user"],
    #         display_name=message["display_name"],
    #         comment=message["comment"],
    #     )

    async def disconnect(self, close_code):
        # 既読をつける

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        # await self.close()

    @database_sync_to_async
    def saveResponse(self, thread_id, message):
        return Response.objects.create(
            thread_id=thread_id,
            responded_by=self.scope["user"],
            display_name=message["display_name"],
            comment=message["comment"],
        ).get_dict()

    async def new_response(self, event):
        await self.send(text_data=json.dumps({
            'type': 'new_response',
            'message': event["message"]
        }))

    async def receive(self, text_data):
        data = json.loads(text_data)
        res = await self.saveResponse(self.room_name, data["message"])

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'new_response',
                'message': res
            }
        )
