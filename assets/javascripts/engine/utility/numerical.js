define([], function(){
	return {
		isBetween: function(target, a, b) {
			var small = a < b ? a : b;
			var large = a < b ? b : a;
			return target > small && target < large;
		}
	};
});