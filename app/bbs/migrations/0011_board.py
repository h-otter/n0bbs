# Generated by Django 3.0.4 on 2020-03-12 19:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bbs', '0010_remove_thread_archived_at'),
    ]

    operations = [
        migrations.CreateModel(
            name='Board',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=16, unique=True, verbose_name='掲示板名')),
                ('is_public', models.BooleanField(default=True)),
            ],
        ),
    ]