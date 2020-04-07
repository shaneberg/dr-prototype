
let gameStates = [
    'uninitialized'
    'initializing',
    'ready',
    'clearing',
    'falling',
    'gameover'
];

// Tracks current state and enforces proper state transitions
class DoctorStateMachine {
    constructor() {
        this.state = 0;
    }

    getState() {
        return gameStates[this.state]
    }

    // 'initializing',
    // 'waiting',
    // 'clearing',
    // 'falling',
    // 'gameover'
    setState(state) {
        // return
    }
}
