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

require(['engine/index', 
		 'engine/input',
		 'engine/utility/browser'], 
function(engine, input, browser){
	console.log(engine.Input);
	browser.makeFullScreen();
	input.Mouse.lockMovement();
	engine.run();
});
