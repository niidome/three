import * as THREE from 'three';

window.addEventListener('DOMContentLoaded', () => {

    function main() {
        const canvas = document.querySelector('#c');
        const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

        const fov = 75;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 5;

        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.z = 2;

        const scene = new THREE.Scene();

        const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;
        const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

        const loader = new THREE.TextureLoader();
        const texture = loader.load('images/wall.jpg');
        texture.colorSpace = THREE.SRGBColorSpace;

        const cubes = [
            makeInstance(geometry, 0x44aa88, 0),
            makeInstanceTexture(geometry, 0x8844aa, -2),
            makeInstanceTextures(geometry, 0xaa8844, 2),
        ];

        const color = 0xFFFFFF;
        const intensity = 3;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);

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

            return cube;
        }

        function makeInstanceTexture(geometry, color, x) {
            const material = new THREE.MeshBasicMaterial({ map: texture });

            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);

            cube.position.x = x;

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