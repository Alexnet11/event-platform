from django.urls import path

from .views import PublicRegistrationCreateView


urlpatterns = [
    path("public/events/<slug:slug>/registrations/", PublicRegistrationCreateView.as_view(), name="public-registration-create",),
    
]