from django.contrib.auth.models import Permission
from django.utils.translation import gettext_lazy as _


def __str__(self):
    return str(_(self.name))


Permission.add_to_class('__str__', __str__)
