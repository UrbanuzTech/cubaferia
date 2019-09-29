from django.contrib.auth.models import Permission


def __str__(self):
    return self.name


Permission.add_to_class('__str__', __str__)
