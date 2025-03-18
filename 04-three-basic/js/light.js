import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

window.addEventListener('DOMContentLoaded', () => {

    function main() {
        const canvas = document.querySelector('#c');
        const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

        const fov = 45;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 100;

        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(0, 5, 10);

        const controls = new OrbitControls(camera, canvas);
        controls.target.set(0, 5, 0);
        controls.update();

        const scene = new THREE.Scene();

        const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;
        const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

        const loader = new THREE.TextureLoader();
        const texture = loader.load('images/wall.jpg');
        texture.colorSpace = THREE.SRGBColorSpace;

        const cubes = [
            makeInstance(geometry, 0xFFFFFF, 0),
            makeInstanceTexture(geometry, 0x8844aa, -2),
            makeInstanceTextures(geometry, 0xaa8844, 2),
        ];

        /*
                const color = 0xFFFFFF;
                const intensity = 1;
                const light = new THREE.AmbientLight(color, intensity);
                scene.add(light);
        */

        const skyColor = 0xB1E1FF;
        const groundColor = 0xB97A20;
        const intensity = 1;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light);

        const planeSize = 40;

        const textureFloor = loader.load('images/checker.png');
        textureFloor.wrapS = THREE.RepeatWrapping;
        textureFloor.wrapT = THREE.RepeatWrapping;
        textureFloor.magFilter = THREE.NearestFilter;
        textureFloor.colorSpace = THREE.SRGBColorSpace;
        const repeats = planeSize / 2;
        textureFloor.repeat.set(repeats, repeats);

        const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshPhongMaterial({
            map: textureFloor,
            side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.rotation.x = Math.PI * -.5;
        scene.add(mesh);

        renderer.render(scene, camera);

        function render(time) {
            time *= 0.001;  // convert time to seconds

            if (resizeRendererToDisplaySize(renderer)) {
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }

            cubes.forEach((cube, ndx) => {
                const speed = 1 + ndx * .1;
                const rot = time * speed;
                cube.rotation.x = rot;
                cube.rotation.y = rot;
            });

            renderer.render(scene, camera);

            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        function makeInstance(geometry, color, x) {
            const material = new THREE.MeshPhongMaterial({ color });
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);

            cube.position.x = x;
            cube.position.y = 2;

            return cube;
        }

        function makeInstanceTexture(geometry, color, x) {
            const material = new THREE.MeshBasicMaterial({ map: texture });

            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);

            cube.position.x = x;
            cube.position.y = 2;

            return cube;
        }

        function makeInstanceTextures(geometry, color, x) {
            const materials = [
                new THREE.MeshBasicMaterial({ map: loadColorTexture('images/flower-1.jpg') }),
                new THREE.MeshBasicMaterial({ map: loadColorTexture('images/flower-2.jpg') }),
                new THREE.MeshBasicMaterial({ map: loadColorTexture('images/flower-3.jpg') }),
                new THREE.MeshBasicMaterial({ map: loadColorTexture('images/flower-4.jpg') }),
                new THREE.MeshBasicMaterial({ map: loadColorTexture('images/flower-5.jpg') }),
                new THREE.MeshBasicMaterial({ map: loadColorTexture('images/flower-6.jpg') }),
            ];

            const cube = new THREE.Mesh(geometry, materials);
            scene.add(cube);

            cube.position.x = x;
            cube.position.y = 2;

            return cube;
        }

        function loadColorTexture(path) {
            const texture = loader.load(path);
            texture.colorSpace = THREE.SRGBColorSpace;
            return texture;
        }

        function resizeRendererToDisplaySize(renderer) {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            const needResize = canvas.width !== width || canvas.height !== height;
            if (needResize) {
                renderer.setSize(width, height, false);
            }
            return needResize;
        }

    }

    main();
});