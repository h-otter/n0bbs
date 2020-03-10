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
from django.conf.urls import include
from django.contrib import admin
from django.contrib.auth.views import LogoutView
from django.contrib.auth.decorators import login_required
# from django.contrib.admin.views.decorators import staff_member_required
from rest_framework import routers

from n0bbs.views import index
from bbs.views import CreateThread, ThreadViewSet




router = routers.DefaultRouter()
router.register(r'threads', ThreadViewSet)


urlpatterns = [
    path('api/admin/', admin.site.urls),

    path('auth/', include('social_django.urls', namespace='social')),
    # あとで auth/logout/ にする
    path('logout/', LogoutView.as_view(), name='logout'),

    path('api/', include(router.urls)),


    # Githubの特定ユーザーにのみ権限を与えるなどは面倒なのでstaffかどうかで判断する
    # ユーザー登録にはgithub ログインしてもらったあとに、staffユーザーが変更する必要がある
    # TODO: うまく行かないかも
    path('threads:new', login_required(CreateThread.as_view()), name="create_thread"),

    path('', index, name='index'),
]
