"""
Moteur de scoring dynamique.
Calcule les scores à partir des règles définies dans l'étude.
"""

from datetime import date
from typing import Any


def compute_age(dob: date | None) -> int | None:
    if not dob:
        return None
    today = date.today()
    age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
    return age if 0 <= age < 130 else None


def compute_age_grp(dob: date | None) -> str | None:
    age = compute_age(dob)
    if age is None:
        return None
    if age < 45:
        return "1"
    if age < 65:
        return "2"
    if age < 75:
        return "3"
    return "4"


def compute_imc(poids: float | None, taille: float | None) -> float | None:
    if not poids or not taille or taille <= 0:
        return None
    m = taille / 100
    imc = poids / (m * m)
    return round(imc, 2) if 5 < imc < 100 else None


def imc_categorie(imc: float | None) -> str | None:
    if imc is None:
        return None
    if imc < 18:
        return "1"
    if imc < 25:
        return "2"
    if imc < 30:
        return "3"
    return "4"


def compute_scores(data: dict[str, Any], rules: dict[str, Any]) -> dict[str, Any]:
    """
    Calcule tous les scores configurés dans rules.
    
    Format de rules :
    {
        "auto": ["age", "age_grp", "imc", "imc_categorie"],
        "test_scores": [
            {
                "name": "score_test1",
                "max": 20,
                "questions": {
                    "q1": {"type": "single", "correct": "1"},
                    "q2": {"type": "multi", "correct": ["1", "3"]},
                    ...
                }
            }
        ]
    }
    """
    scores = {}

    # Calculs automatiques
    auto = rules.get("auto", [])
    if "age" in auto:
        dob = data.get("date_naissance")
        if dob:
            from datetime import datetime
            if isinstance(dob, str):
                dob = datetime.strptime(dob, "%Y-%m-%d").date()
            scores["age"] = compute_age(dob)
    if "age_grp" in auto:
        dob = data.get("date_naissance")
        if dob:
            from datetime import datetime
            if isinstance(dob, str):
                dob = datetime.strptime(dob, "%Y-%m-%d").date()
            scores["age_grp"] = compute_age_grp(dob)
    if "imc" in auto:
        scores["imc"] = compute_imc(
            _to_float(data.get("poids_kg")),
            _to_float(data.get("taille_cm")),
        )
    if "imc_categorie" in auto:
        scores["imc_categorie"] = imc_categorie(scores.get("imc"))

    # Scores de tests (Michigan, Test 1, etc.)
    for test in rules.get("test_scores", []):
        name = test["name"]
        max_score = test.get("max", 20)
        questions = test.get("questions", {})
        correct = 0
        total = 0

        for q_name, q_rule in questions.items():
            total += 1
            q_type = q_rule.get("type", "single")
            q_correct = q_rule.get("correct")
            user_answer = data.get(q_name)

            if q_type == "single":
                if str(user_answer) == str(q_correct):
                    correct += 1
            elif q_type == "multi":
                if isinstance(user_answer, list) and isinstance(q_correct, list):
                    for v in user_answer:
                        if str(v) in [str(c) for c in q_correct]:
                            correct += 1

        score = round((correct / total) * max_score, 1) if total else 0
        scores[name] = {
            "score": score,
            "points": correct,
            "total": total,
        }

    return scores


def _to_float(v) -> float | None:
    if v is None:
        return None
    try:
        return float(str(v).replace(",", "."))
    except (ValueError, TypeError):
        return None
