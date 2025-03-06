class GameState:
    def __init__(self):
        self.positions = [0, 0]  # Position des deux joueurs
        self.current_player = 0
        self.board_size = 63

        # Définition des cases spéciales
        self.special_squares = {
            6: ("Découverte d'une nouvelle galaxie! Avance de 6 cases", 12),
            19: ("Trou noir! Retour à la case départ", 0),
            31: ("Station spatiale! Attend qu'un autre joueur arrive", None),
            42: ("Pluie de météorites! Recule de 6 cases", 36),
            58: ("Propulsion ionique! Avance de 4 cases", 62)
        }

    @classmethod
    def from_dict(cls, data):
        """Crée une instance de GameState à partir d'un dictionnaire"""
        instance = cls()
        instance.positions = data['positions']
        instance.current_player = data['current_player']
        return instance

    def to_dict(self):
        """Convertit l'état du jeu en dictionnaire"""
        return {
            'positions': self.positions,
            'current_player': self.current_player
        }

    def process_turn(self, roll):
        current_pos = self.positions[self.current_player]
        new_pos = current_pos + roll
        message = f"Joueur {self.current_player + 1} avance de {roll} cases"
        game_over = False

        # Vérification des limites du plateau
        if new_pos > self.board_size:
            new_pos = self.board_size - (new_pos - self.board_size)
            message = f"Joueur {self.current_player + 1} rebondit!"

        # Vérification des cases spéciales
        if new_pos in self.special_squares:
            special_message, special_pos = self.special_squares[new_pos]
            if special_pos is not None:
                new_pos = special_pos
            message = special_message

        # Mise à jour de la position
        self.positions[self.current_player] = new_pos

        # Vérification de la victoire
        if new_pos == self.board_size:
            message = f"Joueur {self.current_player + 1} a gagné!"
            game_over = True
        else:
            # Change de joueur
            self.current_player = (self.current_player + 1) % 2

        return {
            'message': message,
            'game_over': game_over
        }