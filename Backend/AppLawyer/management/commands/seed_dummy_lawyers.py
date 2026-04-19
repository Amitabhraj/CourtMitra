from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from AppLawyer.models import LawyerProfile, Specialization


class Command(BaseCommand):
    help = "Seed dummy lawyer users and lawyer profiles for testing recommendations"

    def add_arguments(self, parser):
        parser.add_argument(
            "--count",
            type=int,
            default=25,
            help="Number of lawyer profiles to create (recommended: 20-30)",
        )
        parser.add_argument(
            "--password",
            type=str,
            default="Pass@1234",
            help="Password to set for newly created dummy users",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        count = options["count"]
        password = options["password"]

        if count < 1:
            raise CommandError("Count must be at least 1")

        if count > 100:
            raise CommandError("Count too high for dummy seed. Use <= 100")

        user_model = get_user_model()

        specializations = self._ensure_specializations()
        cities = [
            "Delhi",
            "Mumbai",
            "Bengaluru",
            "Chennai",
            "Hyderabad",
            "Kolkata",
            "Pune",
            "Ahmedabad",
            "Jaipur",
            "Kochi",
        ]
        work_modes = ["District Court", "High Court", "Supreme Court", "Remote"]

        created_profiles = 0
        updated_profiles = 0

        for index in range(1, count + 1):
            username = f"lawyer_demo_{index:02d}"
            email = f"{username}@example.com"

            user, created_user = user_model.objects.get_or_create(
                username=username,
                defaults={
                    "email": email,
                    "role": "LAWYER",
                },
            )

            if created_user:
                user.set_password(password)
                user.save(update_fields=["password"])
            elif user.role != "LAWYER":
                user.role = "LAWYER"
                user.save(update_fields=["role"])

            city = cities[(index - 1) % len(cities)]
            work_mode = work_modes[(index - 1) % len(work_modes)]
            experience_years = 2 + ((index * 3) % 17)

            profile, created_profile = LawyerProfile.objects.get_or_create(
                user=user,
                defaults={
                    "experience_years": experience_years,
                    "address": f"{city}, India",
                    "mobile": f"900000{index:04d}",
                    "status": "ACTIVE",
                    "start_time": "09:30",
                    "end_time": "17:30",
                    "working_days": ["MON", "TUE", "WED", "THU", "FRI"],
                    "working_place": f"{work_mode} - {city}",
                    "about": (
                        f"Advocate with {experience_years} years of experience in "
                        f"legal drafting, client counseling, and court appearances in {city}."
                    ),
                    "profile_image": "lawyers/default-avatar.png",
                },
            )

            if created_profile:
                created_profiles += 1
            else:
                profile.status = "ACTIVE"
                if not profile.profile_image:
                    profile.profile_image = "lawyers/default-avatar.png"
                if not profile.about:
                    profile.about = (
                        f"Advocate practicing in {city} with focus on dispute resolution "
                        "and legal advisory."
                    )
                profile.save()
                updated_profiles += 1

            primary = specializations[(index - 1) % len(specializations)]
            secondary = specializations[(index + 3) % len(specializations)]
            profile.specialization.set([primary, secondary])

        self.stdout.write(self.style.SUCCESS(
            f"Dummy lawyers processed: requested={count}, created={created_profiles}, updated={updated_profiles}"
        ))
        self.stdout.write(
            f"Login pattern: lawyer_demo_01 ... lawyer_demo_{count:02d} | password: {password}"
        )

    def _ensure_specializations(self):
        available = []

        for value, _label in Specialization.SPECIALIZATION_CHOICES:
            specialization, _ = Specialization.objects.get_or_create(name=value)
            available.append(specialization)

        return available
