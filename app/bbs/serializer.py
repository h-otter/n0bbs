from rest_framework import serializers

from bbs.models import Thread


class ThreadSerializer(serializers.ModelSerializer):
    responses_count = serializers.IntegerField(read_only=True)
    read_responses_count = serializers.IntegerField(read_only=True)
    last_responded_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Thread
        fields = ('id', 'title', 'anonymous', 'archived_at', 'responses_count', 'read_responses_count', 'last_responded_at')
