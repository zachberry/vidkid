let el = null;
let pt = null;
let clientPt = null;
let moveByPt = null;
let initialPt = null;
let initialPos = null;
let blocker = document.createElement("div");
let onComplete = null;
let onMove = null;
let dragData = null;
let restrictAxis = null;
let restrictBBox = null;

blocker.style.position = "fixed";
blocker.style.left = "0";
blocker.style.right = "0";
blocker.style.top = "0";
blocker.style.bottom = "0";
// blocker.style.pointerEvents = 'none';
blocker.style.cursor = "grabbing";
blocker.style.backgroundColor = "rgba(0,0,0,0)";
blocker.style.zIndex = "99999";

let mouseMoveFn = function(event) {
	document.body.style.pointerEvents = "none";

	if (!initialPt) {
		initialPt = {
			x: event.clientX,
			y: event.clientY
		};
		clientPt = {
			x: event.clientX,
			y: event.clientY
		};
		initialPos = {
			left: el.offsetLeft || 0,
			top: el.offsetTop || 0
		};
		// initialPt = {
		// 	x: el.offsetLeft || 0,
		// 	y: el.offsetTop || 0
		// }

		el.classList.add("dragging");

		document.body.appendChild(blocker);
	}

	moveByPt = {
		x: event.clientX - clientPt.x,
		y: event.clientY - clientPt.y
	};

	pt = {
		x: event.clientX - initialPt.x,
		y: event.clientY - initialPt.y
	};

	clientPt = {
		x: event.clientX,
		y: event.clientY
	};

	let newLocation = {
		x: restrictAxis !== "x" ? initialPos.left + pt.x : initialPos.left,
		y: restrictAxis !== "y" ? initialPos.top + pt.y : initialPos.top
	};

	let restrictedDimensions = fit(newLocation);

	// if (newLocation.x > restrictBBox.right) newLocation.x = restrictBBox.right

	el.style.left = newLocation.x + "px";
	el.style.top = newLocation.y + "px";

	if (onMove) onMove(el, pt, newLocation, dragData, moveByPt, restrictedDimensions, event);
};

let fit = function(newLocation) {
	let restrictedDimensions = [];

	if (restrictBBox === null) return restrictedDimensions;

	if (restrictAxis !== "x") {
		if (newLocation.x < restrictBBox.left) {
			newLocation.x = restrictBBox.left;
			restrictedDimensions.push("left");
		}
		if (newLocation.x > restrictBBox.right) {
			newLocation.x = restrictBBox.right;
			restrictedDimensions.push("right");
		}
	}

	if (restrictAxis !== "y") {
		if (newLocation.y < restrictBBox.top) {
			newLocation.y = restrictBBox.top;
			restrictedDimensions.push("top");
		}
		if (newLocation.y > restrictBBox.bottom) {
			newLocation.y = restrictBBox.bottom;
			restrictedDimensions.push("bottom");
		}
	}

	return restrictedDimensions;
};

let mouseUpFn = function(event) {
	document.body.style.pointerEvents = "";

	if (initialPt) document.body.removeChild(blocker);

	let newLocation = {
		x: parseFloat(el.style.left) || 0,
		y: parseFloat(el.style.top) || 0
	};

	if (onComplete) onComplete(el, pt, newLocation, dragData);
	onComplete = onMove = dragData = null;

	el.classList.remove("dragging");
	pt = el = initialPt = null;

	document.removeEventListener("mousemove", mouseMoveFn);
	document.removeEventListener("mouseup", mouseUpFn);
};

export default function(
	element,
	onMoveFn,
	onCompleteFn,
	optionalData = null,
	restrictedAxis = null,
	restrictedBBox = null
) {
	el = element;
	onMove = onMoveFn;
	onComplete = onCompleteFn;
	dragData = optionalData;
	restrictAxis = restrictedAxis;
	restrictBBox = restrictedBBox;
	document.addEventListener("mousemove", mouseMoveFn);
	document.addEventListener("mouseup", mouseUpFn);
}
