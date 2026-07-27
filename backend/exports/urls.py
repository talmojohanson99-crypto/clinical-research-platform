from django.urls import path
from .views import export_csv, export_spss

urlpatterns = [
    path("csv/<uuid:etude_id>/", export_csv, name="export-csv"),
    path("spss/<uuid:etude_id>/", export_spss, name="export-spss"),
]
