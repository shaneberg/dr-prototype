// app entry point
import DoctorGameEngine from './engine';
import WebView from './view';

let moveCursor = (xDelta, yDelta) => {
    if (engine.moveCursor(xDelta, yDelta)) {
        let position = engine.getCursorPosition();

        let newPosition = view.getCursorPosition(position.x, position.y);
        let cursor = view.getCursor();
        cursor.position.x = newPosition.x;
        cursor.position.y = newPosition.y;
    }
};

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

let engine = new DoctorGameEngine(options);
let view = new WebView(engine);
let renderer = view.getRenderer();
let scene = view.getScene();
let camera = view.getCamera();

var animate = function () {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
};

document.body.appendChild( view.getRenderer().domElement );

animate();
