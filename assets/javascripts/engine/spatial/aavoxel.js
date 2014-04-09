define(['engine/spatial/aaplane', 
		'engine/utility/numerical', 
		'engine/utility/geometry',
		'engine/constants',
		'three'], 
function(AAPlane, Numerical, Geometry, Constants, THREE){
	function AAVoxel(topLeftFront, sideLength) {
		this.topLeftFront = topLeftFront;
		this.sideLength = sideLength;
	}

	AAVoxel.Side = {
		TOP: 'TOP',
		BOTTOM: 'BOTTOM',
		FRONT: 'FRONT',
		BACK: 'BACK',
		LEFT: 'LEFT',
		RIGHT: 'RIGHT'
	};

	AAVoxel.prototype.isInside = function (ray) {
		var o = ray.origin;
		if(!Numerical.isBetween(o.x, left(), right()))
			return false;
		if(!Numerical.isBetween(o.y, top(), bottom()))
			return false;
		if(!Numerical.isBetween(o.z, front(), back()))
			return false;
	};

	AAVoxel.prototype.findIntersection = function (ray) {
		var dir = ray.direction;

		var intersection = getSideIntersection(dir.x < 0 ? new Face(Side.RIGHT, right()) : new Face(Side.LEFT, left()));
		if(intersection) 
			return intersection;

		intersection = getSideIntersection(dir.y < 0 ? new Face(Side.TOP, top()) : new Face(Side.BOTTOM, bottom()));
		if(intersection) 
			return intersection;

		intersection = getSideIntersection(dir.z < 0 ? new Face(Side.FRONT, front()) : new Face(Side.BACK, back()));
		if(intersection) 
			return intersection;

		return false;
	};

	AAVoxel.prototype.generateGeometry = function (color, isFrontVisible, isBackVisible, isTopVisible, isBottomVisible, isLeftVisible, isRightVisible) {
		var geometry = new THREE.Geometry();
		if(isFrontVisible)
			Geometry.append(geometry, generateXYQuad(color, this.topLeftFront, AAVoxel.Side.FRONT));
		if(isTopVisible)
			Geometry.append(geometry, generateXZQuad(color, this.topLeftFront, AAVoxel.Side.TOP));
		if(isLeftVisible)
			Geometry.append(geometry, generateYZQuad(color, this.topLeftFront, AAVoxel.Side.LEFT));

		function translate(topLeftFront, sideLength, direction) {
			return (new THREE.Vector3()).addVectors(topLeftFront, direction.clone().multiplyScalar(sideLength));
		}

		if(isBackVisible) {
			var translation = translate(this.topLeftFront, this.sideLength, Constants.Vec3.forward);
			Geometry.append(geometry, generateXYQuad(color, translation, AAVoxel.Side.BACK));
		}

		if(isBottomVisible) {
			var translation = translate(this.topLeftFront, this.sideLength, Constants.Vec3.down);
			Geometry.append(geometry, generateXZQuad(color, translation, AAVoxel.Side.BOTTOM));
		}

		if(isRightVisible) {
			var translation = translate(this.topLeftFront, this.sideLength, Constants.Vec3.right);
			Geometry.append(geometry, generateYZQuad(color, translation, AAVoxel.Side.RIGHT));
		}

		return geometry;
	};

	function Quad(color, verts) {
		var g = new THREE.Geometry();
		g.vertices = verts;
		g.faces = [
			new THREE.Face3(0, 1, 3, null, new THREE.Color(0xFFFF00)),
			new THREE.Face3(3, 1, 2, null, new THREE.Color(0xFFFF00))
		];

		return g;
	}

	function generateXYQuad(color, translation, side) {
		var topLeft = translation;
		var topRight = (new THREE.Vector3()).addVectors(topLeft, Constants.Vec3.right);
		var bottomRight = (new THREE.Vector3()).addVectors(topRight, Constants.Vec3.down);
		var bottomLeft = (new THREE.Vector3()).addVectors(bottomRight, Constants.Vec3.left);

		var verts = side === AAVoxel.Side.BACK ? [topLeft, topRight, bottomRight, bottomLeft] : [topLeft, bottomLeft, bottomRight, topRight];
		return Quad(color, verts);
	}

	function generateYZQuad(color, translation, side) {
		var frontTop = translation;
		var frontBottom = (new THREE.Vector3()).addVectors(frontTop, Constants.Vec3.down);
		var backBottom = (new THREE.Vector3()).addVectors(frontBottom, Constants.Vec3.forward);
		var backTop = (new THREE.Vector3()).addVectors(backBottom, Constants.Vec3.up);

		var verts = side === AAVoxel.Side.RIGHT ? [frontTop, frontBottom, backBottom, backTop] : [frontTop, backTop, backBottom, frontBottom];
		return Quad(color, verts);
	}

	function generateXZQuad(color, translation, side) {
		var frontLeft = translation;
		var frontRight = (new THREE.Vector3()).addVectors(frontLeft, Constants.Vec3.right);
		var backRight = (new THREE.Vector3()).addVectors(frontRight, Constants.Vec3.forward);
		var backLeft = (new THREE.Vector3()).addVectors(backRight, Constants.Vec3.left);

		var verts = side === AAVoxel.Side.TOP ? [frontLeft, frontRight, backRight, backLeft] : [frontLeft, backLeft, backRight, frontRight];
		return Quad(color, verts);
	}

	AAVoxel.prototype.left = function() {
		return topLeftFront.x;
	};

	AAVoxel.prototype.right = function() {
		return topLeftFront.x + AAVoxel.Side.ength;
	};

	AAVoxel.prototype.top = function() {
		return topLeftFront.y;
	};

	AAVoxel.prototype.bottom = function() {
		return topLeftFront.y - AAVoxel.Side.ength;
	};

	AAVoxel.prototype.front = function() {
		return topLeftFront.z;
	};

	AAVoxel.prototype.back = function() {
		return topLeftFront.z - AAVoxel.Side.ength;
	};

	AAVoxel.prototype._getSpan = function(side) {
		if(side === AAVoxel.Side.LEFT || side === AAVoxel.Side.RIGHT)
			return AAPlane.Span.YZ;
		if(side === AAVoxel.Side.TOP || side === AAVoxel.Side.BOTTOM)
			return AAPlane.Span.XZ;
		if(side === AAVoxel.Side.FRONT || side === AAVoxel.Side.BACK)
			return AAPlane.Span.XY;

		throw "Invalid 'side' specified.";
	};

	AAVoxel.prototype._getSideIntersection = function(face, ray) {
		var span = getSpan(face.side);
		var plane = new AAPlane(span, face.constant);
		var planeIntersection = plane.findIntersection(ray);
		var pointOfIntersection = ray.at(planeIntersection.distance);
		return _isOnFace(pointOfIntersection, span) ? new VoxelIntersection(this, face.side, planeIntersection.distance) : false;
	};

	AAVoxel.prototype._isOnFace = function(point, span) {
		if(span === AAPlane.Span.YZ)
			return Numerical.isBetween(point.y, top(), bottom()) && Numerical.isBetween(point.z, front(), back());
		if(span === AAPlane.Span.XZ)
			return Numerical.isBetween(point.x, left(), right()) && Numerical.isBetween(point.z, front(), back());
		if(span === AAPlane.Span.XY)
			return Numerical.isBetween(point.x, left(), right()) && Numerical.isBetween(point.y, top(), bottom());

		throw "Invalid 'span' specified.";
	};

	function Face(side, constant) {
		this.side = AAVoxel.Side.
		this.constant = constant;
	}

	function VoxelIntersection(voxel, side) {
		this.voxel = voxel;
		this.side = side;
		this.distance = distance;
	}

	return AAVoxel;
});