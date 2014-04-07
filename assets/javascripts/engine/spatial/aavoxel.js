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
			Geometry.append(geometry, generateXYQuad(color, topLeftFront, Side.FRONT));
		if(isTopVisible)
			Geometry.append(geometry, generateXZQuad(color, topLeftFront, Side.TOP));
		if(isLeftVisible)
			Geometry.append(geometry, generateYZQuad(color, topLeftFront, Side.LEFT));

		if(isBackVisible)
			Geometry.append(geometry, generateXYQuad(color, topLeftFront.add(Constants.Vec3.forward.multiplyScalar(sideLength)), Side.BACK));
		if(isBottomVisible)
			Geometry.append(geometry, generateXZQuad(color, topLeftFront.add(Constants.Vec3.down.multiplyScalar(sideLength)), Side.BOTTOM));
		if(isRightVisible)
			Geometry.append(geometry, generateYZQuad(color, topLeftFront.add(Constants.Vec3.right.multiplyScalar(sideLength)), Side.RIGHT));
	};

	function Quad(color, verts) {
		var g = new THREE.Geometry();
		g.vertices = verts;
		g.faces = [
			new THREE.Face3(0, 1, 3, null, new THREE.Color(0xFFFF00)),
			new THREE.Face3(3, 1, 2, null, new THREE.Color(0xFFFF00))
		];
	}

	function generateXYQuad(color, translation, side) {
		var topLeft = translation;
		var topRight = topLeft.add(Constants.Vec3.right);
		var bottomRight = topRight.add(Constants.Vec3.down);
		var bottomLeft = bottomRight.add(Constants.Vec3.left);

		var verts = side === Side.FRONT ? [topLeft, topRight, bottomRight, bottomLeft] : [topLeft, bottomLeft, bottomRight, topRight];
		return Quad(color, verts);
	}

	function generateYZQuad(color, translation, side) {
		var frontTop = translation;
		var frontBottom = frontTop.add(Constants.Vec3.down);
		var backBottom = frontBottom.add(Constants.Vec3.forward);
		var backTop = backBottom.add(Constants.Vec3.up);

		var verts = side === Side.LEFT ? [frontTop, frontBottom, backBottom, backTop] : [frontTop, backTop, backBottom, frontBottom];
		return Quad(color, verts);
	}

	function generateXZQuad(color, translation, side) {
		var frontLeft = translation;
		var frontRight = frontLeft.add(Constants.Vec3.right);
		var backRight = frontRight.add(Constants.Vec3.forward);
		var backLeft = backRight.add(Constants.Vec3.left);

		var verts = side === Side.BOTTOM ? [frontLeft, frontRight, backRight, backLeft] : [frontLeft, backLeft, backRight, frontRight];
		return Quad(color, verts);
	}

	AAVoxel.prototype.left = function() {
		return topLeftFront.x;
	};

	AAVoxel.prototype.right = function() {
		return topLeftFront.x + sideLength;
	};

	AAVoxel.prototype.top = function() {
		return topLeftFront.y;
	};

	AAVoxel.prototype.bottom = function() {
		return topLeftFront.y - sideLength;
	};

	AAVoxel.prototype.front = function() {
		return topLeftFront.z;
	};

	AAVoxel.prototype.back = function() {
		return topLeftFront.z - sideLength;
	};

	AAVoxel.prototype._getSpan = function(side) {
		if(Side === AAVoxel.Side.LEFT || Side === AAVoxel.Side.RIGHT)
			return AAPlane.Span.YZ;
		if(Side === AAVoxel.Side.TOP || Side === AAVoxel.Side.BOTTOM)
			return AAPlane.Span.XZ;
		if(Side === AAVoxel.Side.FRONT || Side === AAVoxel.Side.BACK)
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
		this.side = side;
		this.constant = constant;
	}

	function VoxelIntersection(voxel, side, distance) {
		this.voxel = voxel;
		this.side = side;
		this.distance = distance;
	}

	return AAVoxel;
});