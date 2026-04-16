from flask import Flask, jsonify, request
from flask_cors import CORS
from models.calorie_model import estimate_calories
from models.recommender import recommend_workout

app = Flask(__name__)
CORS(app)

class CalorieEstimator:
    def estimate(self, age=None, weight=None, height=None, gender='male', activity_level='moderate'):
        return estimate_calories(age, weight, height, gender, activity_level)

class WorkoutRecommendationEngine:
    def recommend(self, goal='maintain', preferences=None):
        return recommend_workout(goal, preferences)

estimator = CalorieEstimator()
recommender = WorkoutRecommendationEngine()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'ai fitness ml api'})

@app.route('/predict-calories', methods=['POST'])
def predict_calories():
    payload = request.json or {}
    age = payload.get('age')
    weight = payload.get('weight')
    height = payload.get('height')
    gender = payload.get('gender', 'male')
    activity_level = payload.get('activityLevel', payload.get('activity_level', 'moderate'))

    estimate = estimator.estimate(age=age, weight=weight, height=height, gender=gender, activity_level=activity_level)
    return jsonify({'calories': estimate})

@app.route('/workout-recommendation', methods=['POST'])
def workout_recommendation():
    payload = request.json or {}
    goal = payload.get('goal', 'maintain')
    preferences = payload.get('preferences', [])

    recommendation = recommender.recommend(goal=goal, preferences=preferences)
    return jsonify({'recommendation': recommendation})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
