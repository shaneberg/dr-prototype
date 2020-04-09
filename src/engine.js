// properties
// width
// height
//

// TODO - What should a cell look like?
// TODO - Can we do double array of

export default class DoctorGameEngine {
    // TODO - use dependency injection for game state
    constructor(options) {
        this.cursorPosition = {
            x: 0,
            y: 0
        };
        this.height = options.height;
        this.width = options.width;
        this.numTypes = options.numTypes;
        this.minMatchSize = options.minMatchSize;

        let initResult = this.initialize();

        this.printBoard();
    }

    isInBounds(x, y) {
        let isX = !(x < 0 || x > this.width);
        let isY = !(y < 0 || y > this.height);
        return isX && isY;
    }

    getCursorPosition() {
        return this.cursorPosition;

    }

    setCursorPosition(x, y) {
        if (isInBounds(x, y)) {
            this.cursorPosition = { x, y };
            return true;
        }
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

    initialize() {
        this.board = this.createBoard(this.height, this.width);
        return !!this.board;
    }

    getBoardMap() {
        return this.board;
    }

    getPiece(x, y) {
        return this.board[x][y];
    }

    printBoard() {
        let board = this.getBoardMap();
        // assume a square
        let rows = board[0].length;
        let cols = board.length;
        for (let i = 0; i < rows; i++) {
            let rowToPrint = `row ${i}: `;
            for (let j = 0; j < cols; j++) {
                rowToPrint += ' ' + board[j][i].type;
            }
            console.log(rowToPrint);
        }
    }
}
