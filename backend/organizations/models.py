from django.conf import settings
from django.db import models


class Organization(models.Model):
    class Kind(models.TextChoices):
        INDIVIDUAL = "individual", "Частный организатор"
        ORGANIZATION = "organization", "Организация / команда"

    name = models.CharField(
        max_length=200,
        unique=True,
    )

    kind = models.CharField(
        max_length=20,
        choices=Kind.choices,
        default=Kind.ORGANIZATION,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through="OrganizationMembership",
        related_name="organizations",
    )

    def __str__(self):
        return self.name


class OrganizationMembership(models.Model):
    class Role(models.TextChoices):
        OWNER = "owner", "Владелец"
        ADMIN = "admin", "Admin"
        MANAGER = "manager", "Manager"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="organization_memberships",
    )

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="memberships",
    )

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.MANAGER,
    )

    @classmethod
    def organizer_roles(cls):
        return (
            cls.Role.OWNER,
            cls.Role.ADMIN,
            cls.Role.MANAGER,
        )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "organization"],
                name="unique_user_organization_membership",
            )
        ]

    def __str__(self):
        return (
            f"{self.user} - "
            f"{self.organization} "
            f"({self.role})"
        )