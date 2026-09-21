import os
import django
import random

# =========================================================
# CHANGE THIS TO YOUR DJANGO PROJECT SETTINGS
# =========================================================
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "LegalSystem.settings")
django.setup()

from django.contrib.auth import get_user_model
from AppStudent.models import StudentProfile
from AppLawyer.models import Specialization


User = get_user_model()


# =========================================================
# STUDENT PROFILE DATA
# =========================================================
STUDENT_DATA = {
    "ananya.sharma": {
        "college_name": "Delhi University",
        "course": "B.Tech Computer Science",
        "year": 2,
        "skills": (
            "Python, Django, React.js, JavaScript, "
            "SQL, Git, Data Structures"
        ),
    },

    "priya.verma": {
        "college_name": "Amity University",
        "course": "BBA LLB",
        "year": 3,
        "skills": (
            "Legal Research, MS Office, Legal Writing, "
            "Case Analysis, Communication"
        ),
    },

    "kavya.gupta": {
        "college_name": "Banaras Hindu University",
        "course": "LLB",
        "year": 2,
        "skills": (
            "Legal Research, Constitutional Law, "
            "Legal Documentation, Communication"
        ),
    },

    "sneha.patel": {
        "college_name": "Gujarat University",
        "course": "B.Com LLB",
        "year": 4,
        "skills": (
            "Corporate Law, Accounting, Legal Research, "
            "Taxation, Legal Drafting"
        ),
    },

    "ishita.reddy": {
        "college_name": "Osmania University",
        "course": "BA LLB",
        "year": 3,
        "skills": (
            "Criminal Law, Legal Research, Public Speaking, "
            "Case Analysis, Legal Writing"
        ),
    },
}


# =========================================================
# INTERESTED FIELDS
# =========================================================
INTERESTED_FIELDS = {
    "ananya.sharma": [
        "INTELLECTUAL PROPERTY LAW",
        "CORPORATE LAW",
        "CYBER LAW",
    ],

    "priya.verma": [
        "FAMILY LAW",
        "CIVIL LAW",
        "CONSTITUTIONAL LAW",
    ],

    "kavya.gupta": [
        "CONSTITUTIONAL LAW",
        "CRIMINAL LAW",
        "CIVIL LAW",
    ],

    "sneha.patel": [
        "CORPORATE LAW",
        "TAX LAW",
        "BANKRUPTCY LAW",
    ],

    "ishita.reddy": [
        "CRIMINAL LAW",
        "FAMILY LAW",
        "HUMAN RIGHTS LAW",
    ],
}


# =========================================================
# CREATE STUDENT PROFILES
# =========================================================
def create_student_profiles():

    students = User.objects.filter(role="STUDENT")

    created = 0
    skipped = 0

    print("\n==========================================")
    print("CREATING STUDENT PROFILES")
    print("==========================================\n")

    for user in students:

        # -------------------------------------------------
        # Skip if profile already exists
        # -------------------------------------------------
        if StudentProfile.objects.filter(user=user).exists():
            print(
                f"SKIPPED | {user.username} | "
                f"StudentProfile already exists"
            )
            skipped += 1
            continue

        # -------------------------------------------------
        # Get student data
        # -------------------------------------------------
        data = STUDENT_DATA.get(user.username)

        if not data:
            print(
                f"SKIPPED | {user.username} | "
                f"No student data found"
            )
            skipped += 1
            continue

        # -------------------------------------------------
        # Create Student Profile
        #
        # resume is intentionally NOT provided.
        # -------------------------------------------------
        profile = StudentProfile.objects.create(
            user=user,
            college_name=data["college_name"],
            course=data["course"],
            year=data["year"],
            skills=data["skills"],
        )

        # -------------------------------------------------
        # Assign interested fields
        # -------------------------------------------------
        field_names = INTERESTED_FIELDS.get(
            user.username,
            []
        )

        selected_fields = []

        for field_name in field_names:

            try:
                specialization = Specialization.objects.get(
                    name__iexact=field_name
                )

                selected_fields.append(specialization)

            except Specialization.DoesNotExist:
                print(
                    f"WARNING | Specialization not found: "
                    f"{field_name}"
                )

        if selected_fields:
            profile.interested_fields.set(selected_fields)

        print(
            f"CREATED | {user.username} | "
            f"{user.first_name} {user.last_name} | "
            f"College: {data['college_name']} | "
            f"Course: {data['course']} | "
            f"Year: {data['year']} | "
            f"Interested Fields: "
            f"{', '.join(s.name for s in selected_fields)}"
        )

        created += 1

    # =====================================================
    # SUMMARY
    # =====================================================
    print("\n==========================================")
    print("STUDENT PROFILE CREATION COMPLETED")
    print("==========================================")
    print(f"Profiles created : {created}")
    print(f"Profiles skipped : {skipped}")
    print(f"Student users found: {students.count()}")
    print("==========================================\n")


if __name__ == "__main__":
    create_student_profiles()