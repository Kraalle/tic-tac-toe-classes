// Gameboard needs to hold board, allow moves, checks winner, checks
// tiles full,  resets board

class Gameboard {
    constructor() {
        this.board = [
            ['[ ]', '[ ]', '[ ]'],
            ['[ ]', '[ ]', '[ ]'],
            ['[ ]', '[ ]', '[ ]']
        ]
    }

    makeMove(row, col, symbol) {
        if (this.board[row][col] === '[ ]') {
            this.board[row][col] = `[${symbol}]`;
            this.getBoardVisual();
            return true; // successful move
        }

        return false; // unsuccessful move
    }

    checkWinner() {
        // check rows
        for (let row = 0; row < 3; row++) {
            if (
                this.board[row][0] !== '[ ]' &&
                this.board[row][0] === this.board[row][1] &&
                this.board[row][1] === this.board[row][2]
            ) {
                return true;
            }
        }

        // check columns
        for (let col = 0; col < 3; col++) {
            if (
                this.board[0][col] !== '[ ]' &&
                this.board[0][col] === this.board[1][col] &&
                this.board[1][col] === this.board[2][col]
            ) {
                return true;
            }
        }

        // check diagonal
        if (
            (this.board[0][0] !== '[ ]' &&
            this.board[0][0] === this.board[1][1] &&
            this.board[1][1] === this.board[2][2]) ||
            (this.board[0][2] !== '[ ]' &&
            this.board[0][2] === this.board[1][1] &&
            this.board[1][1] === this.board[2][0])
        ) {
            return true;
        }

        return false;
    }

    isBoardFull() {
        for (const row of this.board) {
            for (const cell of row) {
                if (cell === '[ ]') {
                    return false;
                }
            }
        }

        return true;
    }

    getBoardVisual() {
        for(const row of this.board) {
            console.log(row.join(' '));
        }
    }

    getBoard() {
        return this.board.slice();
    }

    resetBoard() {
        this.board = [
            ['[ ]', '[ ]', '[ ]'],
            ['[ ]', '[ ]', '[ ]'],
            ['[ ]', '[ ]', '[ ]']
        ] 
    }

};

class Player {
    constructor(symbol) {
        this._symbol = symbol;
    }

    getSymbol() {
        return this._symbol;
    }
}
 // makemove, switch player, checkGameStatus, resetGame(), getCurrentBoard();
class GameController {
    constructor(player1, player2) {
        this.players = [player1, player2];
        this.currentPlayerIndex = 0;
        this.gameboard = new Gameboard();
        this.gameOver = false;
    }

    makeMove(row, col) {
        let resultMessage = '';

        if (this.gameOver) {
            resultMessage = 'Game is over!';
        } else {
            const currentPlayer = this.players[this.currentPlayerIndex];
            const moveSuccess = this.gameboard.makeMove(row, col, currentPlayer.getSymbol());
            if (!moveSuccess) {
                resultMessage = 'Invalid move. Try again';
            } else {
                this.checkGameStatus();

                if (!this.gameOver) {
                    this.switchPlayer();
                    resultMessage = `${this.players[this.currentPlayerIndex].getSymbol()}'s turn`;
                }

            }
        }
        return { message: resultMessage, success: !this.gameOver};
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    switchPlayer() {
        this.currentPlayerIndex = 1 - this.currentPlayerIndex;
    }

    checkGameStatus() {
        if (this.gameboard.checkWinner()) {
            const winner = this.players[this.currentPlayerIndex];
            console.log(`Player ${winner.getSymbol()} wins!`);
            this.gameOver = true;
            return `Player ${winner.getSymbol()} wins!`;
        } else if (this.gameboard.isBoardFull()) {
            console.log('It\'s a tie!');
            this.gameOver = true;
            return "It's a tie!";
        }
    }

    resetGame() {
        this.gameboard.resetBoard();
        this.gameOver = false;
        this.currentPlayerIndex = 0;
        console.log('Game reset. Player X starts.');
    }

    getCurrentBoard() {
        return this.gameboard.getBoard();
    }

    getGameStatus() {
        return this.gameOver;
    }
}

// create EventListeners, adds symbol, 
class UserInterface {
    constructor(gameController) {
        this.gameController = gameController;
        this.attachEventListeners();
    }

    attachEventListeners() {
        const tiles = document.querySelectorAll('.game-tile');

        tiles.forEach(tile => {
            tile.addEventListener('click', (event) => {
                const colValue = tile.dataset.col;
                const rowValue = tile.dataset.row;
                this.handleSquareClick(colValue, rowValue, tile);
            });
        });
    }

    handleSquareClick(row, col, tile) {
        if (!this.gameController.getGameStatus()) {
            tile.textContent = this.gameController.getCurrentPlayer().getSymbol();
            this.gameController.makeMove(col, row, tile);
        }   
    }

}


const playerX = new Player('X');
const playerO = new Player('O');
const gameController = new GameController(playerX, playerO);
const game = new UserInterface(gameController);

