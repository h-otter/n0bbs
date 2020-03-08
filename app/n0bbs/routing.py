from django.urls import include, path
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.sessions import SessionMiddlewareStack

from bbs.consumers import ThreadConsumer


application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(URLRouter([
        path('api/ws/thread/<int:thread_id>', ThreadConsumer),
    ])),
})
