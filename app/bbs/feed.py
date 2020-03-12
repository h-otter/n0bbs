from django.contrib.syndication.views import Feed

from bbs.models import Thread


class ThreadFeed(Feed):
    title = "n0bbs Threads"
    link = "threads"
    description = ""

    def items(self):
        return Thread.objects.all().prefetch_related("responses")[:30]

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        return item.responses.first().comment[:100]

    def item_link(self, item):
        return "/threads/"+str(item.id)
