from rest_framework import serializers

from rest.models.announcement import Event


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'visit_count', 'created_at', 'published_at', 'phones', 'emails',
                  'contact_name', 'address', 'main_image', 'image1', 'image2', 'image3', 'start_date', 'end_date',
                  'allow_children', 'price_for_children', 'price_for_adults', 'category', 'city', 'created_by']
        read_only_fields = ['id']
