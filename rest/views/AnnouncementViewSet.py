from rest_framework import viewsets

from rest.models import Announcement
from rest.serializers.AnnouncementSerializer import AnnouncementSerializer


class AnnouncementViewSet(viewsets.ModelViewSet):
    """
      API endpoint that allows Announcements to be viewed or edited.
      """
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
