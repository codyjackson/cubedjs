define(['three', 'engine/spatial/aavoxel'], function(THREE, AAVoxel) {
	return function(){
		var voxel = new AAVoxel(THREE.Vector3(1,1,0), THREE.Vector3(0,0,1));
		var scene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

		var renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );

		var geometry = new THREE.CubeGeometry(1,1,1);
		var material = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors } )
		var cube = new THREE.Mesh( geometry, material );
		var wireframe = new THREE.EdgesHelper(cube, 0xffffff);

		var geo = new THREE.Geometry();
		geo.vertices = [
			new THREE.Vector3(0, 0, 1),
			new THREE.Vector3(1, 0, 1),
			new THREE.Vector3(1, 1, 1)
		];
		console.log(geo.vertices);
		geo.faces.push(new THREE.Face3(0, 1, 2, null, new THREE.Color(0xFFFF00)));
		

		var voxel = new AAVoxel(new THREE.Vector3(0, 0, 0), 1);
		var g = voxel.generateGeometry(new THREE.Color(0xFFFF00), true);
		var mesh = new THREE.Mesh(g, material);

		scene.add(mesh);

		//scene.add(cube);
		//scene.add(wireframe);

		camera.position.z = 20;
		function render() {
			requestAnimationFrame(render);



			renderer.render(scene, camera);
		}
		render();
	};
});