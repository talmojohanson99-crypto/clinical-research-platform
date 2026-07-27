"""
Moteur de scoring dynamique multi-études.
Calcule les scores à partir des règles définies dans chaque étude.
"""

from datetime import date, datetime
from typing import Any


def compute_age(dob: date | str | None) -> int | None:
    """Calcule l'âge à partir de la date de naissance."""
    if not dob:
        return None
    if isinstance(dob, str):
        try:
            dob = datetime.strptime(dob, "%Y-%m-%d").date()
        except ValueError:
            return None
    today = date.today()
    age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
    return age if 0 <= age < 130 else None


def compute_age_grp(dob: date | str | None) -> str | None:
    """Tranche d'âge : configurable par étude."""
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
    """IMC = poids / (taille en mètres)²"""
    if not poids or not taille or taille <= 0:
        return None
    m = taille / 100
    imc = poids / (m * m)
    return round(imc, 2) if 5 < imc < 100 else None


def imc_categorie(imc: float | None) -> str | None:
    """Catégorie IMC."""
    if imc is None:
        return None
    if imc < 18:
        return "1"
    if imc < 25:
        return "2"
    if imc < 30:
        return "3"
    return "4"


def compute_auto_calculs(data: dict[str, Any], calculs: list[str]) -> dict[str, Any]:
    """Calcule les valeurs automatiques demandées."""
    result = {}

    for calc in calculs:
        if calc == "age":
            result["age"] = compute_age(data.get("date_naissance"))
        elif calc == "age_grp":
            result["age_grp"] = compute_age_grp(data.get("date_naissance"))
        elif calc == "imc":
            result["imc"] = compute_imc(
                _to_float(data.get("poids_kg")),
                _to_float(data.get("taille_cm")),
            )
        elif calc == "imc_categorie":
            imc = compute_imc(
                _to_float(data.get("poids_kg")),
                _to_float(data.get("taille_cm")),
            )
            result["imc_categorie"] = imc_categorie(imc)

    return result


def compute_scores(data: dict[str, Any], rules: dict[str, Any]) -> dict[str, Any]:
    """
    Calcule tous les scores configurés dans rules.
    
    Format de rules :
    {
        "tests": [
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

    for test in rules.get("tests", []):
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


def process_reponse(data: dict[str, Any], etude_config: dict[str, Any]) -> dict[str, Any]:
    """
    Traite une réponse complète : calcule les scores et les calculs automatiques.
    
    etude_config = {
        "auto_calculs": ["age", "imc", ...],
        "scoring_rules": { "tests": [...] }
    }
    """
    # Calculs automatiques
    auto_calculs = compute_auto_calculs(data, etude_config.get("auto_calculs", []))
    
    # Scores
    scores = compute_scores(data, etude_config.get("scoring_rules", {}))
    
    return {
        "auto_calculs": auto_calculs,
        "scores": scores,
    }


def _to_float(v) -> float | None:
    if v is None:
        return None
    try:
        return float(str(v).replace(",", "."))
    except (ValueError, TypeError):
        return None
