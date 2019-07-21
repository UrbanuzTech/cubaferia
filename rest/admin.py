from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.admin import UserAdmin

from rest.models import Nomenclature, Announcement
from rest.models.announcement import Event


@admin.register(Nomenclature)
class NomenclatureAdmin(admin.ModelAdmin):
    list_display = ('name', 'nomenclature_type', 'active')
    list_filter = ('active', 'nomenclature_type')
    search_fields = ('name', 'nomenclature_type')


UserAdmin.fieldsets = (
    (None, {'fields': ('username', 'password')}),
    (_('Personal info'),
     {'fields': ('first_name', 'last_name', 'nationality', 'address', 'avatar', 'phones', 'emails')}),
    (_('Permissions'), {
        'fields': ('allow_notifications', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
    }),
    (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
)


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    readonly_fields = ('visit_count',)
    list_display = ('title', 'price', 'city', 'visit_count', 'category', 'created_by', 'created_at', 'published_at')
    list_filter = ('city', 'category')
    search_fields = ('price', 'title')


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    readonly_fields = ('visit_count',)
    list_display = ('title', 'price_for_children', 'price_for_adults', 'city', 'visit_count', 'category', 'created_by', 'created_at', 'published_at')
    list_filter = ('city', 'category')
    search_fields = ('price_for_children', 'price_for_adults', 'title')
