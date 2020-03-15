from django.db.models import Max, Count, IntegerField, Case, When, Value
from django.contrib.auth.models import User
from rest_framework import mixins
from rest_framework import permissions
from rest_framework import status
from rest_framework import serializers
from rest_framework.decorators import action
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework.response import Response as RestResponse
from rest_framework.parsers import MultiPartParser

from bbs.models import Thread, Image
from bbs.models import Channel, ChannelRelation
from bbs.serializer import ThreadSerializer, ImageSerializer
from bbs.serializer import UserSerializer
from bbs.serializer import ChannelSerializer
from bbs.serializer import ChannelRelationSerializer
from bbs.serializer import InviteToChannelSerializer


class UserViewSet(mixins.RetrieveModelMixin,
                  mixins.ListModelMixin,
                  GenericViewSet):
    queryset = User.objects.all()

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class ChannelViewSet(mixins.CreateModelMixin,
                     mixins.RetrieveModelMixin,
                     mixins.ListModelMixin,
                     mixins.UpdateModelMixin,
                     GenericViewSet):
    queryset = Channel.objects.all().order_by('name')

    serializer_class = ChannelSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], serializer_class=InviteToChannelSerializer)
    def invite(self, request, pk=None):
        data = InviteToChannelSerializer(data=request.data)

        if data.is_valid():
            for u in data.validated_data['users']:
                ChannelRelation.objects.create(user_id=u, channel_id=pk)

            return RestResponse({'status': 'users are invited'})
        else:
            return RestResponse(data.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], serializer_class=serializers.Serializer)
    def join(self, request, pk=None):
        user = self.request.user
        r = ChannelRelation.objects.get(user=user, channel_id=pk)
        if not r:
            return RestResponse({'status': 'invite you by channel members before join'}, status=status.HTTP_400_BAD_REQUEST)

        r.state = "JOINED"
        r.save()

        return RestResponse({'status': 'you joined!!'})

    @action(detail=True, methods=['post'], serializer_class=serializers.Serializer)
    def mute(self, request, pk=None):
        user = self.request.user
        r = ChannelRelation.objects.get(user=user, channel_id=pk)
        if not r:
            return RestResponse({'status': 'invite you by channel members before mute'}, status=status.HTTP_400_BAD_REQUEST)

        r.state = "MUTED"
        r.save()

        return RestResponse({'status': 'you have muted this channel'})


class ThreadViewSet(mixins.CreateModelMixin,
                    mixins.RetrieveModelMixin,
                    mixins.ListModelMixin,
                    GenericViewSet):
    queryset = Thread.objects.all()

    serializer_class = ThreadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        channels = self.request.query_params.get('channels', None)

        if channels:
            channel_ids = channels.split(",")
        else:
            channel_ids = User.objects.first().channels.filter(state="JOINED").values_list('channel_id')

        return Thread.objects.prefetch_related('channel').filter(channel_id__in=channel_ids).annotate(
            responses_count=Count('responses', distinct=True),
            read_responses_count=Max(Case(
                When(read_log__user=user, then='read_log__response_count'),
                default=Value(0),
                output_field=IntegerField()
            )),
            last_responded_at=Max('responses__responded_at'),
        ).order_by("-last_responded_at")

    # ココらへんは最悪だけど、妥協
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# class BoardViewSet(ModelViewSet):
#     queryset = Board.objects.all()
#     serializer_class = BoardSerializer

#     # def list(self, request, thread_pk=None):
#     #     queryset = Answer.objects.filter(thread_id=thread_pk)
#     #     serializer = self.serializer_class(queryset, many=True)
#     #     return Response(serializer.data)


class ImageViewSet(mixins.CreateModelMixin,
                   mixins.ListModelMixin,
                   GenericViewSet):
    queryset = Image.objects.all()

    serializer_class = ImageSerializer
    parser_classes = (MultiPartParser, )
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        return Image.objects.filter(author=user).order_by("-created_at")

    # ココらへんは最悪だけど、妥協
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
