from django.forms import ModelForm, Textarea
from django.forms.models import inlineformset_factory

from bbs.models import Thread, Response


class ResponseForm(ModelForm):
    class Meta:
        model = Response
        fields = ("display_name", "comment", )
        widgets = {
            'comment': Textarea(attrs={'rows': 1})
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        for field in self.fields.values():
            field.widget.attrs["class"] = "form-control comment"


ThreadFormSet = inlineformset_factory(
    parent_model=Thread,
    model=Response,
    form=ResponseForm,
    extra=0,
    min_num=1,
    validate_min=True,
    can_delete=False,
)


# ref https://qiita.com/ykiu/items/dfd37fc92a1b4ec8b331
class FormSetMixin:
    def __init__(self, *args, **kwargs):
        super(FormSetMixin, self).__init__(*args, **kwargs)
        self.formset = self.formset_class(
            instance=self.instance,
            data=self.data if self.is_bound else None,
        )

    def is_valid(self):
        return super(FormSetMixin, self).is_valid() and self.formset.is_valid()

    def save(self, commit=True):
        saved_instance = super(FormSetMixin, self).save(commit)
        self.formset.save(commit)
        return saved_instance


class ThreadForm(FormSetMixin, ModelForm):
    formset_class = ThreadFormSet

    class Meta:
        model = Thread
        fields = ("title", "anonymous", )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        for field in self.fields.values():
            field.widget.attrs["class"] = "form-control"
