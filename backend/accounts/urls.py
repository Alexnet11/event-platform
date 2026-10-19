from django.urls import path

from .views import CurrentUserView, UserListView, csrf_token_view, LogoutView, OrganizerRegisterView 


urlpatterns = [
    path("users/", UserListView.as_view(), name="user-list"),
    path("me/", CurrentUserView.as_view(), name = "current-user"),
    path("csrf/", csrf_token_view, name="csrf-token"),
    path("auth/register/", OrganizerRegisterView.as_view(), name="organizer-register"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    
    
]