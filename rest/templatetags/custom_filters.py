from django.contrib.auth.models import Group, User
from django.template import Library

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
        'Nomenclature': 'cog'
    }
    colors = {
        'Group': 'blue',
        'User': 'red',
        'Announcement': 'green',
        'Event': 'yellow',
        'Nomenclature': 'purple'
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


@register.filter(name='separate_key_value')
def separate_key_value(text):
    return text.split('=')


@register.filter(name='remove_first_char')
def remove_first_char(text, char):
    if text and text[0] == char:
        return str(text).replace(char, '', 1)
    return text
