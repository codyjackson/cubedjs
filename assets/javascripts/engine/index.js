define(['three',
		'engine/input'], 
function(THREE, input) {
	return function(onInitialize, onInterate){
		var renderer = new THREE.WebGLRenderer();

		var game = {
			renderer: renderer,
			input: input
		};

		return {
			run: function run(){
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				onInitialize(game);
				var previousTime = null;
				(function gameLoop() {
					requestAnimationFrame(gameLoop);
					var time = Date.now();
					game.dt = (previousTime ? time - previousTime : 0)/1000.0;
					onInterate(game);
					previousTime = time;
				})();
			}
		};
	};
});