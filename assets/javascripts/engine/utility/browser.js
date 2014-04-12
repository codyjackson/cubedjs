define([], function(){
	var prefixes = ['', 'webkit', 'moz'];
	function capitalize(s) {
		return s.charAt(0).toUpperCase() + s.slice(1);
	}

	function camelCaseConcat(l, r) {
		if(!l)
			return r;
		return l + capitalize(r);
	}

	function getFunctionAttachedToElement(element, functionName) {
		var functions = prefixes.map(function(prefix){
			return element[camelCaseConcat(prefix, functionName)];
		});
		var func = functions.reduce(function(pre, cur){
			return pre || cur;
		});

		if(func) {
			return func;
		}
		throw 'Could not find "' + functionName + '" attached to the specified element.';
	}

	var makeFullScreen = getFunctionAttachedToElement(document.documentElement, 'requestFullScreen');
	var lockMouse = getFunctionAttachedToElement(document.documentElement, 'requestPointerLock');

	return {
		getFunctionAttachedToElement: getFunctionAttachedToElement,
		makeFullScreen: makeFullScreen,
		lockMouse: lockMouse
	}
});