import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let pdbStringPromise = fetch("1bxn.pdb");



function displayString(pdbString) {
    let pdbSplitAtoms = pdbString.split("\n")
    .filter(el => el.includes("ATOM "));

    let allAtomCoords = [];
    for (const line of pdbSplitAtoms) {
        let atom = line.split(/\s+/);
        let atomDOM = document.createElement("p");
        allAtomCoords.push([parseFloat(atom[6]),parseFloat(atom[7]),parseFloat(atom[8])])
      }

    let minVals = [
        allAtomCoords[0][0],
        allAtomCoords[0][1],
        allAtomCoords[0][2],
    ];
    let maxVals = [
        allAtomCoords[0][0],
        allAtomCoords[0][1],
        allAtomCoords[0][2],
    ];

    for(const atomCoords of allAtomCoords){
        for(let i in atomCoords){

           minVals[i] = atomCoords[i] < minVals[i] ? atomCoords[i]: minVals[i];
           maxVals[i] = atomCoords[i] > maxVals[i] ? atomCoords[i]: maxVals[i];
        }
    }

    return allAtomCoords;

}

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth / 2, window.innerHeight/ 2);
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 800 );
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );

const scene = new THREE.Scene();
const points = [];


let allAtomCoords;
await pdbStringPromise.then(response => response.text()).then(response => allAtomCoords = displayString(response));


const atomGeometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const atomMesh = new THREE.InstancedMesh(atomGeometry,material,1000)

scene.add(atomMesh)
const parent = new THREE.Object3D();

for(let i = 0; i < 1000 ; i++){
    parent.position.x = Math.random() * 40 - 20;
    parent.position.y = Math.random() * 40 - 20;
    parent.position.z = Math.random() * 40 - 20;
    parent.color
    parent.updateMatrix()
    atomMesh.setMatrixAt(i,parent.matrix);

}

const controls = new OrbitControls( camera, renderer.domElement );
controls.update();


function animate(){
    
    requestAnimationFrame( animate );
    
    controls.update()
    renderer.render( scene, camera );

}

animate();





