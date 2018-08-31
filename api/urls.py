from django.urls import path
from . import views
from .views import ListIncidentView, AddIncident, EditIncident

urlpatterns = [
    path('incident/', ListIncidentView.as_view(), name="incident-all"),
    path('addIncident/', views.AddIncident, name="incident-add"),
    path('editIncident/', views.EditIncident, name="incident-edit")
]
