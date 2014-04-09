define([], function(){
	function createSortedPair(small, large) {
		return {
			s: small,
			l: large
		};
	}

	function sortByNumberOfFaces(a, b) {
		if(a.faces.length < b.faces.length)
			return createSortedPair(a, b);
		return createSortedPair(b, a);
	}

	return {
		append: function(target, source) {
			//Doing this sort so that we have least amount of faces to map over.
			var sorted = sortByNumberOfFaces(target, source);
			var verts = sorted.l.vertices.concat(sorted.s.vertices);

			var offset = sorted.l.vertices.length;
			sorted.s.faces.forEach(function(face){
				face.a += offset;
				face.b += offset;
				face.c += offset;
			});
			var faces = sorted.l.faces.concat(sorted.s.faces);

			target.vertices = verts;
			target.faces = faces;

			return target;
		}
	};
});