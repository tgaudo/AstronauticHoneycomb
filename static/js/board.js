class GameBoard {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.squares = 63;
        this.squareSize = 60;
        this.padding = 10;
        
        // Calculer les dimensions du canvas
        this.rows = 9;
        this.cols = 7;
        this.canvas.width = (this.cols * this.squareSize) + (this.padding * 2);
        this.canvas.height = (this.rows * this.squareSize) + (this.padding * 2);
        
        // Charger les images des pions
        this.player1Image = new Image();
        this.player2Image = new Image();
        this.player1Image.src = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f986.svg';
        this.player2Image.src = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f6f8.svg';
    }

    drawBoard() {
        this.ctx.fillStyle = '#1a237e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        let currentNumber = 1;
        for (let row = this.rows - 1; row >= 0; row--) {
            for (let col = row % 2 === 0 ? 0 : this.cols - 1; 
                 row % 2 === 0 ? col < this.cols : col >= 0; 
                 row % 2 === 0 ? col++ : col--) {
                
                if (currentNumber <= this.squares) {
                    const x = col * this.squareSize + this.padding;
                    const y = row * this.squareSize + this.padding;

                    // Dessiner la case
                    this.ctx.fillStyle = this.getSquareColor(currentNumber);
                    this.ctx.fillRect(x, y, this.squareSize - 2, this.squareSize - 2);

                    // Numéro de la case
                    this.ctx.fillStyle = '#ffffff';
                    this.ctx.font = '16px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(currentNumber.toString(), 
                                    x + this.squareSize/2, 
                                    y + this.squareSize/2);

                    currentNumber++;
                }
            }
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

    drawPlayers(positions) {
        positions.forEach((pos, index) => {
            if (pos === 0) return;

            const {x, y} = this.getCoordinatesForPosition(pos);
            const image = index === 0 ? this.player1Image : this.player2Image;
            
            this.ctx.drawImage(image, 
                x + this.squareSize/4, 
                y + this.squareSize/4,
                this.squareSize/2, 
                this.squareSize/2);
        });
    }

    getCoordinatesForPosition(position) {
        const row = Math.floor((position - 1) / this.cols);
        let col;
        
        if (row % 2 === 0) {
            col = (position - 1) % this.cols;
        } else {
            col = this.cols - 1 - ((position - 1) % this.cols);
        }

        return {
            x: col * this.squareSize + this.padding,
            y: (this.rows - 1 - row) * this.squareSize + this.padding
        };
    }

    update(positions) {
        this.drawBoard();
        this.drawPlayers(positions);
    }
}
