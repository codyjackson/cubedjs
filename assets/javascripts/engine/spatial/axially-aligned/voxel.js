define([], function(){
	function Voxel(topLeftFront, sideLength) {
		this.topLeftFront = topLeftFront;
		this.sideLength = sideLength;
	}

	Voxel.Face = {
		TOP: 'TOP',
		BOTTOM: 'BOTTOM',
		FRONT: 'FRONT',
		BACK: 'BACK',
		LEFT: 'LEFT',
		RIGHT: 'RIGHT'
	}

	Voxel.prototype.isInside = function (ray) {

	};

	Voxel.prototype.findIntersection = function (ray) {

	};

	Voxel.prototype.generateMesh = function (color, isFrontVisible, isBackVisible, isTopVisible, isBottomVisible, isLeftVisible, isRightVisible) {

	};

	function getTopFaceIntersection(ray) {

	}

	function getBottomFaceIntersection(ray) {

	}

	function getLeftFaceIntersection(ray) {

	}

	function getRightFaceIntersection(ray) {

	}

	function getFrontFaceIntersection(ray) {

	}

	function getBackFaceIntersection(ray) {

	}



	return Voxel;
});