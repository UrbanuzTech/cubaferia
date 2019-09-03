from django.contrib import admin
from django.contrib.admin.models import LogEntry
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.shortcuts import render, get_object_or_404
from django.utils.translation import gettext_lazy as _
from django.views.generic import DetailView

from rest.filters import ContainsFieldListFilter
from rest.forms.widgets import DynamicArrayWidget
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


@admin.register(LogEntry)
class LogEntryAdmin(admin.ModelAdmin):
    list_display_links = None
    list_per_page = 20
    actions_on_top = False
    actions = []
    list_display = ('user', 'object_repr', 'content_type', 'action_flag', 'action_time', 'change_message')

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
        'is_staff',
        'is_active',
        'is_superuser'
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

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'nationality':
            kwargs['queryset'] = Nomenclature.get_by_type(COUNTRY)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def formfield_for_dbfield(self, db_field, request, **kwargs):
        if db_field.name == 'phones':
            kwargs['widget'] = DynamicArrayWidget(size=3)
        if db_field.name == 'emails':
            kwargs['widget'] = DynamicArrayWidget(size=3)
        return super().formfield_for_dbfield(db_field, request, **kwargs)

    def save_model(self, request, obj, form, change):
        if obj.phones == [None]:
            obj.phones = None
        if obj.emails == [None]:
            obj.emails = None
        obj.password = make_password(obj.password)
        return super().save_model(request, obj, form, change)


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display_links = None
    readonly_fields = ('visit_count', 'created_by')
    list_display = ('title', 'price', 'city', 'visit_count', 'category', 'created_by', 'created_at')
    list_filter = (
        ('title', ContainsFieldListFilter),
        'city',
        'category',
        'created_by'
    )
    list_per_page = 20
    search_fields = ('price', 'title')

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
        return super().formfield_for_dbfield(db_field, request, **kwargs)

    def save_model(self, request, obj, form, change):
        if not hasattr(obj, 'created_by'):
            obj.created_by = request.user
        return super().save_model(request, obj, form, change)


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display_links = None
    readonly_fields = ('visit_count', 'created_by')
    list_display = (
        'title', 'price_for_children', 'price_for_adults', 'city', 'visit_count', 'category', 'created_by',
        'created_at')
    list_filter = (
        ('title', ContainsFieldListFilter),
        'city',
        'category',
        'created_by',
        'allow_children'
    )
    search_fields = ('price_for_children', 'price_for_adults', 'title')
    list_per_page = 20

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
        return super().formfield_for_dbfield(db_field, request, **kwargs)

    def save_model(self, request, obj, form, change):
        if not hasattr(obj, 'created_by'):
            obj.created_by = request.user
        return super().save_model(request, obj, form, change)


class ObjectDetailsView(DetailView):
    def get(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk', None)
        model_name = self.kwargs.get('model_name', None)
        model = get_model_by_name(model_name)
        obj = get_object_or_404(model, pk=pk)
        return render(self.request, 'details/%s.html' % model_name, locals())
