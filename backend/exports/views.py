import io
import csv
import pandas as pd
import pyreadstat
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def export_csv(request, etude_id):
    """Export CSV des réponses d'une étude."""
    from surveys.models import Reponse
    from studies.models import Etude

    try:
        etude = Etude.objects.get(id=etude_id)
    except Etude.DoesNotExist:
        return HttpResponse("Étude introuvable", status=404)

    reponses = Reponse.objects.filter(etude=etude).select_related("patient")

    response = HttpResponse(content_type="text/csv; charset=utf-8")
    response["Content-Disposition"] = f'attachment; filename="{etude.nom}_export.csv"'

    writer = csv.writer(response, delimiter=";")

    # En-têtes de base
    headers = ["numero_id", "genre", "date_naissance", "periode", "filled_by", "statut"]
    
    # Ajouter toutes les clés de data
    all_keys = set()
    for r in reponses:
        all_keys.update(r.data.keys())
    headers.extend(sorted(all_keys))
    
    # Ajouter les scores
    all_scores = set()
    for r in reponses:
        all_scores.update(r.scores.keys())
    headers.extend(sorted(all_scores))
    
    # Ajouter les calculs auto
    all_calculs = set()
    for r in reponses:
        all_calculs.update(r.auto_calculs.keys())
    headers.extend(sorted(all_calculs))

    writer.writerow(headers)

    for r in reponses:
        row = [
            r.patient.numero_id,
            r.patient.genre,
            str(r.patient.date_naissance) if r.patient.date_naissance else "",
            r.periode,
            r.filled_by.username if r.filled_by else "",
            r.statut,
        ]
        for key in sorted(all_keys):
            val = r.data.get(key, "")
            if isinstance(val, list):
                val = ",".join(str(v) for v in val)
            row.append(val)
        for key in sorted(all_scores):
            val = r.scores.get(key, "")
            if isinstance(val, dict):
                val = val.get("score", "")
            row.append(val)
        for key in sorted(all_calculs):
            row.append(r.auto_calculs.get(key, ""))
        writer.writerow(row)

    return response


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def export_spss(request, etude_id):
    """Export SPSS (.sav) des réponses d'une étude."""
    from surveys.models import Reponse
    from studies.models import Etude

    try:
        etude = Etude.objects.get(id=etude_id)
    except Etude.DoesNotExist:
        return HttpResponse("Étude introuvable", status=404)

    reponses = Reponse.objects.filter(etude=etude).select_related("patient")

    rows = []
    for r in reponses:
        row = {
            "numero_id": r.patient.numero_id,
            "genre": r.patient.genre,
            "date_naissance": str(r.patient.date_naissance) if r.patient.date_naissance else None,
            "periode": r.periode,
            "statut": r.statut,
        }
        # Ajouter data
        for k, v in r.data.items():
            if isinstance(v, list):
                row[k] = ",".join(str(x) for x in v)
            else:
                row[k] = v
        # Ajouter scores
        for k, v in r.scores.items():
            if isinstance(v, dict):
                row[k] = v.get("score")
            else:
                row[k] = v
        # Ajouter calculs auto
        for k, v in r.auto_calculs.items():
            row[k] = v
        rows.append(row)

    df = pd.DataFrame(rows)

    # Labels depuis les questions
    column_labels = {
        "numero_id": "Numéro patient",
        "genre": "Genre",
        "date_naissance": "Date de naissance",
        "periode": "Période",
        "statut": "Statut",
    }
    
    for section in etude.sections.prefetch_related("questions").all():
        for q in section.questions.all():
            if q.spss_name:
                column_labels[q.name] = q.spss_label or q.label_fr

    # Labels de valeurs
    variable_value_labels = {}
    for section in etude.sections.prefetch_related("questions").all():
        for q in section.questions.all():
            if q.choices and q.type in ("select_one", "select_multiple"):
                variable_value_labels[q.name] = {
                    c["value"]: c["fr"] for c in q.choices
                }

    buffer = io.BytesIO()
    pyreadstat.write_sav(
        df, buffer,
        column_labels=column_labels,
        variable_value_labels=variable_value_labels,
    )

    response = HttpResponse(buffer.getvalue(), content_type="application/x-spss-sav")
    response["Content-Disposition"] = f'attachment; filename="{etude.nom}.sav"'
    return response
