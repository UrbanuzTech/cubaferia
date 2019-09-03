import os

from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import DO_NOTHING
from django.utils.translation import gettext_lazy as _

from cubaferia.settings import MEDIA_URL, STATIC_URL
from rest.models import Nomenclature
from rest.models.nomenclature import ANNOUNCEMENT_CATEGORY, CITY


class GenericAnnouncement(models.Model):
    title = models.CharField(_('title'), max_length=255)
    description = models.TextField(_('description'), blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=DO_NOTHING, verbose_name=_('created by'))
    city = models.ForeignKey(Nomenclature, on_delete=DO_NOTHING,
                             related_name='%(app_label)s_%(class)s_city', verbose_name=_('city'))
    visit_count = models.PositiveIntegerField(_('visit count'), default=0)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    category = models.ForeignKey(Nomenclature, on_delete=DO_NOTHING,
                                 related_name='%(app_label)s_%(class)s_category', verbose_name=_('category'))
    phones = ArrayField(models.IntegerField(), verbose_name=_('phones'))
    emails = ArrayField(models.EmailField(), verbose_name=_('emails'))
    contact_name = models.CharField(_('contact name'), max_length=255, null=True, blank=True)
    address = models.TextField(_('address'), null=True, blank=True)
    main_image = models.FileField(_('main image'), upload_to='announcements', blank=True, null=True)
    image1 = models.FileField(_('image 1'), upload_to='announcements', blank=True, null=True)
    image2 = models.FileField(_('image 2'), upload_to='announcements', blank=True, null=True)
    image3 = models.FileField(_('image 3'), upload_to='announcements', blank=True, null=True)

    def get_main_image(self):
        if self.main_image:
            return os.path.join(MEDIA_URL, self.main_image.name)
        return os.path.join(STATIC_URL, 'img', 'avatar_default.png')

    def get_image1(self):
        if self.image1:
            return os.path.join(MEDIA_URL, self.image1.name)
        return os.path.join(STATIC_URL, 'img', 'avatar_default.png')

    def get_image2(self):
        if self.image2:
            return os.path.join(MEDIA_URL, self.image2.name)
        return os.path.join(STATIC_URL, 'img', 'avatar_default.png')

    def get_image3(self):
        if self.image3:
            return os.path.join(MEDIA_URL, self.image3.name)
        return os.path.join(STATIC_URL, 'img', 'avatar_default.png')

    @staticmethod
    def get_related_to(field):
        return {
            'city': CITY,
            'category': ANNOUNCEMENT_CATEGORY
        }[field]

    def __str__(self):
        return self.title

    class Meta:
        abstract = True


class Announcement(GenericAnnouncement):
    price = models.FloatField(_('price'), validators=[MinValueValidator(0)], )

    class Meta:
        db_table = 'Tb_Announcement'
        verbose_name = _('announcement')
        verbose_name_plural = _('announcements')
        ordering = ('-created_at',)

    def save(self, *args, **kwargs):
        self.price = self.price.__round__(2)
        return super().save(*args, **kwargs)


class Event(GenericAnnouncement):
    start_date = models.DateTimeField(_('start date'))
    end_date = models.DateTimeField(_('end date'))
    allow_children = models.BooleanField(_('allow children'))
    price_for_children = models.FloatField(_('price for children'), validators=[MinValueValidator(0)],
                                           null=True, blank=True)
    price_for_adults = models.FloatField(_('price for adults'), validators=[MinValueValidator(0)])

    class Meta:
        db_table = 'Tb_Event'
        verbose_name = _('event')
        verbose_name_plural = _('events')
        ordering = ('-created_at',)

    def save(self, *args, **kwargs):
        if self.allow_children:
            self.price_for_children = self.price_for_children.__round__(2)
        else:
            self.price_for_children = 0
        self.price_for_adults = self.price_for_adults.__round__(2)
        return super().save(*args, **kwargs)
