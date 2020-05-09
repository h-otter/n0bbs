import os
import uuid
import hashlib
import datetime
from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone
from django.utils.timezone import localtime
from django.utils import html
from django.conf import settings
from django.contrib.auth.models import User

from bbs.slack import notify


class Channel(models.Model):
    name = models.CharField(max_length=32, unique=True, null=False)

    def __str__(self):
        return self.name


class ChannelRelation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="channels", null=False)
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, related_name="users", null=False)

    CHANNEL_RELATION_STATES = (('INVITED', 'INVITED'), ('JOINED', 'JOINED'), ('MUTED', 'MUTED'))
    state = models.CharField(max_length=8, choices=CHANNEL_RELATION_STATES, default='INVITED', null=False)

    class Meta:
        unique_together = ('user', 'channel')


def get_upload_to(self, filename):
    name = str(uuid.uuid4())
    extension = os.path.splitext(filename)[-1]

    return os.path.join('images/', name + extension)


class Image(models.Model):
    image = models.ImageField(upload_to=get_upload_to, null=False)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(default=timezone.now, null=False)

    def __str__(self):
        return self.image.name


@receiver(post_delete, sender=Image)
def delete_file(sender, instance, **kwargs):
    instance.image.delete(False)


class Thread(models.Model):
    # 有効なスレッドの中ではユニークのほうが良さそう
    title = models.CharField("スレタイ", max_length=255, unique=True, null=False)
    anonymous = models.BooleanField("匿名スレ", default=False)
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, related_name="threads", null=True, blank=False)

    def __str__(self):
        return self.title


@receiver(post_save, sender=Thread)
def send_to_slack(sender, instance, **kwargs):
    if len(settings.ALLOWED_HOSTS) >= 1:
        url =  "https://{}/threads/{}".format(settings.ALLOWED_HOSTS[0], instance.id)
        notify('「<{}|{}>」'.format(url, instance.title))
    else:
        notify('「{}」'.format(instance.title))


class Response(models.Model):
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, related_name="responses")

    responded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    responded_at = models.DateTimeField(default=timezone.now)

    display_name = models.CharField("", default="n0nameさん", max_length=65)
    comment = models.TextField("", max_length=4095, null=False, blank=False)

    def masked_user(self):
        k = "{}-{}-{}".format(settings.SECRET_KEY, self.responded_at.date(), str(self.responded_by))
        return hashlib.sha256(k.encode()).hexdigest()[:8]

    def get_dict(self):
        return {
            "thread_title": self.thread.title,
            "responded_by": self.masked_user() if self.thread.anonymous else str(self.responded_by),
            "responded_at": str(localtime(self.responded_at)),
            "display_name": self.display_name,
            "comment": html.escape(self.comment),
        }


@receiver(post_save, sender=Response)
def send_to_slack_after_1h(sender, instance, **kwargs):
    diff = instance.thread.responses.order_by("-responded_at").all()[:2]
    if len(diff) == 2 and diff[0].responded_at - diff[1].responded_at > datetime.timedelta(hours=1):
        url =  "https://{}/threads/{}".format(settings.ALLOWED_HOSTS[0], instance.thread.id)
        notify('「<{}|{}>」 に1時間ぶりの新規書き込み'.format(url, instance.thread.title))


class ReadLog(models.Model):
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, related_name="read_log")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    response_count = models.IntegerField(default=0)
