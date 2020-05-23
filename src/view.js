import * as THREE from 'three';

import cursorFragShader from './cursor.frag.glsl';
import cursorVertShader from './cursor.vert.glsl';

class WebView {
    constructor(engine) {
        this.engine = engine;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, (window.innerWidth + 50)/(window.innerHeight + 50), 0.1, 1000 );
        this.camera.position.z = 40;
        this.camera.position.y = -25;
        this.camera.position.x = 20;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        this.pieceSize = 5;
        this.padding = 1;
        this.cursorPadding = 0.5;
        this.cursorSize = this.pieceSize + this.cursorPadding;

        let board = this.engine.getBoardMap();
        board.forEach((cols) => {
            cols.forEach((piece) => {
                let line = this.getLinesForPiece(piece);
                this.scene.add(line);
            });
        });

        let cursorPosition = this.engine.getCursorPosition();
        let cursorViewPosition = this.getCursorPosition(cursorPosition.x, cursorPosition.y);
        this.cursor = this.getLinesForCursor(cursorViewPosition.x, cursorViewPosition.y)
        this.scene.add(this.cursor);
    }

    getCamera() {
        return this.camera;
    }

    getScene() {
        return this.scene;
    }

    getCursor() {
        return this.cursor;
    }

    getColorFromType(type) {
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
    }

    getLinesForCursor(x, y) {
        let color = 0xFFFFFF;
        let x1 = (x * this.cursorSize) + (this.cursorPadding * (x + 1));
        let x2 = x1 + this.cursorSize + this.cursorPadding;
        let y1 = -((y * this.cursorSize) + (this.cursorPadding * (y + 1)));
        let y2 = (y1 - (this.cursorSize + this.cursorPadding));
        let points = [];
        points.push( new THREE.Vector3(x1, y1, 0));
        points.push( new THREE.Vector3(x1, y2, 0));
        points.push( new THREE.Vector3(x2, y2, 0));
        points.push( new THREE.Vector3(x2, y1, 0));
        points.push( new THREE.Vector3(x1, y1, 0));

        let geometry = new THREE.BufferGeometry().setFromPoints( points );
        let material = new THREE.ShaderMaterial(this.getLineMaterial());
        let line = new THREE.Line( geometry, material );
        return line;
    }

    getLinesForPiece(piece) {
        let color = this.getColorFromType(piece.type);
        let x1 = (piece.x * this.pieceSize) + (this.padding * (piece.x + 1));
        let x2 = x1 + this.pieceSize;
        let y1 = -((piece.y * this.pieceSize) + (this.padding * (piece.y + 1)));
        let y2 = (y1 - this.pieceSize);
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
    }

    getLineMaterial() {
        let material =  new THREE.ShaderMaterial({
            uniforms: {},
            fragmentShader: cursorFragShader,
            vertexShader: cursorVertShader,
        });
        return material;
    }

    getRenderer() {
        return this.renderer;
    }

    // Retrieves the cursor position from the engine and translates into the current
    // view of the game (coordinate system, piece size, etc).
    getCursorPosition(x, y) {
        let cursorPosition = {
            x: x * (this.pieceSize + this.padding),
            y: -y * (this.pieceSize + this.padding)
        };

        return cursorPosition;
    }
}

export default WebView;
