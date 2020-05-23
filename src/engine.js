
// DoctorGameEngine
class DoctorGameEngine {
    constructor(options) {
        this.cursorPosition = {
            x: 0,
            y: 0
        };

        this.height = options.height;
        this.width = options.width;
        this.numTypes = options.numTypes;
        this.minMatchSize = options.minMatchSize;

        this.board = this.createBoard(this.height, this.width);
    }

    isInBounds(x, y) {
        let isX = !(x < 0 || x >= this.width);
        let isY = !(y < 0 || y >= this.height);
        return isX && isY;
    }

    // returns false if we can't move
    moveCursor(xDelta, yDelta) {
        let curPosition = this.getCursorPosition();
        return this.setCursorPosition(curPosition.x + xDelta, curPosition.y + yDelta);
    }

    getCursorPosition() {
        return this.cursorPosition;
    }

    setCursorPosition(x, y) {
        if (this.isInBounds(x, y)) {
            this.cursorPosition = { x, y };
            return true;
        }

        console.log(`cannot move to ${x}, ${y} because it is out of bounds`);
        return false;
    }

    createBoard(height, width) {
        let board = [];
        for (let i = 0; i < width; i++) {
            if (!board[i]) {
                // new row of pieces
                board[i] = [];
            }

            let curRow = board[i];
            for (let j = 0; j < height; j++) {
                curRow[j] = this.createPiece(board, i, j);
            }
        }

        return board;
    }

    getRandomPieceType() {
        let types = [
            'a',
            'b',
            'c',
            'd',
            'e'
        ];

        return types[Math.floor(Math.random()*types.length)];
    }

    createPiece(board, x, y) {
        let type = this.getRandomPieceType();
        return {
            type,
            board,
            x,
            y
        };
    }

    getBoardMap() {
        return this.board;
    }

    getPiece(x, y) {
        return this.board[x][y];
    }
}

export default DoctorGameEngine;
