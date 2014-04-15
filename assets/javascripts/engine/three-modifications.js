define(['three-raw', 'engine/constants'], function(THREEr, constants){

	function getDirection(o3d, dir) {
		var clone = dir.clone();
		clone.applyEuler(o3d.rotation);
		return clone;
	}

	THREEr.Object3D.prototype.forward = function(){
		return getDirection(this, constants.Vec3.forward);
	};

	THREEr.Object3D.prototype.backward = function(){
		return getDirection(this, constants.Vec3.backward);
	};

	THREEr.Object3D.prototype.up = function(){
		return getDirection(this, constants.Vec3.up);
	};

	THREEr.Object3D.prototype.down = function(){
		return getDirection(this, constants.Vec3.down);
	};

	THREEr.Object3D.prototype.left = function(){
		return getDirection(this, constants.Vec3.left);
	};

	THREEr.Object3D.prototype.right = function(){
		return getDirection(this, constants.Vec3.right);
	};

	return THREEr;
});