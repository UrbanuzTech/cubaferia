import os

from django.contrib.auth.models import User
from django.contrib.postgres.fields import JSONField, ArrayField
from django.db import models
from django.db.models import DO_NOTHING
from django.utils.translation import gettext_lazy as _

from cubaferia.settings import STATIC_URL, MEDIA_URL
from rest.models import Nomenclature
from rest.models.nomenclature import COUNTRY

GENDER = (
    ('male', _('Male')),
    ('female', _('Female')),
    ('undefined', _('Undefined')),
)


def get_avatar(self):
    if self.avatar:
        return os.path.join(MEDIA_URL, self.avatar.name)
    return os.path.join(STATIC_URL, 'img', 'avatar_default.png')


def get_related_to(field):
    return {
        'nationality': COUNTRY
    }[field]


User.add_to_class('phones', ArrayField(models.CharField(max_length=15, null=True, blank=True), null=True, blank=True,
                                       verbose_name=_('phones')))
User.add_to_class('emails',
                  ArrayField(models.EmailField(null=True, blank=True), blank=True, null=True, verbose_name=_('emails')))
User.add_to_class('avatar', models.FileField(upload_to='avatars', blank=True, null=True, verbose_name=_('avatar')))
User.add_to_class('gender', models.CharField(max_length=100, choices=GENDER, verbose_name=_('gender')))
User.add_to_class('address', models.TextField(blank=True, null=True, verbose_name=_('address')))
User.add_to_class('nationality', models.ForeignKey(Nomenclature, blank=True, null=True, on_delete=DO_NOTHING,
                                                   verbose_name=_('nationality')))
User.add_to_class('allow_notifications', models.BooleanField(default=False, verbose_name=_('allow notifications')))
User.add_to_class('get_avatar', get_avatar)
User.add_to_class('get_related_to', get_related_to)
