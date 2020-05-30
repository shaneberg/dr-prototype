// app entry point
import DoctorGameEngine from './engine';
import WebView from './view';

let throttled = false;

let moveCursor = (xDelta, yDelta) => {
    if (throttled) {
        return;
    }

    throttled = true;

    if (engine.moveCursor(xDelta, yDelta)) {
        let position = engine.getCursorPosition();

        let newPosition = view.getCursorPosition(position.x, position.y);
        let cursor = view.getCursor();
        cursor.position.x = newPosition.x;
        cursor.position.y = newPosition.y;
    }

    setTimeout(() => throttled = false, 250);
};

let gamepadInit = false;

window.addEventListener('gamepadconnected', (event) => {
    console.log(`gamepadconnected:`);
    console.log(event);
    gamepadInit = true;
});

window.addEventListener('gamepaddisconnected', (event) => {
    console.log(`gamepaddisconnected:`);
    console.log(event);
    gamepadInit = false;
});

let cameraSpeed = 1;
document.body.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            camera.position.z -= cameraSpeed;
            break;
        case 's':
            camera.position.z += cameraSpeed;
            break;
        case 'a':
            camera.position.x -= cameraSpeed;
            break;
        case 'd':
            camera.position.x += cameraSpeed;
            break;
        case 'q':
            camera.position.y += cameraSpeed;
            break;
        case 'e':
            camera.position.y -= cameraSpeed;
            break;
        case 'j':
            moveCursor(0, 1);
            break;
        case 'k':
            moveCursor(0, -1);
            break;
        case 'l':
            moveCursor(1, 0);
            break;
        case 'h':
            moveCursor(-1, 0);
            break;
    }
});

let options = {
    height: 8,
    width: 9,
    numTypes: 4,
    minMatchSize: 3
};

let processControllerInput = () => {
    if (!gamepadInit) {
        return;
    }

    let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);

    for (let padIndex = 0; padIndex < gamepads.length; padIndex++) {
        let gamepad = gamepads[padIndex];

        if (!gamepad) {
            continue;
        }

        gamepad.axes.forEach((val, axesIndex) => {

            let rotationSpeed = 0.05;
            // Don't print neutral axes.
            if (val >= 0.004 || val <= -0.004) {
                // console.log(`axes ${axesIndex} with ${val}`);
                switch (axesIndex) {
                    case 0:
                        camera.position.x += cameraSpeed * val;
                        break;
                    case 1:
                        camera.position.z += cameraSpeed * val;
                        break;
                    case 2:
                        camera.rotation.y -= rotationSpeed * val;
                        break;
                    case 3:
                        camera.rotation.x += rotationSpeed * val;
                        break;
                    default:
                        break;
                }
            }
        });

        gamepad.buttons.forEach((val, buttonIndex) => {
            let pressed = (val == 1.0);
            let value = val;

            if (typeof(val) == "object") {
                pressed = val.pressed;
                value = val.value;
            }

            if (pressed) {
                console.log(`button ${buttonIndex} pressed on ${padIndex} with ${value}`);

                switch(buttonIndex) {
                    case 12:
                        moveCursor(0, -1);
                        break;
                    case 13:
                        moveCursor(0, 1);
                        break;
                    case 14:
                        moveCursor(-1, 0);
                        break;
                    case 15:
                        moveCursor(1, 0);
                        break;
                }
            }

        });
    }
};

let update = () => {
    processControllerInput();
};

let engine = new DoctorGameEngine(options);
let view = new WebView(engine);
let renderer = view.getRenderer();
let scene = view.getScene();
let camera = view.getCamera();

let enableOverlay = true;

let updateDebugText = () => {
    let time = new Date();
    let timeRunning = (time.getTime() - startTime.getTime()) / 1000;
    timeRunning = timeRunning.toFixed(1);
    overlay.innerHTML = `time running: ${timeRunning} seconds`;
    setTimeout(updateDebugText, 100);
};

let animate = () => {
    requestAnimationFrame( animate );
    update();
    renderer.render( scene, camera );
};

view.getRenderer().domElement.style.position = 'absolute';
let container = document.createElement('div');
container.style.position = 'relative';

let startTime = new Date();
let overlay = document.createElement('div');
overlay.innerHTML = 'debug overlay';
overlay.style.color = 'white';
overlay.style.position = 'absolute';
overlay.style.margin = '10px';
overlay.style.fontFamily = 'monospace';

container.appendChild(view.getRenderer().domElement);

enableOverlay && container.appendChild(overlay);
enableOverlay && updateDebugText();
document.body.appendChild(container);

animate();
