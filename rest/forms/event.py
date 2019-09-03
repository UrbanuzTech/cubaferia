from django import forms
from django.utils.translation import gettext_lazy as _


class EventAdminForm(forms.ModelForm):
    def clean(self):
        start_date = self.cleaned_data.get('start_date', None)
        end_date = self.cleaned_data.get('end_date', None)
        allow_children = self.cleaned_data.get('allow_children', None)
        price_for_children = self.cleaned_data.get('price_for_children', None)
        if start_date and end_date and start_date > end_date:
            self.add_error('end_date', _('this value must be greater than start date.').capitalize())
        if allow_children and not price_for_children:
            self.add_error('price_for_children', _('this field is required.').capitalize())
