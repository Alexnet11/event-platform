from rest_framework import serializers
from organizations.serializers import OrganizationMembershipSerializer

from .models import User



class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = (
      "id",
      "username",
      "email",
      "first_name",
      "last_name",
    )
    
    
class CurrentUserSerializer(serializers.ModelSerializer):
  memberships = OrganizationMembershipSerializer(
    source = "organization_memberships",
    many=True,
    read_only=True, 
  ) 
  
  class Meta:
    model= User
    fields = (
      "id",
      "username",
      "email",
      "first_name",
      "last_name",
      "memberships",
    )