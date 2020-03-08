import requests
import json
from django.conf import settings

def notify(message=""):
    requests.post(settings.SLACK_INCOMING_HOOK_URL, data=json.dumps({
        'username': u'n0bbs',
        'icon_emoji': u':memo:',

        'text': message,
        'link_names': 1,
    }))
