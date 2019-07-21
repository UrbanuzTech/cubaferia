from rest_framework import serializers

from rest.models import Announcement


class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = ['id', 'title', 'description', 'visit_count', 'created_at', 'published_at', 'phones', 'emails',
                  'contact_name', 'address', 'main_image', 'image1', 'image2', 'image3', 'price', 'category', 'city',
                  'created_by']
        read_only_fields = ['id']
