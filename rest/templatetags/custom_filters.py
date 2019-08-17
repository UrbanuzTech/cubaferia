from django.contrib.admin.models import LogEntry
from django.contrib.admin.views.main import PAGE_VAR
from django.contrib.auth.models import Group, User
from django.template import Library
from django.utils.html import format_html
from django.utils.safestring import mark_safe

from rest.models import Announcement, Nomenclature
from rest.models.announcement import Event

register = Library()


@register.filter(name='model_info')
def model_info(model):
    icons = {
        'Group': 'users',
        'User': 'user',
        'Announcement': 'list-alt',
        'Event': 'list-alt',
        'Nomenclature': 'cog',
        'LogEntry': 'history'
    }
    colors = {
        'Group': 'blue',
        'User': 'red',
        'Announcement': 'green',
        'Event': 'yellow',
        'Nomenclature': 'purple',
        'LogEntry': 'navy'
    }
    counts = {
        'Group': Group.objects.count(),
        'User': User.objects.count(),
        'Announcement': Announcement.objects.count(),
        'Event': Event.objects.count(),
        'Nomenclature': Nomenclature.objects.count()
    }
    return {
        'icon': icons[model['object_name']] if model['object_name'] in icons else 'circle-o',
        'color': colors[model['object_name']] if model['object_name'] in colors else 'blue',
        'count': counts[model['object_name']] if model['object_name'] in counts else '0',
    }


@register.filter(name='klass')
def klass(ob):
    return ob.__class__.__name__


@register.filter(name='addcss')
def addcss(field, css):
    return field.as_widget(attrs={"class": css})


@register.filter(name='get_nomenclature_choices')
def get_nomenclature_choices(field):
    if field.remote_field.model is Nomenclature:
        return Nomenclature.get_by_type(field.model.get_related_to(field.name))


@register.filter(name='is_nomenclature')
def is_nomenclature(field):
    return field.remote_field.model is Nomenclature


@register.simple_tag
def pagination_number(cl, i):
    if i == '.':
        return ''
    if i == cl.page_num:
        return format_html('<li class="paginate_button active">'
                           '  <a>{}</a>'
                           '</li>', i + 1)
    else:
        return format_html(
            '<li class="paginate_button">'
            '   <a href="{}"{}>{}</a>'
            '</li>',
            cl.get_query_string({PAGE_VAR: i}),
            mark_safe(' class="end"' if i == cl.paginator.num_pages - 1 else ''),
            i + 1,
        )


@register.simple_tag
def previous_page(cl, i):
    if cl.page_num > 0:
        return format_html('<li class="paginate_button">'
                           '  <a href="{}"><i class="fa fa-angle-left"></i></a>'
                           '</li>', cl.get_query_string({PAGE_VAR: i - 1}))
    return ''


@register.simple_tag
def next_page(cl, i):
    if cl.page_num < cl.paginator.num_pages - 1:
        return format_html('<li class="paginate_button">'
                           '  <a href="{}"><i class="fa fa-angle-right"></i></a>'
                           '</li>', cl.get_query_string({PAGE_VAR: i + 1}))
    return ''


@register.simple_tag
def first_page(cl):
    if cl.page_num > 1:
        return format_html('<li class="paginate_button">'
                           '  <a href="{}"><i class="fa fa-angle-double-left"></i></a>'
                           '</li>', cl.get_query_string({PAGE_VAR: 0}))
    return ''


@register.simple_tag
def last_page(cl):
    if cl.page_num < cl.paginator.num_pages - 2:
        return format_html('<li class="paginate_button">'
                           '  <a href="{}"><i class="fa fa-angle-double-right"></i></a>'
                           '</li>', cl.get_query_string({PAGE_VAR: cl.paginator.num_pages - 1}))
    return ''


@register.filter(name='can_crud')
def can_crud(model):
    if model.model is LogEntry:
        return False
    return True
