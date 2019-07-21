from django.db import models
from django.db.models import DO_NOTHING
from django.utils.translation import gettext_lazy as _

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


class Nomenclature(models.Model):
    name = models.CharField(max_length=255)
    nomenclature_type = models.CharField(max_length=100, choices=NOMENCLATURE_TYPES)
    parent = models.ForeignKey('self', on_delete=DO_NOTHING, blank=True, null=True)
    active = models.BooleanField()

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.active = True
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    def delete(self, *args, **kwargs):
        self.active = False
        self.save()

    @staticmethod
    def get_by_type(nomenclature_type):
        return Nomenclature.objects.filter(active=True, nomenclature_type=nomenclature_type)

    class Meta:
        db_table = 'Tb_Nomenclature'
        verbose_name = _('nomenclature')
        verbose_name_plural = _('nomenclatures')
        ordering = ('active', 'nomenclature_type', 'name')
