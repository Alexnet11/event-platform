from django.urls import path

from .views import (PublicRegistrationCreateView, EventRegistrationListView, EventRegistrationDetailView)  


urlpatterns = [
    path("public/events/<slug:slug>/registrations/", PublicRegistrationCreateView.as_view(), name="public-registration-create"),
    path("events/<int:event_id>/registrations/", EventRegistrationListView.as_view(), name="event-registration-list"),
    path("events/<int:event_id>/registrations/<int:pk>/", EventRegistrationDetailView.as_view(), name="event-registration-detail"),
    
    
]