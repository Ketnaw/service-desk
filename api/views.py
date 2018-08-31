from rest_framework import generics, mixins
from .models import Incident
from .serializers import IncidentSerializer
from datetime import datetime
from django.http.response import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import re

class ListIncidentView(generics.ListAPIView):
    queryset = Incident.objects.all().order_by('-incidentId')
    serializer_class = IncidentSerializer
   
@csrf_exempt 
def AddIncident(request):
    if request.method == 'POST':
        #rule = re.compile(r'/^[0-9]{10,14}$/')
        operator = request.POST.get('operator')
        initiatorMail = request.POST.get('initiatorMail')
        initiatorPhone = request.POST.get('initiatorPhone')
        incidentText = request.POST.get('incidentText')
        print(initiatorPhone)
        if re.match(r'[^@]+@[^@]+\.[^@]+', initiatorMail) and re.search(r'^\d{10}',initiatorPhone):
            incident = Incident(loadDtm=datetime.now().strftime("%Y-%m-%d %H:%M:%S"), operator=operator, initiatorMail=initiatorMail, initiatorPhone=initiatorPhone, incidentStatus=1, incidentText=incidentText)
            incident.save()
        
    return HttpResponse(request)

@csrf_exempt
def EditIncident(request):
    if request.method == 'POST':
        if request.POST.get('recId'):
            incident = Incident.objects.get(incidentId = request.POST.get('recId'))
            if request.POST.get('serviceComment'):
                serviceComment = request.POST.get('serviceComment')
                incident.serviceText = serviceComment
                incident.save()
                
            if request.POST.get('statusId'):
                incidentStatus = request.POST.get('statusId')
                incident.incidentStatus = incidentStatus
                incident.save()
                
    return HttpResponse(request)
