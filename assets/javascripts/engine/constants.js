define(['three-raw'], function (THREEr){
	var Vec3 = {
		up: new THREEr.Vector3(0, 1, 0),
		down: new THREEr.Vector3(0, -1, 0),
		left: new THREEr.Vector3(-1, 0, 0),
		right: new THREEr.Vector3(1, 0, 0),
		forward: new THREEr.Vector3(0, 0, -1),
		backward: new THREEr.Vector3(0, 0, 1),
	};

	return {
		Vec3: Vec3
	};
});