import datetime
import re
import hashlib
from markdown import markdown
from django.db import models
from django.utils import timezone
from django.utils import html
from django.conf import settings
from django.contrib.auth.models import User
from django.template.defaultfilters import linebreaksbr, safe


def default_archived_at():
  return timezone.now() + settings.DEFAULT_THREAD_ARCHIVE_DURATION


class Thread(models.Model):
    # 有効なスレッドの中ではユニークのほうが良さそう
    title = models.CharField("スレタイ", max_length=255, unique=False, null=False)
    anonymous = models.BooleanField("匿名スレ", default=False)
    archived_at = models.DateTimeField(default=default_archived_at, null=True, blank=True) # これでdefaultがうまくいくのかわからない


    def __str__(self):
        return self.title


class Response(models.Model):
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, related_name="responses")

    responded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    responded_at = models.DateTimeField(default=timezone.now)

    display_name = models.CharField("", default="n0nameさん", max_length=65)
    comment = models.TextField("", max_length=4095, null=False, blank=False)

    def markdown_rendered(self):
        c = markdown(html.escape(self.comment))
        return re.sub(r'&gt;&gt;(\d+)', r'<a href="#r\1">&gt;&gt;\1<a>', c)

    def masked_user(self):
        k = "{}-{}-{}".format(settings.SECRET_KEY, self.responded_at.date(), str(self.responded_by))
        return hashlib.sha256(k.encode()).hexdigest()[:16]
        
    def rendered_comment(self):
        return linebreaksbr(safe(self.markdown_rendered()))

    def get_dict(self):
        return {
            "responded_by": self.masked_user() if self.thread.anonymous else str(self.responded_by),
            "responded_at": str(self.responded_at),
            "display_name": self.display_name,
            "comment": self.rendered_comment(),
        }


class ReadLog(models.Model):
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, related_name="read_log")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    response = models.ForeignKey(Response, on_delete=models.CASCADE, null=True)
