class Dice {
    constructor() {
        this.value = 1;
        this.rolling = false;
    }

    roll() {
        return new Promise((resolve) => {
            this.rolling = true;
            let rolls = 0;
            const maxRolls = 20;
            
            const rollAnimation = setInterval(() => {
                this.value = Math.floor(Math.random() * 6) + 1;
                document.getElementById('diceResult').textContent = this.value;
                rolls++;

                if (rolls >= maxRolls) {
                    clearInterval(rollAnimation);
                    this.rolling = false;
                    resolve(this.value);
                }
            }, 50);
        });
    }
}
