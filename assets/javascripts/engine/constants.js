define(['three'], function (THREE){
	var Vec3 = {
		up: new THREE.Vector3(0, 1, 0),
		down: new THREE.Vector3(0, -1, 0),
		left: new THREE.Vector3(-1, 0, 0),
		right: new THREE.Vector3(1, 0, 0),
		forward: new THREE.Vector3(0, 0, -1),
		backward: new THREE.Vector3(0, 0, 1),
	};

	return {
		Vec3: Vec3
	};
});