from django.contrib import admin

from bbs.models import Thread, Response, ReadLog


class ResponseInline(admin.StackedInline):
    model = Response
    extra = 1


class ThreadAdmin(admin.ModelAdmin):
    inlines = [ResponseInline]


admin.site.register(Thread, ThreadAdmin)
admin.site.register(Response)

# TODO: あとで消す
admin.site.register(ReadLog)