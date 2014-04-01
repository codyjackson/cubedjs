require.config({
	paths: {
		AxiallyAligned: 'engine/spatial/axially-aligned/index',
		Game: 'engine/game',
		three: 'vendor/threejs/three'
	},
	shim: {
		three: {
			exports: 'THREE'
		}
	}
});
require(['AxiallyAligned', 'Game'], function(AxiallyAligned, Game){
	console.log(AxiallyAligned);
});
