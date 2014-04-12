require.config({
	paths: {
		three: 'vendor/threejs/three'
	},
	shim: {
		three: {
			exports: 'THREE'
		}
	}
});

require(['three',
		 'engine/index',
		 'engine/spatial/index'], 
function(THREE, engine, spatial) {
	document.documentElement.addEventListener('click', function(){
		document.documentElement.webkitRequestFullScreen();
		document.documentElement.webkitRequestPointerLock();
	});


	var game = {};

	function onInitialize() {
		game.scene = new THREE.Scene();
		game.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	

		var material = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors } );

		var voxel = new spatial.AAVoxel(new THREE.Vector3(0, 0, 0), 1);
		var g = voxel.generateGeometry(new THREE.Color(0xFFFF00), true, true, true, true, true, true);
		var mesh = new THREE.Mesh(g, material);

		game.scene.add(mesh);

		game.camera.position.x = -4;
		game.camera.position.z = 10;
		game.camera.position.y = -2;
	}

	function onIterate(renderer) {
		renderer.render(game.scene, game.camera);
	}

	var gameLoop = engine(onInitialize, onIterate);
	gameLoop.run();
});
