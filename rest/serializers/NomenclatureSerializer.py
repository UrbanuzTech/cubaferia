from rest_framework import serializers

from rest.models.nomenclature import Nomenclature


class NomenclatureSerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()
    real_logo = serializers.SerializerMethodField()

    def get_real_logo(self, obj):
        return obj.logo

    def get_logo(self, obj):
        if obj.logo:
            logo = str(obj.logo).replace('fa fa-', '').replace('fab fa-', '')
            return logo
        return ''

    class Meta:
        model = Nomenclature
        fields = ['id', 'name', 'nomenclature_type', 'active', 'parent', 'logo', 'real_logo']
        read_only_fields = ['id']
