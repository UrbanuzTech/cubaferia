from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.admin import UserAdmin, GroupAdmin

from rest.forms.widgets import DynamicArrayWidget
from rest.models import Nomenclature, Announcement
from rest.models.announcement import Event
from rest.models.nomenclature import CITY, ANNOUNCEMENT_CATEGORY, EVENT_CATEGORY


@admin.register(Nomenclature)
class NomenclatureAdmin(admin.ModelAdmin):
    list_display = ('name', 'nomenclature_type', 'active')
    list_filter = ('active', 'nomenclature_type')
    search_fields = ('name', 'nomenclature_type')
    change_list_template = 'pages/change_list.html'


UserAdmin.fieldsets = (
    (None, {'fields': ('username', 'password')}),
    (_('Personal info'),
     {'fields': ('first_name', 'last_name', 'nationality', 'address', 'avatar', 'phones', 'emails')}),
    (_('Permissions'), {
        'fields': ('allow_notifications', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
    }),
    (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
)
UserAdmin.change_list_template = 'pages/change_list.html'
GroupAdmin.change_list_template = 'pages/change_list.html'


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    readonly_fields = ('visit_count',)
    list_display = ('title', 'price', 'city', 'visit_count', 'category', 'created_by', 'created_at')
    list_filter = ('city', 'category')
    search_fields = ('price', 'title')
    list_per_page = 20
    change_list_template = 'pages/change_list.html'

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


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    readonly_fields = ('visit_count',)
    list_display = (
        'title', 'price_for_children', 'price_for_adults', 'city', 'visit_count', 'category', 'created_by',
        'created_at')
    list_filter = ('city', 'category')
    search_fields = ('price_for_children', 'price_for_adults', 'title')
    list_per_page = 20
    change_list_template = 'pages/change_list.html'

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
