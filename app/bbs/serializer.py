from django.contrib.auth.models import User
from rest_framework import serializers

from bbs.models import Thread, Response, Image, Channel
from bbs.models import ChannelRelation


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'last_login')
        read_only_fields = ('id', 'username', 'last_login')


class ChannelRelationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChannelRelation
        fields = (
            'user',
            'state',
        )
        read_only_fields = ('user', 'state')


class InviteToChannelSerializer(serializers.Serializer):
    users = serializers.ListField(
        child=serializers.IntegerField(),
        required=True,
    )


class ChannelSerializer(serializers.ModelSerializer):
    users = ChannelRelationSerializer(read_only=True, many=True)

    class Meta:
        model = Channel
        fields = (
            'id',
            'name',
            'users',
        )

    def create(self, validated_data):
        user = validated_data.pop('user')
        item = Channel.objects.create(**validated_data)
        ChannelRelation.objects.create(user=user, channel=item)

        return item


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
            'channel',
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


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['image', 'author', 'created_at']
        read_only_fields = ['author', 'created_at']


# class BoardSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Board
#         fields = (
#             'name',
#             'is_public',
#         )
