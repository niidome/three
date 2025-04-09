import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

window.addEventListener('DOMContentLoaded', () => {

    function main() {
        const canvas = document.querySelector('#c');
        const view1Elem = document.querySelector('#view1');
        const view2Elem = document.querySelector('#view2');
        const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

        const fov = 45;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 100;

        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(0, 5, 10);

        const camera2 = new THREE.PerspectiveCamera(60, 2, 0.1, 500);
        camera2.position.set(40, 10, 30);
        camera2.lookAt(0, 5, 0);

        const controls = new OrbitControls(camera, view1Elem);
        controls.target.set(0, 5, 0);
        controls.update();

        const controls2 = new OrbitControls(camera2, view2Elem);
        controls2.target.set(0, 5, 0);
        controls2.update();

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xAAAAAA);

        // const cameraHelper = new THREE.CameraHelper(camera);
        // scene.add(cameraHelper);

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

        const colorAmbient = 0xFFFFFF;
        const intensityAmbient = 0.2;
        const lightAmbient = new THREE.AmbientLight(colorAmbient, intensityAmbient);
        scene.add(lightAmbient);

        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 10, 0);
        light.target.position.set(-5, 0, 0);
        scene.add(light);
        scene.add(light.target);

        const planeSize = 40;

        const textureFloor = loader.load('images/checker.png');
        textureFloor.wrapS = THREE.RepeatWrapping;
        textureFloor.wrapT = THREE.RepeatWrapping;
        textureFloor.magFilter = THREE.NearestFilter;
        textureFloor.colorSpace = THREE.SRGBColorSpace;
        const repeats = planeSize / 2;
        textureFloor.repeat.set(repeats, repeats);

        const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshStandardMaterial({
            map: textureFloor,
            side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.rotation.x = Math.PI * -.5;
        scene.add(mesh);

        renderer.render(scene, camera);

        function render(time) {
            time *= 0.001;  // convert time to seconds

            // if (resizeRendererToDisplaySize(renderer)) {
            //     camera.aspect = canvas.clientWidth / canvas.clientHeight;
            //     camera.updateProjectionMatrix();
            // }

            resizeRendererToDisplaySize(renderer);

            // turn on the scissor
            renderer.setScissorTest(true);

            // render the original view
            {
                const aspect = setScissorForElement(view1Elem);


                // adjust the camera for this aspect
                camera.aspect = aspect;
                camera.updateProjectionMatrix();
                //                cameraHelper.update();

                // don't draw the camera helper in the original view
                // cameraHelper.visible = false;

                scene.background.set(0x000000);

                // render
                renderer.render(scene, camera);
            }

            // render from the 2nd camera
            {
                const aspect = setScissorForElement(view2Elem);

                // adjust the camera for this aspect
                camera2.aspect = aspect;
                camera2.updateProjectionMatrix();

                // draw the camera helper in the 2nd view
                // cameraHelper.visible = true;

                scene.background.set(0x000040);

                renderer.render(scene, camera2);
            }

            cubes.forEach((cube, ndx) => {
                const speed = 1 + ndx * .1;
                const rot = time * speed;
                cube.rotation.x = rot;
                cube.rotation.y = rot;
            });

            //            renderer.render(scene, camera);

            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);

        function makeInstance(geometry, color, x) {
            const material = new THREE.MeshStandardMaterial({ color });
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
            const canvas = renderer.domElement;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            const needResize = canvas.width !== width || canvas.height !== height;
            if (needResize) {
                renderer.setSize(width, height, false);
            }
            return needResize;
        }

        function setScissorForElement(elem) {
            const canvasRect = canvas.getBoundingClientRect();
            const elemRect = elem.getBoundingClientRect();

            // compute a canvas relative rectangle
            const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
            const left = Math.max(0, elemRect.left - canvasRect.left);
            const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
            const top = Math.max(0, elemRect.top - canvasRect.top);

            const width = Math.min(canvasRect.width, right - left);
            const height = Math.min(canvasRect.height, bottom - top);

            // setup the scissor to only render to that part of the canvas
            const positiveYUpBottom = canvasRect.height - bottom;
            renderer.setScissor(left, positiveYUpBottom, width, height);
            renderer.setViewport(left, positiveYUpBottom, width, height);

            // return the aspect
            return width / height;
        }

    }

    main();
});