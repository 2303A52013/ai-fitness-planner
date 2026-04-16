def estimate_calories(age, weight, height, gender='male', activity_level='moderate'):
    try:
        age = float(age)
        weight = float(weight)
        height = float(height)
    except (TypeError, ValueError):
        return None

    if gender.lower() == 'female':
        bmr = 655.1 + 9.563 * weight + 1.85 * height - 4.676 * age
    else:
        bmr = 66.47 + 13.75 * weight + 5.003 * height - 6.755 * age

    factors = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'active': 1.725,
        'very_active': 1.9
    }
    activity = factors.get(activity_level.lower(), 1.55)
    return round(bmr * activity)
