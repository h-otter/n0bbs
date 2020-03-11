from django.views.generic import CreateView
from django.db.models import Max, Count, Q
from rest_framework import mixins
from rest_framework import permissions
from rest_framework.viewsets import GenericViewSet
from rest_framework.response import Response

from bbs.models import Thread, Response
from bbs.forms import ThreadForm
from bbs.serializer import ThreadSerializer, ResponseSerializer


class ThreadViewSet(mixins.CreateModelMixin,
                    mixins.RetrieveModelMixin,
                    # mixins.UpdateModelMixin,
                    # mixins.DestroyModelMixin,
                    mixins.ListModelMixin,
                    GenericViewSet):
    queryset = Thread.objects.all()

    serializer_class = ThreadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # user = self.request.user

        return Thread.objects.annotate(
            responses_count=Count('responses'),
            last_responded_at=Max('responses__responded_at'),
        ).extra(select={
            "read_responses_count": 0,
        }).order_by("-last_responded_at")


class ResponseViewSet(mixins.ListModelMixin, GenericViewSet):
    queryset = Response.objects.all()
    serializer_class = ResponseSerializer

    def list(self, request, thread_pk=None):
        queryset = Answer.objects.filter(thread_id=thread_pk)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class CreateThread(CreateView):
    model = Thread
    form_class = ThreadForm

    template_name = "new_thread.html"

    def get_success_url(self):
        # link = reverse('thread_details', kwargs={'thread_id': self.pk})
        # return link
        # TODO: なんかうまく動かないから保留
        return "/threads"

    def form_valid(self, form):
        # TODO: スレを立てるときにレスにユーザー名が入らない :cry:
        # TODO: 子供の要素、ここではresponseへのアクセス方法がわからない
        # form.instance.responses.first().responded_by = self.request.user
        # print(form.formset)

        # notify('「{}」 \n{}'.format(form.instance.title, form.instance.responses.first().comment))

        return super().form_valid(form)
