# Generated by Django 3.0.4 on 2020-03-14 08:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bbs', '0017_auto_20200314_1706'),
    ]

    operations = [
        migrations.AlterField(
            model_name='channelrelation',
            name='state',
            field=models.CharField(choices=[('INVITED', 'INVITED'), ('JOINED', 'JOINED'), ('MUTED', 'MUTED')], default='INVITED', max_length=8),
        ),
    ]
