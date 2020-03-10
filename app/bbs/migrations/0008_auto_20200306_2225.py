# Generated by Django 3.0.4 on 2020-03-06 13:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('bbs', '0007_auto_20200306_2110'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='readlog',
            name='response',
        ),
        migrations.AddField(
            model_name='readlog',
            name='response_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='readlog',
            name='thread',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='read_log', to='bbs.Thread'),
        ),
    ]