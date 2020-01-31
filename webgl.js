// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  attributes: { antialias: true }
};

const createLight = (scene, color='white', x=1, y=4, z=-4) => {
  const light = new THREE.PointLight('white', 1, 35.5);
  light.position.set(x, y, z).multiplyScalar(1.5);
  scene.add(light)

  var sphereSize = 1;
  var pointLightHelper = new THREE.PointLightHelper(light, sphereSize);
  scene.add(pointLightHelper);

  return { light, pointLightHelper };
}

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("#111", 1);

  // Setup a camera
  // Field of view, aspect ratio, near, far
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);

  // const camera = new THREE.OrthographicCamera();
  // x, y, z
  camera.position.set(10, 10, -40);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  // Sphere size, subdx, subd y
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const geometry2 = new THREE.BoxGeometry(2, 2, 2);
  // Setup a material
  // const material = new THREE.MeshBasicMaterial({
  //   color: "purple",
  //   wireframe: false
  // });

  const material = new THREE.MeshBasicMaterial({
    color: "red",
    wireframe: true
  });
  const coolMaterial = new THREE.MeshPhysicalMaterial({
    color: "purple",
    roughness: 0.75,
    flatShading: true
  });

  const { light } = createLight(scene);
  const { light2 } = createLight(scene, 'blue', 1, 3, 0);

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(1, 5, 5);

  for(let i = 0; i < 10 ; i++) {
    const mesh2 = new THREE.Mesh(geometry2, coolMaterial);
    mesh2.position.set(Math.random() * 10, Math.random() * 10, Math.random() * 10);
    mesh2.scale.multiplyScalar(0.5);
    scene.add(mesh2);
  }


  scene.add(mesh);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);

      // Perspective camera
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();

      // Ortographic camera

      // const aspect = viewportWidth / viewportHeight;
      // const zoom = 1.0;

      // // Bounds
      // camera.left = -zoom * aspect;
      // camera.right = zoom * aspect;
      // camera.top = zoom;
      // camera.bottom = -zoom;

      // // Near / Far
      // camera.near = -100;
      // camera.near = 100;

      // // Set position and look at world center
      // camera.position.set(zoom, zoom, zoom);
      // camera.lookAt(new THREE.Vector3());

      // camera.updateProjectionMatrix();

    },
    // Update & render your scene here
    render({ time }) {
      // mesh2.rotation.y = time * (10 * Math.PI / 180);
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
