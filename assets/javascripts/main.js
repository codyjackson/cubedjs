require.config({
	paths: {
		'three-raw': 'vendor/threejs/three',
		'three': 'engine/three-modifications'
	},
	shim: {
		'three-raw': {
			exports: 'THREE'
		}
	}
});

require([
		'three',
		'engine/index',
		'engine/units',
		'engine/spatial/index',
		'engine/constants'], 
function(THREE, engine, units, spatial, constants) {
	document.documentElement.addEventListener('fail', function(){
		document.documentElement.webkitRequestFullScreen();
		document.documentElement.webkitRequestPointerLock();
	});


	var game = {};

	function onInitialize() {
		game.scene = new THREE.Scene();
		game.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.00001, 1000 );
	
		game.camera.lookAt(constants.Vec3.forward);
		console.log(game.camera.right());

		var material = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors } );

		var voxel = new spatial.AAVoxel(new THREE.Vector3(0, 0, 0), units.meters(1));
		var g = voxel.generateGeometry(new THREE.Color(0xFFFF00), true, true, true, true, true, true);
		var mesh = new THREE.Mesh(g, material);

		game.scene.add(mesh);

		game.camera.position.x = units.meters(-5);
		game.camera.position.z = units.meters(20);
		game.camera.position.y = units.meters(4);
	}

	function onIterate(renderer) {
		renderer.render(game.scene, game.camera);
	}

	var gameLoop = engine(onInitialize, onIterate);
	gameLoop.run();
});
