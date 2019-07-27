from django import forms
from django.contrib.auth.models import User
from django.contrib.postgres.fields import JSONField, ArrayField
from django.contrib.postgres.forms import SimpleArrayField, SplitArrayField
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import DO_NOTHING
from django.forms import TextInput
from django.utils.translation import gettext_lazy as _

from rest.models import Nomenclature


class GenericAnnouncement(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=DO_NOTHING)
    city = models.ForeignKey(Nomenclature, on_delete=DO_NOTHING, related_name='%(app_label)s_%(class)s_city')
    visit_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    category = models.ForeignKey(Nomenclature, on_delete=DO_NOTHING, related_name='%(app_label)s_%(class)s_category')
    phones = ArrayField(models.IntegerField())
    emails = ArrayField(models.EmailField())
    contact_name = models.CharField(max_length=255, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    main_image = models.FileField(upload_to='announcements', blank=True, null=True)
    image1 = models.FileField(upload_to='announcements', blank=True, null=True)
    image2 = models.FileField(upload_to='announcements', blank=True, null=True)
    image3 = models.FileField(upload_to='announcements', blank=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        abstract = True


class Announcement(GenericAnnouncement):
    price = models.FloatField(validators=[MinValueValidator(0)], )

    class Meta:
        db_table = 'Tb_Announcement'
        verbose_name = _('announcement')
        verbose_name_plural = _('announcements')
        ordering = ('-created_at',)

    def save(self, *args, **kwargs):
        self.price = self.price.__round__(2)
        return super().save(*args, **kwargs)


class Event(GenericAnnouncement):
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    allow_children = models.BooleanField()
    price_for_children = models.FloatField(validators=[MinValueValidator(0)])
    price_for_adults = models.FloatField(validators=[MinValueValidator(0)])

    class Meta:
        db_table = 'Tb_Event'
        verbose_name = _('event')
        verbose_name_plural = _('events')
        ordering = ('-created_at',)

    def save(self, *args, **kwargs):
        self.price_for_children = self.price_for_children.__round__(2)
        self.price_for_adults = self.price_for_adults.__round__(2)
        return super().save(*args, **kwargs)
