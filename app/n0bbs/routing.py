from django.urls import path
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

from bbs.consumers import ThreadConsumer, ChannelConsumer


application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(URLRouter([
        path('api/ws/thread/<int:thread_id>', ThreadConsumer),
        path('api/ws/channel/', ChannelConsumer),
    ])),
})
