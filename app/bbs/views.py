from django.utils import timezone
from django.views.generic import ListView, CreateView, FormView
from django.shortcuts import get_object_or_404
from django.urls import reverse
from django.db.models import Max, Count
from rest_framework.viewsets import GenericViewSet
from rest_framework import mixins
from rest_framework import permissions

from bbs.models import Thread, Response
from bbs.forms import ResponseForm, ThreadForm
from bbs.serializer import ThreadSerializer
from bbs.slack import notify



class ThreadViewSet(mixins.CreateModelMixin,
                    mixins.RetrieveModelMixin,
                    # mixins.UpdateModelMixin,
                    # mixins.DestroyModelMixin,
                    mixins.ListModelMixin,
                    GenericViewSet):
    queryset = Thread.objects.annotate(responses_count=Count('responses')).annotate(last_responded_at=Max('responses__responded_at')).annotate(read_responses_count=Max('read_log__response_count')).order_by("-last_responded_at")
    serializer_class = ThreadSerializer
    permission_classes = [permissions.IsAuthenticated]


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
        notify('「{}」'.format(form.instance.title))

        return super().form_valid(form)
