from flask import Flask, render_template, jsonify, request, session
import os
import random
from game_logic import GameState

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev_key")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/game')
def game():
    return render_template('game.html')

@app.route('/roll_dice', methods=['POST'])
def roll_dice():
    if 'game_state' not in session:
        # Initialiser un nouvel état de jeu dans la session
        session['game_state'] = {
            'positions': [0, 0],
            'current_player': 0
        }

    # Créer une instance de GameState avec les données de la session
    game_state = GameState.from_dict(session['game_state'])

    # Lancer le dé et traiter le tour
    roll = random.randint(1, 6)
    result = game_state.process_turn(roll)

    # Mettre à jour l'état dans la session
    session['game_state'] = game_state.to_dict()

    return jsonify({
        'roll': roll,
        'currentPlayer': game_state.current_player,
        'positions': game_state.positions,
        'message': result['message'],
        'gameOver': result['game_over']
    })

@app.route('/new_game', methods=['POST'])
def new_game():
    # Réinitialiser l'état du jeu dans la session
    session['game_state'] = {
        'positions': [0, 0],
        'current_player': 0
    }
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)