from rest_framework import serializers

from .models import Registration


class PublicRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = (
            "id",
            "first_name",
            "last_name",
            "email",
            "phone",
            "company",
            "position",
            "created_at",
        )

        read_only_fields = (
            "id",
            "created_at",
        )

    def validate_email(self, value):
        return value.strip().lower()

    def validate(self, attrs):
        event = self.context["event"]
        email = attrs["email"]

        registration_exists = Registration.objects.filter(
            event=event,
            email__iexact=email,
        ).exists()

        if registration_exists:
            raise serializers.ValidationError(
                {
                    "email": (
                        "This email is already registered "
                        "for this event."
                    )
                }
            )

        return attrs