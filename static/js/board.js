class GameBoard {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.squares = 63;
        this.squareSize = 60;  // Taille des cases
        this.padding = 20;

        // Calculer les dimensions du canvas pour la spirale
        this.canvas.width = 800;
        this.canvas.height = 800;

        // Charger les images des pions
        this.player1Image = new Image();
        this.player2Image = new Image();
        this.player1Image.src = '/static/assets/astronaut-goose.svg';
        this.player2Image.src = '/static/assets/astronaut-goose.svg';
    }

    drawBoard() {
        // Fond sombre pour l'espace
        this.ctx.fillStyle = '#0a0a2a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Dessiner quelques étoiles
        this.drawStars();

        // Centre de la spirale
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // Paramètres de la spirale
        const spiralSpacing = 80;  // Augmentation de l'espacement entre les anneaux
        const angleStep = 0.35;    // Augmentation du pas d'angle pour étaler la spirale

        // Dessiner les cases en spirale
        for (let i = 1; i <= this.squares; i++) {
            const angle = i * angleStep;
            const radius = spiralSpacing * angle / (2 * Math.PI);

            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            // Dessiner la case
            this.ctx.fillStyle = this.getSquareColor(i);
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.squareSize/2, 0, 2 * Math.PI);
            this.ctx.fill();

            // Numéro de la case
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 24px Arial';  // Police plus grande
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(i.toString(), x, y);
        }
    }

    drawStars() {
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 2;

            this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }

    getSquareColor(number) {
        // Cases spéciales
        const specialSquares = {
            6: '#4CAF50',    // Découverte galaxie
            19: '#F44336',   // Trou noir
            31: '#2196F3',   // Station spatiale
            42: '#FF9800',   // Météorites
            58: '#9C27B0'    // Propulsion
        };

        return specialSquares[number] || '#3f51b5';
    }

    getCoordinatesForPosition(position) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const spiralSpacing = 80;  // Mise à jour de l'espacement
        const angleStep = 0.35;    // Mise à jour du pas d'angle

        const angle = position * angleStep;
        const radius = spiralSpacing * angle / (2 * Math.PI);

        return {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        };
    }

    drawPlayers(positions) {
        positions.forEach((pos, index) => {
            if (pos === 0) return;

            const {x, y} = this.getCoordinatesForPosition(pos);
            const image = index === 0 ? this.player1Image : this.player2Image;

            this.ctx.drawImage(image, 
                x - this.squareSize/3, 
                y - this.squareSize/3,
                this.squareSize * 2/3, 
                this.squareSize * 2/3);
        });
    }

    update(positions) {
        this.drawBoard();
        this.drawPlayers(positions);
    }

    async playVictoryAnimation(winnerPosition) {
        const {x, y} = this.getCoordinatesForPosition(winnerPosition);
        const startY = y;
        const duration = 2000;
        const startTime = Date.now();

        const animate = () => {
            const currentTime = Date.now();
            const progress = (currentTime - startTime) / duration;

            if (progress < 1) {
                this.drawBoard();
                // Dessiner le gagnant qui s'envole
                const currentY = startY - (progress * this.canvas.height);
                this.ctx.drawImage(this.player1Image,
                    x - this.squareSize/3,
                    currentY - this.squareSize/3,
                    this.squareSize * 2/3,
                    this.squareSize * 2/3
                );
                requestAnimationFrame(animate);
            }
        };

        animate();
    }
}