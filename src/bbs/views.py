from django.utils import timezone
from django.views.generic import ListView, CreateView
from django.shortcuts import get_object_or_404
from django.urls import reverse

from bbs.models import Thread, Response
from bbs.forms import ResponseForm, ThreadForm
from bbs.slack import notify
 
 
class ListThreads(ListView):
    model = Thread
    # TODO: order_byで最終レスでソートしたい
    queryset = Thread.objects.filter(archived_at__gte=timezone.now())

    template_name = "list_threads.html"
    # paginate_by = 20


class CreateThread(CreateView):
    model = Thread
    form_class = ThreadForm

    template_name = "new_thread.html"

    def get_success_url(self):
        # link = reverse('thread_details', kwargs={'thread_id': self.pk})
        # return link
        # TODO: なんかうまく動かないから保留
        return reverse("list_threads")

    def form_valid(self, form):
        # TODO: スレを立てるときにレスにユーザー名が入らない :cry:
        # form.instance.responses.first().responded_by = self.request.user
        # print(form.formset)

        # notify("{} {}".format(form.instance.title, type(form.formset.instance.responses)))

        return super().form_valid(form)


class ThreadDetails(CreateView):
    model = Response
    form_class = ResponseForm

    template_name = "thread.html"

    def get_success_url(self):
        thread_id = self.kwargs.get('thread_id')
        link = reverse('thread_details', kwargs={'thread_id': thread_id})

        # TODO: ここでクエリを叩くのは良くない
        last = Response.objects.filter(thread__id=thread_id).count()

        return "{}#r{}".format(link, last)

    def form_valid(self, form):
        # TODO: ログインしていなかったら403を返す
        form.instance.responded_by = self.request.user
        form.instance.thread = get_object_or_404(Thread, id=self.kwargs.get('thread_id'))

        return super().form_valid(form)

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        thread = get_object_or_404(Thread, id=self.kwargs.get('thread_id'))
        ctx["thread"] = thread
        ctx["responses"] = Response.objects.all().filter(thread=thread)
        ctx["archived"] = thread.archived_at < timezone.now()

        return ctx

