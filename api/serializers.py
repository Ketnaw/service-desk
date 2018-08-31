from rest_framework import serializers
from .models import Incident

class IncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident
        fields = ('loadDtm', 'operator', 'initiatorMail', 'initiatorPhone', 'incidentStatus', 'incidentText', 'serviceText', 'incidentId')
    
    def validatePhone(self, value):
        if not value:
            raise serializers.ValidationError("Error")
        return value
    
    def validate(self, data):
        if not data.get('initiatorPhone', None):
            raise serializers.ValidationError("Error")
        return data
