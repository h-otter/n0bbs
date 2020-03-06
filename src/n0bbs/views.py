from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponseRedirect


def index(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect(settings.LOGIN_REDIRECT_URL)

    return render(request, 'index.html')
