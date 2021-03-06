"""n0bbs URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from django.conf import settings
from django.conf.urls import include
from django.contrib import admin
from django.contrib.auth.views import LogoutView
from django.contrib.staticfiles.urls import static
from rest_framework import routers

from bbs.views import ThreadViewSet
from bbs.views import ImageViewSet
from bbs.views import UserViewSet
from bbs.views import ChannelViewSet


router = routers.DefaultRouter()
router.register(r'threads', ThreadViewSet)
router.register(r'images', ImageViewSet)
router.register(r'users', UserViewSet)
router.register(r'channels', ChannelViewSet)
# router.register(r'boards', BoardViewSet)


urlpatterns = [
    path('auth/', include('social_django.urls', namespace='social')),
    path('auth/logout/', LogoutView.as_view(), name='logout'),

    path('api/admin/', admin.site.urls),
    path('api/', include(router.urls)),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
