from rest_framework import serializers
from organizations.serializers import OrganizationMembershipSerializer

from django.contrib.auth.password_validation import (validate_password,)
from django.core.exceptions import (ValidationError as DjangoValidationError,)
from django.db import transaction

from organizations.models import (Organization, OrganizationMembership,)

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
    
    
class OrganizerRegisterSerializer(
    serializers.ModelSerializer
):
    password = serializers.CharField(
        write_only=True,
    )

    organization_name = serializers.CharField(
        write_only=True,
        max_length=255,
    )

    organization_kind = serializers.ChoiceField(
        write_only=True,
        choices=Organization.Kind.choices,
    )

    class Meta:
        model = User

        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
            "organization_name",
            "organization_kind",
        )

        read_only_fields = (
            "id",
        )

    def validate_password(self, value):
        try:
            validate_password(value)

        except DjangoValidationError as error:
            raise serializers.ValidationError(
                error.messages
            )

        return value

    def validate_organization_name(
        self,
        value,
    ):
        value = value.strip()

        if Organization.objects.filter(
            name__iexact=value,
        ).exists():
            raise serializers.ValidationError(
                "Организатор с таким названием "
                "уже существует."
            )

        return value

    @transaction.atomic
    def create(self, validated_data):
        organization_name = (
            validated_data.pop(
                "organization_name"
            )
        )

        organization_kind = (
            validated_data.pop(
                "organization_kind"
            )
        )

        password = validated_data.pop(
            "password"
        )

        user = User.objects.create_user(
            password=password,
            **validated_data,
        )

        organization = (
            Organization.objects.create(
                name=organization_name,
                kind=organization_kind,
            )
        )

        OrganizationMembership.objects.create(
            user=user,
            organization=organization,
            role=(
                OrganizationMembership
                .Role
                .OWNER
            ),
        )

        return user
    
    
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