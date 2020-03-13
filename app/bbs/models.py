import os
import uuid
import hashlib
from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone
from django.utils.timezone import localtime
from django.utils import html
from django.conf import settings
from django.contrib.auth.models import User

from bbs.slack import notify


# class BoardRelation(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="boards")
#     board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name="members")

#     # JOINED, MUTED, INVITED


# class Board(models.Model):
#     name = models.CharField("掲示板名", max_length=16, unique=True, null=False)
#     is_public = models.BooleanField(default=True, null=False)

#     def __str__(self):
#         return self.name


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


class ReadLog(models.Model):
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, related_name="read_log")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    response_count = models.IntegerField(default=0)
