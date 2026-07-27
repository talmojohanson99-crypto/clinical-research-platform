from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/", include("studies.urls")),
    path("api/", include("surveys.urls")),
    path("api/export/", include("exports.urls")),
]
