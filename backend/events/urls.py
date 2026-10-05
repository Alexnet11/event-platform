from django.urls import path

from .views import ( EventListView, PublicEventDetailView, PublicEventListView, EventDetailView, EventListCreateView,)


urlpatterns = [
  path("events/", EventListCreateView.as_view(), name="event-list"),
  path( "events/<int:pk>/", EventDetailView.as_view(), name= "event-detail"),
  path("public/events", PublicEventListView.as_view(), name="public-event-list"),
  path("public/events/<slug:slug>", PublicEventDetailView.as_view(), name="public-event-detail"),
  
  
]


