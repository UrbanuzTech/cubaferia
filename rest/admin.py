import json

from django import forms
from django.contrib import admin, messages
from django.contrib.admin.models import LogEntry
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.http import Http404
from django.shortcuts import render, get_object_or_404, redirect
from django.template.loader import render_to_string
from django.urls import reverse, reverse_lazy
from django.utils import timezone
from django.utils.safestring import mark_safe
from django.utils.translation import gettext_lazy as _
from django.views.generic import DetailView
from django.views.generic.base import View

from rest.filters import ContainsFieldListFilter, StartFieldFilter, EndFieldFilter, StartDateFieldFilter, \
    EndDateFieldFilter
from rest.forms.event import EventAdminForm
from rest.forms.widgets import DynamicArrayWidget, FileUploadWidget
from rest.models import Nomenclature, Announcement
from rest.models.announcement import Event
from rest.models.nomenclature import CITY, ANNOUNCEMENT_CATEGORY, EVENT_CATEGORY, COUNTRY
from rest.utils import get_model_by_name


@admin.register(Nomenclature)
class NomenclatureAdmin(admin.ModelAdmin):
    list_display = ('name', 'nomenclature_type', 'active')
    list_filter = ('active', 'nomenclature_type')
    search_fields = ('name', 'nomenclature_type')
    list_display_links = None
    list_per_page = 20

    def save_model(self, request, obj, form, change):
        if not hasattr(obj, 'created_by'):
            obj.created_by = request.user
        form.add_error('name', 'asdsad')
        return super().save_model(request, obj, form, change)


@admin.register(LogEntry)
class LogEntryAdmin(admin.ModelAdmin):
    list_display_links = None
    list_per_page = 20
    actions_on_top = False
    actions = []
    list_display = ('user', 'object_repr', 'content_type', 'action_flag', 'action_time', 'get_change_message')

    def get_change_message(self, obj):
        if obj.action_flag == 1:
            return mark_safe('<span class="label label-success">%s</span>' % _('Addition'))
        elif obj.action_flag == 2:
            data = json.loads(obj.change_message)
            result = '<span class="label label-primary">%s</span><ul class="text-left">' % _('Change')
            for item in data[0]['changed']['fields']:
                result += '<li>%s</li>' % item
            result += '</ul>'
            return mark_safe(result)
        else:
            return mark_safe('<span class="label label-danger red">%s</span>' % _('Deletion'))

    get_change_message.allow_tags = True
    get_change_message.short_description = _('Change message')

    def has_delete_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False


admin.site.unregister(User)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display_links = None
    list_filter = (
        ('username', ContainsFieldListFilter),
        ('first_name', ContainsFieldListFilter),
        ('last_name', ContainsFieldListFilter),
        'nationality',
        'is_staff',
        'is_active',
        'is_superuser',
        'allow_notifications',
        ('date_joined', StartFieldFilter),
        ('date_joined', EndFieldFilter),
    )
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'),
         {'fields': ('first_name', 'last_name', 'nationality', 'address', 'avatar', 'phones', 'emails')}),
        (_('Permissions'), {
            'fields': ('allow_notifications', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        })
    )
    list_per_page = 20
    list_display = ('first_name', 'last_name', 'username', 'nationality', 'is_active', 'is_superuser', 'is_staff')
    search_fields = ('first_name', 'last_name', 'username')
    filter_horizontal = ('groups', 'user_permissions',)

    def get_readonly_fields(self, request, obj=None):
        if obj is not None:
            return 'password',
        return self.readonly_fields

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'nationality':
            kwargs['queryset'] = Nomenclature.get_by_type(COUNTRY)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def formfield_for_dbfield(self, db_field, request, **kwargs):
        if db_field.name == 'phones':
            kwargs['widget'] = DynamicArrayWidget(size=3)
        if db_field.name == 'emails':
            kwargs['widget'] = DynamicArrayWidget(size=3)
        if db_field.name == 'password':
            kwargs['widget'] = forms.PasswordInput()
        if db_field.name == 'avatar':
            kwargs['widget'] = FileUploadWidget()
        return super().formfield_for_dbfield(db_field, request, **kwargs)

    def save_model(self, request, obj, form, change):
        if obj.phones == [None]:
            obj.phones = None
        if obj.emails == [None]:
            obj.emails = None
        if not obj.pk:
            obj.password = make_password(obj.password)
        return super().save_model(request, obj, form, change)


def reinsert_item(modelAdmin, request, queryset):
    for item in queryset:
        item.created_at = timezone.now()
        item.save()
    messages.success(request, _('items uploaded.').capitalize())


reinsert_item.short_description = 'To launch selected'


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display_links = None
    readonly_fields = ('visit_count', 'created_by')
    list_display = ('title_column', 'price', 'city', 'visit_count', 'category', 'created_by', 'action_column')
    list_filter = (
        ('title', ContainsFieldListFilter),
        'city',
        ('price', StartFieldFilter),
        ('price', EndFieldFilter),
        ('created_at', StartDateFieldFilter),
        ('created_at', EndDateFieldFilter),
        'category',
        'created_by'
    )
    list_per_page = 20
    actions = [reinsert_item]
    search_fields = ('price', 'title')

    def action_column(self, obj):
        return mark_safe('<a href="%s" style="cursor: pointer;" class="margin-r-5" title="%s">'
                         '   <i class="fa fa-eye" style="font-size: 14px;"></i>'
                         '</a>'
                         '<a href="%s" style="cursor: pointer;" class="btn-reinsert margin-r-5" title="%s">'
                         '   <i class="fa fa-refresh text-green" style="font-size: 14px;"></i>'
                         '</a>'
                         '<a href="%s" style="cursor: pointer;" class="margin-r-5" title="%s">'
                         '   <i class="fa fa-pencil text-blue" style="font-size: 14px;"></i>'
                         '</a>'
                         '<a data-href="%s" style="cursor: pointer;" class="btn-delete" title="%s">'
                         '   <i class="fa fa-remove text-danger" style="font-size: 14px;"></i>'
                         '</a>' % (
                             reverse_lazy('object_details', kwargs={'model_name': 'announcement', 'pk': obj.pk}),
                             _('details').capitalize(),
                             reverse_lazy('object_reinsert', kwargs={'model_name': 'announcement', 'pk': obj.pk}),
                             _('to launch').capitalize(),
                             reverse_lazy('admin:rest_announcement_change', kwargs={'object_id': obj.pk}),
                             _('edit').capitalize(),
                             reverse_lazy('admin:rest_announcement_delete', kwargs={'object_id': obj.pk}),
                             _('delete').capitalize()
                         ))

    action_column.allow_tags = True
    action_column.short_description = _('actions').capitalize()

    def title_column(self, obj):
        return mark_safe('<a href="%s" style="cursor: pointer;" title="%s">'
                         '   %s'
                         '</a>' % (
                             reverse_lazy('object_details', kwargs={'model_name': 'announcement', 'pk': obj.pk}),
                             _('details').capitalize(),
                             obj.title
                         ))

    title_column.allow_tags = True
    title_column.short_description = _('title').capitalize()

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'city':
            kwargs['queryset'] = Nomenclature.get_by_type(CITY)
        elif db_field.name == 'category':
            kwargs['queryset'] = Nomenclature.get_by_type(ANNOUNCEMENT_CATEGORY)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def formfield_for_dbfield(self, db_field, request, **kwargs):
        if db_field.name == 'phones':
            kwargs['widget'] = DynamicArrayWidget(size=3)
        if db_field.name == 'emails':
            kwargs['widget'] = DynamicArrayWidget(size=3)
        if db_field.name in ['main_image', 'image1', 'image2', 'image3']:
            kwargs['widget'] = FileUploadWidget()
        return super().formfield_for_dbfield(db_field, request, **kwargs)

    def save_model(self, request, obj, form, change):
        if not hasattr(obj, 'created_by'):
            obj.created_by = request.user
        return super().save_model(request, obj, form, change)


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    form = EventAdminForm
    list_display_links = None
    readonly_fields = ('visit_count', 'created_by')

    list_display = (
        'title_column', 'price_for_children', 'price_for_adults', 'city', 'visit_count', 'category', 'created_by',
        'action_column')
    list_filter = (
        ('title', ContainsFieldListFilter),
        'city',
        'category',
        'allow_children',
        ('start_date', StartDateFieldFilter),
        ('start_date', EndDateFieldFilter),
        ('end_date', StartDateFieldFilter),
        ('end_date', EndDateFieldFilter),
        ('price_for_adults', StartFieldFilter),
        ('price_for_adults', EndFieldFilter),
        ('price_for_children', StartFieldFilter),
        ('price_for_children', EndFieldFilter),
        ('created_at', StartDateFieldFilter),
        ('created_at', EndDateFieldFilter),
        'created_by',
        'allow_children'
    )
    actions = [reinsert_item]
    search_fields = ('price_for_children', 'price_for_adults', 'title')
    list_per_page = 20

    def title_column(self, obj):
        return mark_safe('<a href="%s" style="cursor: pointer;" title="%s">'
                         '   %s'
                         '</a>' % (
                             reverse_lazy('object_details', kwargs={'model_name': 'event', 'pk': obj.pk}),
                             _('details').capitalize(),
                             obj.title
                         ))

    title_column.allow_tags = True
    title_column.short_description = _('title').capitalize()

    def action_column(self, obj):
        return mark_safe('<a href="%s" style="cursor: pointer;" class="margin-r-5" title="%s">'
                         '   <i class="fa fa-eye" style="font-size: 14px;"></i>'
                         '</a>'
                         '<a href="%s" style="cursor: pointer;" class="btn-reinsert margin-r-5" title="%s">'
                         '   <i class="fa fa-refresh text-green" style="font-size: 14px;"></i>'
                         '</a>'
                         '<a href="%s" style="cursor: pointer;" class="margin-r-5" title="%s">'
                         '   <i class="fa fa-pencil text-blue" style="font-size: 14px;"></i>'
                         '</a>'
                         '<a data-href="%s" style="cursor: pointer;" class="btn-delete" title="%s">'
                         '   <i class="fa fa-remove text-danger" style="font-size: 14px;"></i>'
                         '</a>' % (
                             reverse_lazy('object_details', kwargs={'model_name': 'event', 'pk': obj.pk}),
                             _('details').capitalize(),
                             reverse_lazy('object_reinsert', kwargs={'model_name': 'event', 'pk': obj.pk}),
                             _('to launch').capitalize(),
                             reverse_lazy('admin:rest_event_change', kwargs={'object_id': obj.pk}),
                             _('edit').capitalize(),
                             reverse_lazy('admin:rest_event_delete', kwargs={'object_id': obj.pk}),
                             _('delete').capitalize()
                         ))

    action_column.allow_tags = True
    action_column.short_description = _('actions').capitalize()

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'city':
            kwargs['queryset'] = Nomenclature.get_by_type(CITY)
        elif db_field.name == 'category':
            kwargs['queryset'] = Nomenclature.get_by_type(EVENT_CATEGORY)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def formfield_for_dbfield(self, db_field, request, **kwargs):
        if db_field.name == 'phones':
            kwargs['widget'] = DynamicArrayWidget(size=3)
        if db_field.name == 'emails':
            kwargs['widget'] = DynamicArrayWidget(size=3)
        if db_field.name in ['main_image', 'image1', 'image2', 'image3']:
            kwargs['widget'] = FileUploadWidget()
        return super().formfield_for_dbfield(db_field, request, **kwargs)

    def save_model(self, request, obj, form, change):
        if not hasattr(obj, 'created_by'):
            obj.created_by = request.user
        form.add_error('city', 'asdsad')
        return super().save_model(request, obj, form, change)


class ObjectDetailsView(DetailView):
    def get(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk', None)
        model_name = self.kwargs.get('model_name', None)
        model = get_model_by_name(model_name)
        obj = get_object_or_404(model, pk=pk)
        return render(request, 'details/%s.html' % model_name, locals())


class ObjectReInsertView(View):
    def get(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk', None)
        model_name = self.kwargs.get('model_name', None)
        if model_name != 'announcement' and model_name != 'event':
            raise Http404
        model = get_model_by_name(model_name)
        obj = get_object_or_404(model, pk=pk)
        obj.created_at = timezone.now()
        obj.save()
        messages.success(request, _('item re-inserted successfully.').capitalize())
        url = ''
        if '_changelist_filters' in request.GET:
            url = '?' + request.GET['_changelist_filters']
        if model is Announcement:
            return redirect(reverse('admin:rest_announcement_changelist') + url)
        else:
            return redirect(reverse('admin:rest_event_changelist') + url)


class ObjectDeleteView(View):
    def get(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk', None)
        model_name = self.kwargs.get('model_name', None)
        if model_name == 'user' and request.user.pk == pk:
            raise Http404
        model = get_object_or_404(get_model_by_name(model_name), pk=pk)
        model.delete()
        messages.success(request, _('item deleted successfully.').capitalize())
        url = ''
        if '_changelist_filters' in request.GET:
            url = '?' + request.GET['_changelist_filters']
        return redirect(reverse('admin:%s_%s_%s' % (model._meta.app_label, model_name, 'changelist')) + url)
