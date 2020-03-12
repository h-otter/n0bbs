from rest_framework import serializers

from bbs.models import Thread, Response


class ResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Response
        fields = ('display_name', 'comment')
        read_only_fields = ('responded_by', 'responded_at')


class ThreadSerializer(serializers.ModelSerializer):
    # archived = serializers.Boolean(read_only=True) # TODO: あとでロジックを考える #11
    responses_count = serializers.IntegerField(read_only=True)
    read_responses_count = serializers.IntegerField(read_only=True)
    last_responded_at = serializers.DateTimeField(read_only=True)

    responses = ResponseSerializer(write_only=True, many=True)

    class Meta:
        model = Thread
        fields = (
            'id', 
            'title', 
            'anonymous', 
            'responses_count', 
            'read_responses_count', 
            'last_responded_at',
            'responses',
        )

    def validate_responses(self, value):
        if len(value) != 1:
            raise serializers.ValidationError("responses length must be 1")

        return value

    def create(self, validated_data):
        responses_data = validated_data.pop('responses')
        user = validated_data.pop('user')
        item = Thread.objects.create(**validated_data)

        responses = []
        for r in responses_data:
            responses.append(Response.objects.create(thread=item, responded_by=user, **r))

        return item
