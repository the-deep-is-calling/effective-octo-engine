def compute_alert(weather):
    """
    weather = {
      "temperature": float,
      "rainfall": float,
      "wind_speed": float,
      "humidity": float
    }
    """

    temp = weather["temperature"]
    rain = weather["rainfall"]
    wind = weather["wind_speed"]

    severity = 0
    reasons = []

    # Example rule set — YOU CAN EXPAND THESE
    if temp > 40:
        severity += 2
        reasons.append("Extreme heat")

    if rain > 50:
        severity += 2
        reasons.append("Heavy rainfall")

    if wind > 80:
        severity += 3
        reasons.append("High wind speed")

    # Convert severity to category
    if severity >= 5:
        level = "RED"
    elif severity >= 3:
        level = "ORANGE"
    elif severity >= 1:
        level = "YELLOW"
    else:
        level = "GREEN"

    return {
        "severity_score": severity,
        "alert_level": level,
        "reasons": reasons
    }