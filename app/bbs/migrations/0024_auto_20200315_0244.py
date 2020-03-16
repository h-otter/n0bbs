# Generated by Django 3.0.4 on 2020-03-14 17:44

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('bbs', '0023_auto_20200315_0057'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='channel',
            name='users',
        ),
        migrations.AlterField(
            model_name='channelrelation',
            name='channel',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='users', to='bbs.Channel'),
        ),
        migrations.AlterField(
            model_name='channelrelation',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='channels', to=settings.AUTH_USER_MODEL),
        ),
    ]