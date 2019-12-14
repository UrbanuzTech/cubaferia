from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.translation import gettext_lazy as _


class CustomAuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        username = self.request.data.get('username')
        password = self.request.data.get('password')
        if username and password:
            user = User.objects.filter(Q(emails__contains=[username]) | Q(phones__contains=[username]))
            if user:
                user = user.first()
                if user.is_active:
                    refresh = RefreshToken.for_user(user)
                    return Response({
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    })
                else:
                    return Response({
                        'message': _('Your account has been disabled.')
                    })
        return Response({
            'message': _('User with this email/phone and password does not exists.')
        })
