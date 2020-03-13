from django.db.models import Max, Count, IntegerField, Case, When, Value
from rest_framework import mixins
from rest_framework import permissions
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser

from bbs.models import Thread, Response, Image
from bbs.serializer import ThreadSerializer, ResponseSerializer, ImageSerializer


class ThreadViewSet(mixins.CreateModelMixin,
                    mixins.RetrieveModelMixin,
                    mixins.ListModelMixin,
                    GenericViewSet):
    queryset = Thread.objects.all()

    serializer_class = ThreadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        return Thread.objects.annotate(
            responses_count=Count('responses', distinct=True),
        ).annotate(
            read_responses_count=Max(Case(
                When(read_log__user=user, then='read_log__response_count'),
                default=Value(0),
                output_field=IntegerField()
            )),
            last_responded_at=Max('responses__responded_at'),
        ).order_by("-last_responded_at")

    # ココらへんは最悪だけど、妥協
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# class BoardViewSet(ModelViewSet):
#     queryset = Board.objects.all()
#     serializer_class = BoardSerializer

#     # def list(self, request, thread_pk=None):
#     #     queryset = Answer.objects.filter(thread_id=thread_pk)
#     #     serializer = self.serializer_class(queryset, many=True)
#     #     return Response(serializer.data)


class ImageViewSet(mixins.CreateModelMixin,
                   mixins.ListModelMixin,
                   GenericViewSet):
    queryset = Image.objects.all()

    serializer_class = ImageSerializer
    parser_classes = (MultiPartParser, )
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        return Image.objects.filter(author=user).order_by("-created_at")

    # ココらへんは最悪だけど、妥協
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
