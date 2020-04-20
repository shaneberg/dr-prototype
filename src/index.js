import * as THREE from 'three';
import DoctorGameEngine from './engine';

let renderer = null;
let scene = null;
let camera = null;

let pieceSize = 5;
let padding = 1;
let cursorPadding = 0.5;
let cursorSize = pieceSize + cursorPadding;
let getColorFromType = (type) => {
    switch (type) {
        case 'a':
            return 0xFF0000;
        case 'b':
            return 0x0000FF;
        case 'c':
            return 0x00FF00;
        case 'd':
            return 0xFFD700;
        default:
            return 0x6A0DAD;
    }
};


let getLinesForCursor = (cursorPosition) => {
    let color = 0xFFFFFF;
    let x1 = (cursorPosition.x * cursorSize) + (cursorPadding * (cursorPosition.x + 1));
    let x2 = x1 + cursorSize + cursorPadding;
    let y1 = -((cursorPosition.y * cursorSize) + (cursorPadding * (cursorPosition.y + 1)));
    let y2 = (y1 - (cursorSize + cursorPadding));
    let points = [];
    points.push( new THREE.Vector3(x1, y1, 0));
    points.push( new THREE.Vector3(x1, y2, 0));
    points.push( new THREE.Vector3(x2, y2, 0));
    points.push( new THREE.Vector3(x2, y1, 0));
    points.push( new THREE.Vector3(x1, y1, 0));

    let geometry = new THREE.BufferGeometry().setFromPoints( points );
    let material = new THREE.ShaderMaterial(getLineMaterial());
    let line = new THREE.Line( geometry, material );
    return line;
};


let getVertexShader = () => {
    let vert = `
        varying vec3 vUv;

        void main() {
        vUv = position;

        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewPosition;
    }`;

    return vert;

};

let getFragmentShader = () => {
    let frag = `
      void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      }
    `;

    return frag;
};

let getLineMaterial = () => {
    let material =  new THREE.ShaderMaterial({
        uniforms: {},
        fragmentShader: getFragmentShader(),
        vertexShader: getVertexShader(),
    });
    return material;
};

let getLinesForPiece = (piece) => {
    let color = getColorFromType(piece.type);
    let x1 = (piece.x * pieceSize) + (padding * (piece.x + 1));
    let x2 = x1 + pieceSize;
    let y1 = -((piece.y * pieceSize) + (padding * (piece.y + 1)));
    let y2 = (y1 - pieceSize);
    let points = [];
    points.push( new THREE.Vector3(x1, y1, 0));
    points.push( new THREE.Vector3(x1, y2, 0));
    points.push( new THREE.Vector3(x2, y2, 0));
    points.push( new THREE.Vector3(x2, y1, 0));
    points.push( new THREE.Vector3(x1, y1, 0));

    let geometry = new THREE.BufferGeometry().setFromPoints( points );
    let material = new THREE.LineBasicMaterial( { color });
    let line = new THREE.Line( geometry, material );
    return line;
};

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 75, (window.innerWidth + 50)/(window.innerHeight + 50), 0.1, 1000 );
renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let moveCursor = (xDelta, yDelta) => {
    let curPosition = engine.getCursorPosition();

    if (engine.setCursorPosition(curPosition.x + xDelta, curPosition.y + yDelta)) {
        let newPosition = engine.getCursorPosition();
        cursor.position.x = newPosition.x * (pieceSize + padding);
        cursor.position.y = newPosition.y * (pieceSize + padding);
    } else {
        console.log(`cannot move ${xDelta}, ${yDelta} because it is out of bounds`);
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
            moveCursor(0, -1);
            break;
        case 'k':
            moveCursor(0, 1);
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
let board = engine.getBoardMap();
board.forEach((cols) => {
    cols.forEach((piece) => {
        let line = getLinesForPiece(piece);
        scene.add(line);
    });
});

let cursor = getLinesForCursor(engine.getCursorPosition());
scene.add(cursor);

camera.position.z = 40;
camera.position.y = -25;
camera.position.x = 20;

var animate = function () {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
};

animate();
