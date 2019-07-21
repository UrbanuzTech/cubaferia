from rest_framework import serializers

from rest.models.nomenclature import Nomenclature


class NomenclatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nomenclature
        fields = ['id', 'name', 'nomenclature_type', 'active', 'parent']
        read_only_fields = ['id']
