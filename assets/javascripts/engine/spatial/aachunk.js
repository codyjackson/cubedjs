define(['engine/constants',
        'engine/utility/numerical',
        'engine/utility/geometry',
        'engine/spatial/aavoxel'], 
function(Constants, Numerical, Geometry, AAVoxel){

    function Voxel(chunk, indices) {
        this.chunk = chunk;
        this.indices = indices;
    }

    Voxel.prototype.getIndices = function() {
        return this.indices;
    };

    Voxel.prototype.getModelLeftTopFront = function() {
        var topLeftFront = (new THREE.Vector3()).addVectors(Constants.Vec3.up, Constants.Vec3.backward);
        topLeftFront.add(this.indices);
        return topLeftFront;
    };

    Voxel.prototype.getColor = function() {
        var i = this.indices;
        return this.chunk.voxels[i.x][i.y][i.z];
    };

    Voxel.prototype.isVisible = function() {
        return this.getColor() !== null;
    };

    Voxel.prototype.isBoundedByChunk = function(a) {
        return Numerical.isBetween(a, 0, this.chunk.getNumOfVoxelsPerSide() - 1);
    };

    Voxel.prototype.isInChunk = function() {
        return this.isBoundedByChunk(this.indices.x) && this.isBoundedByChunk(this.indices.y) && this.isBoundedByChunk(this.indices.z);
    };

    Voxel.prototype.isTopOccluded = function() {
        var v = this.getVoxelAbove();
        return v.isInChunk() && v.isVisible();
    }; 

    Voxel.prototype.isBottomOccluded = function() {
        var v = this.getVoxelBelow();
        return v.isInChunk() && v.isVisible();
    }; 

    Voxel.prototype.isFrontOccluded = function() {
        var v = this.getVoxelInFront();
        return v.isInChunk() && v.isVisible();
    }; 

    Voxel.prototype.isBackOccluded = function() {
        var v = this.getVoxelBehind();
        return v.isInChunk() && v.isVisible();
    }; 

    Voxel.prototype.isLeftOccluded = function() {
        var v = this.getVoxelToLeft();
        return v.isInChunk() && v.isVisible();
    }; 

    Voxel.prototype.isRightOccluded = function() {
        var v = this.getVoxelToRight();
        return v.isInChunk() && v.isVisible();
    }; 

    Voxel.prototype.getVoxelAbove = function() {
        var i = (new THREE.Vector3()).addVectors(this.indices, Constants.Vec3.up);
        return new Voxel(this.chunk, i);
    };

    Voxel.prototype.getVoxelBelow = function() {
        var i = (new THREE.Vector3()).addVectors(this.indices, Constants.Vec3.down);
        return new Voxel(this.chunk, i);
    };

    Voxel.prototype.getVoxelInFront = function() {
        var i = (new THREE.Vector3()).addVectors(this.indices, Constants.Vec3.backward);
        return new Voxel(this.chunk, i);
    };

    Voxel.prototype.getVoxelBehind = function() {
        var i = (new THREE.Vector3()).addVectors(this.indices, Constants.Vec3.forward);
        return new Voxel(this.chunk, i);
    };

    Voxel.prototype.getVoxelToRight = function() {
        var i = (new THREE.Vector3()).addVectors(this.indices, Constants.Vec3.right);
        return new Voxel(this.chunk, i);
    };

    Voxel.prototype.getVoxelToLeft = function() {
        var i = (new THREE.Vector3()).addVectors(this.indices, Constants.Vec3.left);
        return new Voxel(this.chunk, i);
    };

    Voxel.prototype.generateGeometry = function() {
        if(!this.isVisible())
            return new THREE.Geometry();

        var v = new AAVoxel(this.getModelLeftTopFront(), 1.0);
        return v.generateGeometry(this.getColor(), !this.isFrontOccluded(), !this.isBackOccluded(), !this.isTopOccluded(), !this.isBottomOccluded(), !this.isLeftOccluded(), !this.isRightOccluded());
    };

    function Chunk(leftBottomRight, voxelSideLength) {
        var scale = new THREE.Vector3(voxelSideLength, voxelSideLength, voxelSideLength);
        this.modelMatrix = (new THREE.Matrix4()).compose(leftBottomRight, new THREE.Quaternion(), scale);
        this.voxels = [];
        for(var x = 0; x < this.getNumOfVoxelsPerSide(); ++x) {
            if(!this.voxels[x])
                this.voxels[x] = [];
            for(var y = 0; y < this.getNumOfVoxelsPerSide(); ++y) {
                if(!this.voxels[x][y])
                    this.voxels[x][y] = [];
            }
        }
        this.mesh = generateMesh(this);
    }

    function generateMesh(chunk) {
        var geometry = new THREE.Geometry();
        chunk.forEachVoxel(function(v){
            Geometry.append(geometry, v.generateGeometry());
        });

        var material = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors } );
        return new THREE.Mesh(geometry, material);
    }

    Chunk.prototype.forEachVoxel = function(fn) {
        var chunk = this;
        var voxel = new Voxel();
        var indices = new THREE.Vector3();
        this.voxels.forEach(function(xArray, x){
            xArray.forEach(function(yArray, y){
                yArray.forEach(function(color, z){
                    THREE.Vector3.call(indices, x, y, z);
                    Voxel.call(voxel, chunk, indices);
                    fn(voxel);
                });
            });
        });
    };

    Chunk.numOfVoxelsPerSide = 16;

    Chunk.prototype.getNumOfVoxelsPerSide = function() {
        return Chunk.numOfVoxelsPerSide;
    };

    Chunk.prototype.findNearestIntersection = function(ray) {
        var inverseModelMatrix = this.modelMatrix.clone();
        inverseModelMatrix.getInverse(inverseModelMatrix);
        var localRay = r.transformIntoNewSpace(inverseModelMatrix);

        return this.octree.findNearestIntersection(localRay);
    };

    Chunk.prototype.getMesh = function() {
        return this.mesh;
    };

    Chunk.prototype.getVoxelMesh = function(indices) {
        return (new Voxel(this, indices)).generateMesh();
    };

    Chunk.prototype.addVoxel = function(indices, color) {
        this.voxels[indices.x][indices.y][indices.z] = color;
        this.mesh = generateMesh(this);
    };

    Chunk.prototype.deleteVoxel = function(indices) {
        this.voxels[indices.x][indices.y][indices.z] = null;
        this.mesh = generateMesh(this);
    };

    return Chunk;
});