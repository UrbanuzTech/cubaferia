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
