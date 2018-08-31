from django.db import models
document_make_some_permission = 'document_custom_permission'

class Incident(models.Model):
    incidentId = models.AutoField(primary_key=True)
    loadDtm = models.DateTimeField()
    operator = models.CharField(max_length=1024, null=False)
    initiatorMail = models.CharField(max_length=1024, null=False)
    initiatorPhone = models.DecimalField(decimal_places=0, max_digits=20, null=False)
    incidentStatus = models.DecimalField(decimal_places=0, max_digits=4, null=False)
    incidentText = models.CharField(max_length=8000, null=False)
    serviceText = models.CharField(max_length=8000, null=True)
    
    def __str__(self):
        return "{} - {}".format(self.loadDtm, self.operator, self.initiatorMail, self.initiatorPhone, self.incidentStatus, self.incidentText, self.serviceText)
        #return "{} - {}".format(self.loadDtm, self.operator, self.initiatorMail, self.)
# Create your models here.
    
