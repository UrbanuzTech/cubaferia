from rest_framework import serializers

from rest.models import Nomenclature
from rest.models.announcement import Event
from rest.models.nomenclature import EVENT_CATEGORY, CITY


class CategoryField(serializers.RelatedField):
    def to_representation(self, value):
        return str(value)

    def to_internal_value(self, data):
        value = Nomenclature.objects.get(id=data)
        return value


class CityField(serializers.RelatedField):
    def to_representation(self, value):
        return str(value)

    def to_internal_value(self, data):
        value = Nomenclature.objects.get(id=data)
        return value


class EventSerializer(serializers.ModelSerializer):
    category = CategoryField(queryset=Nomenclature.get_by_type(EVENT_CATEGORY))
    city = CityField(queryset=Nomenclature.get_by_type(CITY))

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'visit_count', 'created_at', 'phones', 'emails',
                  'contact_name', 'address', 'main_image', 'image1', 'image2', 'image3', 'start_date', 'end_date',
                  'allow_children', 'price_for_children', 'price_for_adults', 'category', 'city', 'created_by']
        read_only_fields = ['id', 'visit_count', 'created_at']
