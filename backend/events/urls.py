from django.urls import path

from .views import ( EventListView, PublicEventDetailView, PublicEventListView)


urlpatterns = [
  path("events/", EventListView.as_view(), name="event-list"),
  path("public/events", PublicEventListView.as_view(), name="public-event-list"),
  path("public/events/<slug:slug>", PublicEventDetailView.as_view(), name="public-event-detail"),
  
]


