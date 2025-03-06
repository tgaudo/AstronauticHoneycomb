document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const rollButton = document.getElementById('rollDice');
    const newGameButton = document.getElementById('newGame');
    const diceResult = document.getElementById('diceResult');
    const gameMessage = document.getElementById('gameMessage');
    const currentPlayerDisplay = document.getElementById('current-player');

    const gameBoard = new GameBoard(canvas);
    gameBoard.drawBoard();

    rollButton.addEventListener('click', async () => {
        rollButton.disabled = true;
        
        try {
            const response = await fetch('/roll_dice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            // Afficher le résultat du dé
            diceResult.textContent = `Dé: ${data.roll}`;
            
            // Mettre à jour le message
            gameMessage.textContent = data.message;
            
            // Mettre à jour le joueur actuel
            currentPlayerDisplay.textContent = data.currentPlayer + 1;
            
            // Mettre à jour le plateau
            gameBoard.update(data.positions);

            if (data.gameOver) {
                rollButton.disabled = true;
                setTimeout(() => {
                    alert("Partie terminée! " + data.message);
                }, 500);
            } else {
                rollButton.disabled = false;
            }
        } catch (error) {
            console.error('Erreur:', error);
            gameMessage.textContent = "Une erreur est survenue";
            rollButton.disabled = false;
        }
    });

    newGameButton.addEventListener('click', async () => {
        try {
            await fetch('/new_game', {
                method: 'POST'
            });
            
            // Réinitialiser l'interface
            diceResult.textContent = '';
            gameMessage.textContent = '';
            currentPlayerDisplay.textContent = '1';
            rollButton.disabled = false;
            
            // Redessiner le plateau
            gameBoard.update([0, 0]);
        } catch (error) {
            console.error('Erreur:', error);
            gameMessage.textContent = "Erreur lors du démarrage d'une nouvelle partie";
        }
    });
});
