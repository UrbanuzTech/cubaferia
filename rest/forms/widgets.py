import os

from django import forms

from cubaferia import settings


class DynamicArrayWidget(forms.TextInput):
    template_name = 'widgets/dynamic_array.html'
    size = None

    def __init__(self, size=None, *args, **kwargs):
        self.size = size
        super().__init__(*args, **kwargs)

    def get_context(self, name, value, attrs):
        value = value or ['']
        context = super().get_context(name, value, attrs)
        final_attrs = context['widget']['attrs']
        id_ = context['widget']['attrs'].get('id')

        subwidgets = []
        if not type(context['widget']['value']) is list:
            value = context['widget']['value'].split(',')
        else:
            value = context['widget']['value']
        for x in range(len(value)):
            widget_attrs = final_attrs.copy()
            if id_:
                widget_attrs['id'] = '%s_%s' % (id_, x)
            widget = forms.TextInput()
            widget.is_required = True
            subwidgets.append(widget.get_context(name, value[x], widget_attrs)['widget'])

        context['widget']['subwidgets'] = subwidgets
        context['widget']['attrs']['size'] = self.size
        return context

    def value_from_datadict(self, data, files, name):
        try:
            getter = data.getlist
        except AttributeError:
            getter = data.get
        return getter(name)

    def format_value(self, value):
        return value or []


class FileUploadWidget(forms.ClearableFileInput):
    template_name = 'widgets/file_upload.html'

    def get_context(self, name, value, attrs):
        context = super().get_context(name, value, attrs)
        context['widget']['value'] = os.path.join(settings.MEDIA_URL, value.name)
        context['widget']['is_empty'] = not value
        return context
