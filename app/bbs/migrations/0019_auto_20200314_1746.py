# Generated by Django 3.0.4 on 2020-03-14 08:46

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('bbs', '0018_auto_20200314_1714'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='channelrelation',
            unique_together={('user', 'channel')},
        ),
    ]