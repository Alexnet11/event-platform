from django.http import JsonResponse
from django.middleware.csrf import get_token

from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User
from .serializers import CurrentUserSerializer, UserSerializer, OrganizerRegisterSerializer


from django.contrib.auth import (login, logout,)
from django.utils.decorators import (method_decorator,)
from django.views.decorators.csrf import (csrf_protect,)
from rest_framework import status



class UserListView(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        users = User.objects.all()

        serializer = UserSerializer(
            users,
            many=True,
        )

        return Response(serializer.data)
    
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = CurrentUserSerializer(request.user)
        
        return Response(serializer.data)
    
    
    
def csrf_token_view(request):
    return JsonResponse(
        {
            "csrfToken": get_token(request),
        }
    )
    


@method_decorator(
    csrf_protect,
    name="dispatch",
)
class OrganizerRegisterView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = (
            OrganizerRegisterSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = serializer.save()

        login(
            request,
            user,
            backend=(
                "django.contrib.auth.backends."
                "ModelBackend"
            ),
        )

        return Response(
            UserSerializer(user).data,
            status=status.HTTP_201_CREATED,
        )
        
        
class LogoutView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def post(self, request):
        logout(request)

        return Response(
            status=status.HTTP_204_NO_CONTENT,
        )