require.config({
	paths: {
		three: 'vendor/threejs/three'
	},
	shim: {
		three: {
			exports: 'THREE'
		}
	}
});

require(['engine/index'], function(engine){
	engine();
});
