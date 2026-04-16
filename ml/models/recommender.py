def recommend_workout(goal='maintain', preferences=None):
    preferences = preferences or []
    base_routines = {
        'lose_weight': [
            '30-minute brisk walk',
            '20-minute HIIT circuit',
            '15-minute core strength session'
        ],
        'build_muscle': [
            '40-minute resistance training',
            'compound lifts: squats, deadlifts, bench press',
            '10-minute mobility work'
        ],
        'maintain': [
            '30-minute mixed cardio',
            '20-minute bodyweight strength',
            'stretching and recovery'
        ]
    }
    recommendation = base_routines.get(goal.lower(), base_routines['maintain'])

    if 'low impact' in [pref.lower() for pref in preferences]:
        recommendation = [
            '30-minute brisk walking',
            'gentle yoga flow',
            'low-impact strength work with bands'
        ]

    return recommendation
