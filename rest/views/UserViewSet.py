from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from rest_framework import viewsets

from rest.serializers.UserSerializer import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
      API endpoint that allows Users to be viewed or edited.
      """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        self.request.data['password'] = make_password(self.request.data['password'])
        return super().create(request, *args, **kwargs)
