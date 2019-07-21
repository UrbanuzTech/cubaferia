from rest_framework import viewsets

from rest.models.announcement import Event
from rest.serializers.EventSerializer import EventSerializer


class EventViewSet(viewsets.ModelViewSet):
    """
      API endpoint that allows Events to be viewed or edited.
      """
    queryset = Event.objects.all()
    serializer_class = EventSerializer
