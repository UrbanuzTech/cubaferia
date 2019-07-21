from rest_framework import viewsets

from rest.models.nomenclature import Nomenclature
from rest.serializers.NomenclatureSerializer import NomenclatureSerializer


class NomenclatureViewSet(viewsets.ModelViewSet):
    """
      API endpoint that allows Nomenclatures to be viewed or edited.
      """
    queryset = Nomenclature.objects.all()
    serializer_class = NomenclatureSerializer
