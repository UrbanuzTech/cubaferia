from django.contrib.auth.models import User
from django.contrib.postgres.fields import JSONField
from django.db import models
from django.db.models import DO_NOTHING

from rest.models import Nomenclature

User.add_to_class('phones', JSONField(blank=True, null=True))
User.add_to_class('emails', JSONField(blank=True, null=True))
User.add_to_class('avatar', models.FileField(upload_to='avatars', blank=True, null=True))
User.add_to_class('address', models.TextField(blank=True, null=True))
User.add_to_class('nationality', models.ForeignKey(Nomenclature, blank=True, null=True, on_delete=DO_NOTHING))
User.add_to_class('allow_notifications', models.BooleanField(default=False))
