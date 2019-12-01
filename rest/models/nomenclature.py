import os

from django.db import models
from django.db.models import DO_NOTHING
from django.utils.translation import gettext_lazy as _

from cubaferia.settings import MEDIA_URL, STATIC_URL

ANNOUNCEMENT_CATEGORY = 'announcement_category'
EVENT_CATEGORY = 'event_category'
CITY = 'city'
COMPANY_TYPE = 'company_type'
COUNTRY = 'country'
LANGUAGE = 'language'

NOMENCLATURE_TYPES = (
    (ANNOUNCEMENT_CATEGORY, _('Announcement Category')),
    (CITY, _('City')),
    (COMPANY_TYPE, _('Company Type')),
    (COUNTRY, _('Country')),
    (EVENT_CATEGORY, _('Event Category')),
    (LANGUAGE, _('Language')),
)

PRIORITIES = (
    ('1', _('Very High')),
    (2, _('High')),
    (3, _('Medium')),
    (4, _('Low')),
    (5, _('Very Low'))
)


class Nomenclature(models.Model):
    name = models.CharField(max_length=255, verbose_name=_('name'))
    nomenclature_type = models.CharField(max_length=100, choices=NOMENCLATURE_TYPES,
                                         verbose_name=_('nomenclature type'))
    parent = models.ForeignKey('self', on_delete=DO_NOTHING, blank=True, null=True, verbose_name=_('parent'))
    logo = models.TextField(blank=True, null=True)
    priority = models.CharField(max_length=10, default=1,
                                choices=PRIORITIES,
                                verbose_name=_('priority'))
    active = models.BooleanField(verbose_name=_('active'))

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.active = True
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    def delete(self, *args, **kwargs):
        self.active = False
        self.save()

    def get_logo(self):
        if self.logo:
            return os.path.join(MEDIA_URL, self.logo.name)
        return os.path.join(STATIC_URL, 'img', 'avatar_default.png')

    @staticmethod
    def get_by_type(nomenclature_type):
        return Nomenclature.objects.filter(active=True, nomenclature_type=nomenclature_type)

    class Meta:
        db_table = 'Tb_Nomenclature'
        verbose_name = _('nomenclature')
        verbose_name_plural = _('nomenclatures')
        ordering = ('active', 'nomenclature_type', 'name')
