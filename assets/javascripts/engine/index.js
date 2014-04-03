define(['three', 'engine/spatial/aavoxel'], function(THREE, AAVoxel) {
	return function(){
		var voxel = new AAVoxel(THREE.Vector3(1,1,0), THREE.Vector3(0,0,1));
		var scene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

		var renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );

		var geometry = new THREE.CubeGeometry(1,1,1);
		var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		var cube = new THREE.Mesh( geometry, material );
		var wireframe = new THREE.EdgesHelper(cube, 0xffffff);
		scene.add(cube);
		scene.add(wireframe);

		camera.position.z = 60;
		function render() {
			requestAnimationFrame(render);

			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;

			renderer.render(scene, camera);
		}
		render();
	};
});