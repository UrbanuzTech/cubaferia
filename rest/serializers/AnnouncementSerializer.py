from rest_framework import serializers

from rest.models import Announcement, Nomenclature
from rest.models.nomenclature import CITY, ANNOUNCEMENT_CATEGORY


class CategoryField(serializers.RelatedField):
    def to_representation(self, value):
        return value


class CityField(serializers.RelatedField):
    def to_representation(self, value):
        return value


class AnnouncementSerializer(serializers.ModelSerializer):
    category = CategoryField(queryset=Nomenclature.get_by_type(ANNOUNCEMENT_CATEGORY))
    city = CityField(queryset=Nomenclature.get_by_type(CITY))

    class Meta:
        model = Announcement
        fields = ['id', 'title', 'description', 'published_at', 'phones', 'emails',
                  'contact_name', 'address', 'main_image', 'image1', 'image2', 'image3', 'price', 'category', 'city',
                  'created_by']
        read_only_fields = ['id', 'visit_count', 'created_at']
