define(['three', 'engine/spatial/aavoxel', 'engine/input'], function(THREE, AAVoxel, Input) {
	var renderer = new THREE.WebGLRenderer();
	return {
		run: function run(){
			var scene = new THREE.Scene();
			var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

			
			renderer.setSize( window.innerWidth, window.innerHeight );
			document.body.appendChild( renderer.domElement );

			var geometry = new THREE.CubeGeometry(1,1,1);
			var material = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors } );
			var cube = new THREE.Mesh( geometry, material );
			var wireframe = new THREE.EdgesHelper(cube, 0xffffff);

			var voxel = new AAVoxel(new THREE.Vector3(0, 0, 0), 1);
			var g = voxel.generateGeometry(new THREE.Color(0xFFFF00), true, true, true, true, true, true);
			var mesh = new THREE.Mesh(g, material);

			scene.add(mesh);

			//scene.add(cube);
			//scene.add(wireframe);

			camera.position.x = -4;
			camera.position.z = 10;
			camera.position.y = -2;
			
			function render() {
				requestAnimationFrame(render);



				renderer.render(scene, camera);
			}
			render();
		},
		Input: Input
	};
});