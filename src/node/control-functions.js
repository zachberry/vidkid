const text = ({ editable, multiline } = {}) => {
	if (typeof editable === "undefined") editable = true;
	if (typeof multiline === "undefined") multiline = true;

	return {
		type: "text",
		editable,
		multiline
	};
};

const number = ({ editable, step } = {}) => {
	if (typeof editable === "undefined") editable = true;
	if (typeof step === "undefined") step = null;

	return {
		type: "number",
		editable,
		step
	};
};

const color = ({ editable } = {}) => {
	if (typeof editable === "undefined") editable = true;

	return {
		type: "color",
		editable
	};
};

const toggle = ({ editable } = {}) => {
	if (typeof editable === "undefined") editable = true;

	return {
		type: "toggle",
		editable
	};
};

const range = ({ editable, min, max, step } = {}) => {
	if (typeof editable === "undefined") editable = true;
	if (typeof min === "undefined") min = null;
	if (typeof max === "undefined") max = null;
	if (typeof step === "undefined") step = null;

	return {
		type: "range",
		editable,
		min,
		max,
		step
	};
};

export { text, number, color, range, toggle };
