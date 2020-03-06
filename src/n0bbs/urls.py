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
# from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required

from n0bbs.views import index
from bbs.views import ListThreads, ThreadDetails, CreateThread


urlpatterns = [
    path('admin/', admin.site.urls),

    path('auth/', include('social_django.urls', namespace='social')),
    path('logout/', LogoutView.as_view(), name='logout'),

    # Githubの特定ユーザーにのみ権限を与えるなどは面倒なのでstaffかどうかで判断する
    # ユーザー登録にはgithub ログインしてもらったあとに、staffユーザーが変更する必要がある
    # TODO: うまく行かないかも
    path('threads', staff_member_required(ListThreads.as_view()), name="list_threads"),
    path('threads:new', staff_member_required(CreateThread.as_view()), name="create_thread"),
    path('threads/<int:thread_id>', staff_member_required(ThreadDetails.as_view()), name="thread_details"),

    path('', index, name='index'),
]
