define(['engine/utility/browser'], function(browser){
	var Pressable = {
		SPACE: 32,
		APOSTROPHE: 222,
		COMMA: 188,
		MINUS: 189,
		PERIOD: 190,
		SLASH: 191,
		NUM_0: 48,
		NUM_1: 49,
		NUM_2: 50,
		NUM_3: 51,
		NUM_4: 52,
		NUM_5: 53,
		NUM_6: 54,
		NUM_7: 55,
		NUM_8: 56,
		NUM_9: 57,
		SEMICOLON: 186,
		EQUAL: 187,
		A: 65,
		B: 66,
		C: 67,
		D: 68,
		E: 69,
		F: 70,
		G: 71,
		H: 72,
		I: 73,
		J: 74,
		K: 75,
		L: 76,
		M: 77,
		N: 78,
		O: 79,
		P: 80,
		Q: 81,
		R: 82,
		S: 83,
		T: 84,
		U: 85,
		V: 86,
		W: 87,
		X: 88,
		Y: 89,
		Z: 90,
		LEFT_BRACKET: 91,
		BACKSLASH: 92,
		RIGHT_BRACKET: 93,
		GRAVE_ACCENT: 96,
		WORLD_1: 61,
		WORLD_2: 62,
		ESCAPE: 256,
		ENTER: 257,
		TAB: 258,
		BACKSPACE: 259,
		INSERT: 260,
		DELETE: 261,
		RIGHT: 39,
		LEFT: 37,
		DOWN: 40,
		UP: 38,
		PAGE_UP: 266,
		PAGE_DOWN: 267,
		HOME: 268,
		END: 269,
		CAPS_LOCK: 280,
		SCROLL_LOCK: 281,
		NUM_LOCK: 282,
		PRINT_SCREEN: 283,
		PAUSE: 284,
		F1: 112,
		F2: 113,
		F3: 114,
		F4: 115,
		F5: 116,
		F6: 117,
		F7: 118,
		F8: 119,
		F9: 120,
		F10: 121,
		F11: 122,
		F12: 123,
		KP_0: 45,
		KP_1: 35,
		KP_2: 40,
		KP_3: 34,
		KP_4: 37,
		KP_5: 12,
		KP_6: 39,
		KP_7: 36,
		KP_8: 38,
		KP_9: 33,
		KP_DECIMAL: 46,
		KP_DIVIDE: 111,
		KP_MULTIPLY: 106,
		KP_SUBTRACT: 109,
		KP_ADD: 107,
		KP_ENTER: 13,
		SHIFT: 16,
		CONTROL: 17,
		ALT: 18,
		MENU: 93,
		MOUSE_BUTTON_1: 1,
		MOUSE_BUTTON_2: 3,
		//Unfortunately these are reserved for navigating forward and backward 
		//for web pages and can't be preempted.
		//MOUSE_BUTTON_3: 452,
		//MOUSE_BUTTON_4: 453,
		MOUSE_BUTTON_5: 2,
		NONE: 4444
	};

	var PressableEvent = {
		PRESSED: 'PRESSED',
		RELEASED: 'RELEASED'
	};

	var PressableState = {
		UP: 'UP',
		DOWN: 'DOWN'
	}

	function keyify(items) {
		return items.join('');
	}

	function PressableTerminal(pressable, event) {
		this.pressable = pressable;
		this.event = event;
	}

	PressableTerminal.prototype.keyify = function() {
		return keyify([this.pressable, this.event])
	}

	var MoveableTerminal = {
		MOUSE: 'MOUSE',
		MOUSE_WHEEL: 'MOUSE_WHEEL'
	};

	function createMouse() {
		var positon;
		var oldPosition;

		var requestPointerLock = browser.getFunctionAttachedToElement(document.documentElement, 'requestPointerLock');

		function Mouse() {
			this.hideCursor = function hideCursor() {
			};

			this.showCursor = function showCursor() {
			};

			this.isMouseHidden = function isMouseHidden() {
			};

			this.lockMovement = requestPointerLock;
			
			this.unlockMovement = function unlockMovement() {
			};

			this.isMovementLocked = function isMovementLocked() {
			};

			this.getPosition = function getPosition() {
			};

			this.getPositionDelta = function getPositionDelta() {
			};

			this.getWheelDelta = function getWheelDelta() {
			};
		}

		return new Mouse();
	}

	function Combo() {
		var args = Array.prototype.slice.call(arguments, 0);
		var inputs = args.slice();
		this.terminal = inputs.pop();
		this.modifiers = inputs;
	}

	Combo.prototype.keyify = function() {
		return keyify(this.modifiers.concat(this.terminal.keyify()));
	}

	var body = document.body;

	function listenerToUpdate(e) {
		var isDownEvent = e.type.indexOf('down') !== -1;
		var event = isDownEvent ? PressableState.DOWN : PressableState.UP;

		update(e.which, event);
		e.stopPropagation();
	}

	body.addEventListener('keydown', listenerToUpdate);
	body.addEventListener('keyup', listenerToUpdate);
	body.addEventListener('mousedown', listenerToUpdate);
	body.addEventListener('mouseup', listenerToUpdate);

	var terminalToCombos = {};
	var comboToCallback = {};
	var pressableToKeyState = {};

	function update(pressable, state) {
		if(!pressableToKeyState[pressable])
			pressableToKeyState[pressable] = PressableState.UP;

		if(pressableToKeyState[pressable] === state)
			return;

		pressableToKeyState[pressable] = state;
		var event = state === PressableState.UP ? PressableEvent.RELEASED : PressableEvent.PRESSED;
		var terminal = new PressableTerminal(pressable, event);
		signalPressable(terminal);
	}

	function invokeBoundCallback(combo) {
		comboToCallback[combo.keyify()]();
	}

	function signalPressable(pressableTerminal) {
		var combos = terminalToCombos[pressableTerminal.keyify()];
		if(!combos)
			return;

		var actionableCombos = combos.filter(function(combo){
			return areModifiersPressed(combo.modifiers);
		});

		actionableCombos.forEach(invokeBoundCallback);
	}

	function isPressed(pressable) {
		return pressableToKeyState[pressable] || PressableState.UP;
	}

	function areModifiersPressed(modifiers) {
		return modifiers.length === 0 || modifiers.every(isPressed);
	}

	function on(combo, callback) {
		comboToCallback[combo.keyify()] = callback;
		var terminalKey = combo.terminal.keyify();
		if(!terminalToCombos[terminalKey])
			terminalToCombos[terminalKey] = [];
		terminalToCombos[terminalKey].push(combo);
	}

	var terminal1 = new PressableTerminal(Pressable.A, PressableEvent.PRESSED);
	var combo1 = new Combo(terminal1);
	on(combo1, function(){
		console.log('hello');
	});

	var terminal2 = new PressableTerminal(Pressable.MOUSE_BUTTON_1, PressableEvent.RELEASED);
	var combo2 = new Combo(terminal2);
	on(combo2, function(){
		console.log(', world!');
	});

	return {
		Pressable: Pressable,
		PressableEvent: PressableEvent,
		PressableTerminal: PressableTerminal,
		MoveableTerminal: MoveableTerminal,
		on: on
	};
});