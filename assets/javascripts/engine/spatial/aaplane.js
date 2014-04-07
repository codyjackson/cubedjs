define(function(){
	function AAPlane(span, constant) {
		this.span = span;
		this.constant = constant;
	}

	AAPlane.Span = {
		XY: 'XY',
		XZ: 'XZ',
		YZ: 'YZ'
	};

	AAPlane.prototype.findIntersection = function(ray) {
		if(this.span === Span.XY)
			return findIntersectionForComponents(ray.origin.z, ray.direction.z);
		if(this.span === Span.XZ)
			return findIntersectionForComponents(ray.origin.y, r.direction.y);
		return findIntersectionForComponents(ray.origin.x, ray.direction.x);
	};

	function findIntersectionForComponents(originComponent, directionComponent) {
		if(directionComponent === 0)
			return false;

		if(this.constant === originComponent)
			return new Intersection(0, this);

		var scalar = (this.constant - originComponent) / directionComponent;
		return scalar < 0 ? false : new PlaneIntersection(this, scalar);
	}

	function PlaneIntersection(plane, distance) {
		this.plane = plane;
		this.distance = distance;
	}

	return AAPlane;
});