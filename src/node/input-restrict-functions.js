class NumberInput {
	constructor(numberType = NumberInput.TYPE_FLOAT, min = -Infinity, max = Infinity) {
		this.min = min !== -Infinity ? min : null;
		this.max = max !== Infinity ? max : null;
		this.numberType = numberType;
	}

	transformValue(value) {
		if (this.min !== null) value = Math.max(this.min, value);
		if (this.max !== null) value = Math.min(this.max, value);
		if (this.numberType === NumberInput.TYPE_INT) value = Math.round(value);
		return value;
	}
}

NumberInput.TYPE_FLOAT = "float";
NumberInput.TYPE_INT = "int";

const float = (min = -Infinity, max = Infinity) => {
	return new NumberInput(NumberInput.TYPE_FLOAT, min, max);
};

const int = (min = -Infinity, max = Infinity) => {
	return new NumberInput(NumberInput.TYPE_INT, min, max);
};

export { float, int };
