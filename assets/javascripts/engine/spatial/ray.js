define(['three'], function(THREE){
    function Ray(origin, direction) {
        this.origin = origin;
        this.direction = direction;
    }

    Ray.prototype.transformIntoNewSpace = function(transformationMatrix) {
        var origin = origin.clone().applyMatrix4(transformationMatrix);
        var direction = direction.clone().applyMatrix4(transformationMatrix);
        return new Ray(origin, direction);
    };

    Ray.prototype.cast = function(distance) {
        return origin.clone().add(direction.clone().multiplyScalar(distance));
    };

    return Ray;
});