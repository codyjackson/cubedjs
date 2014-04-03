define([], function(){
	function AAVoxel(topLeftFront, sideLength) {
		this.topLeftFront = topLeftFront;
		this.sideLength = sideLength;
	}

	AAVoxel.Face = {
		TOP: 'TOP',
		BOTTOM: 'BOTTOM',
		FRONT: 'FRONT',
		BACK: 'BACK',
		LEFT: 'LEFT',
		RIGHT: 'RIGHT'
	}

	AAVoxel.prototype.isInside = function (ray) {

	};

	AAVoxel.prototype.findIntersection = function (ray) {

	};

	AAVoxel.prototype.generateMesh = function (color, isFrontVisible, isBackVisible, isTopVisible, isBottomVisible, isLeftVisible, isRightVisible) {

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



	return AAVoxel;
});