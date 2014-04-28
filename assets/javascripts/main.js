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

	function onInitialize(game) {
		game.scene = new THREE.Scene();
		game.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.00001, 1000 );
	
		game.camera.lookAt(constants.Vec3.forward);
		console.log(game.camera.right());

		var material = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors } );

		var voxel = new spatial.AAVoxel(new THREE.Vector3(0, 0, 0), units.meters(1));
		var g = voxel.generateGeometry(new THREE.Color(0xFFFF00), true, true, true, true, true, true);
		var mesh = new THREE.Mesh(g, material);

		//game.scene.add(mesh);
		var chunk = new spatial.AAChunk(new THREE.Vector3(0, 0, 0), units.meters(1.0));
		chunk.addVoxel(new THREE.Vector3(0, 0, 0), new THREE.Color(0xFFFF00));
		chunk.addVoxel(new THREE.Vector3(0, 0, 1), new THREE.Color(0xFFFF00));

		var mesh2 = chunk.getMesh();

		game.scene.add(mesh2);

		game.camera.position.x = units.meters(-5);
		game.camera.position.z = units.meters(20);
		game.camera.position.y = units.meters(4);


		game.forwardMetersPerSecond = 0;
		var wPressedTerminal = new game.input.PressableTerminal(game.input.Pressable.W, game.input.PressableEvent.PRESSED);
		var wPressedCombo = new game.input.Combo(wPressedTerminal);
		game.input.on(wPressedCombo, function(){
			game.forwardMetersPerSecond = 1.0;
		});

		var wReleasedTerminal = new game.input.PressableTerminal(game.input.Pressable.W, game.input.PressableEvent.RELEASED);
		var wReleasedCombo = new game.input.Combo(wReleasedTerminal);
		game.input.on(wReleasedCombo, function(){
			game.forwardMetersPerSecond = 0;
		});



		game.forwardMetersPerSecond = 0;
		var sPressedTerminal = new game.input.PressableTerminal(game.input.Pressable.S, game.input.PressableEvent.PRESSED);
		var sPressedCombo = new game.input.Combo(sPressedTerminal);
		game.input.on(sPressedCombo, function(){
			game.forwardMetersPerSecond = -1.0;
		});

		var sReleasedTerminal = new game.input.PressableTerminal(game.input.Pressable.S, game.input.PressableEvent.RELEASED);
		var sReleasedCombo = new game.input.Combo(sReleasedTerminal);
		game.input.on(sReleasedCombo, function(){
			game.forwardMetersPerSecond = 0;
		});
	}

	function onIterate(game) {
		var forward = game.camera.forward().clone();
		forward.multiplyScalar(game.dt * game.forwardMetersPerSecond);
		game.camera.position.add(forward);

		game.renderer.render(game.scene, game.camera);
	}

	var gameLoop = engine(onInitialize, onIterate);
	gameLoop.run();
});
