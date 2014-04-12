define(['three',
		'engine/input'], 
function(THREE, input) {
	return function(onInitialize, onInterate){
		var renderer = new THREE.WebGLRenderer();

		return {
			run: function run(){
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				onInitialize();
				(function gameLoop() {
					requestAnimationFrame(gameLoop);
					onInterate(renderer, input);
				})();
			}
		};
	};
});