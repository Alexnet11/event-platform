from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User
from .serializers import CurrentUserSerializer, UserSerializer


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
    
    