from rest_framework import serializers

from bbs.models import Thread


class ThreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = ('title', 'anonymous', 'archived_at')
