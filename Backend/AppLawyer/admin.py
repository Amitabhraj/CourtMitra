from django.contrib import admin
from AppLawyer.models import Bookmark, Internship, LawyerProfile, Review, Specialization, User


admin.site.register(LawyerProfile)
admin.site.register(Specialization)
admin.site.register(Internship)
admin.site.register(Review)
admin.site.register(Bookmark)
