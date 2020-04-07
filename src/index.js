import * as THREE from 'three';
import DoctorGameEngine from './engine';

let renderer = null;
let scene = null;
let camera = null;

let pieceSize = 5;
let padding = 1;

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

// var geometry = new THREE.BoxGeometry();
// jvar geometry = new THREE.BufferGeometry().setFromPoints( points );
// jvar material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// jvar cube = new THREE.Mesh( geometry, material );


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

camera.position.z = 40;
camera.position.y = -25;
camera.position.x = 20;

var animate = function () {
    requestAnimationFrame( animate );

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    renderer.render( scene, camera );
};

animate();

let threeElement = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    let options = {
        height: 10,
        width: 8,
        numTypes: 4,
        minMatchSize: 3
    };

    let engine = new DoctorGameEngine(options);
    // https://threejs.org/docs/#manual/en/introduction/Drawing-lines
    let points = [];
    points.push( new THREE.Vector3( - 10, 0, 0 ) );
    points.push( new THREE.Vector3( 0, 10, 0 ) );
    points.push( new THREE.Vector3( 10, 0, 0 ) );

    let geometry = new THREE.BufferGeometry().setFromPoints( points );

    let material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

    let line = new THREE.Line( geometry, material );

    scene.add(line);
    renderer.render( scene, camera );
    return renderer.domElement;
};

// document.body.appendChild(threeElement());
// renderer.render( scene, camera );

