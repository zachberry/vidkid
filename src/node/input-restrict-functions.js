class NumberInput {
	constructor(numberType = NumberInput.TYPE_FLOAT, min = -Infinity, max = Infinity) {
		this.min = min !== -Infinity ? min : null;
		this.max = max !== Infinity ? max : null;
		this.numberType = numberType;

		if (Number.isFinite(min) && Number.isFinite(max)) {
			this.controlType = "range";
		} else {
			this.controlType = "number";
		}
	}

	castValue(value) {
		return Number(value);
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

class SetInput {
	constructor(possibleValuesArray = [null]) {
		this.values = {};
		this.valuesList = possibleValuesArray;
		possibleValuesArray.forEach(s => {
			this.values[s] = s;
		});
		this.controlType = "select";
	}

	castValue(value) {
		if (typeof value === "number" || typeof value === "string") {
			return value;
		}

		return String(value);
	}

	transformValue(value) {
		if (typeof value === "number") {
			return typeof this.valuesList[value] !== "undefined" ? this.valuesList[value] : null;
		} else {
			value = "" + value;
			return typeof this.values[value] !== "undefined" ? this.values[value] : null;
		}
	}
}

const set = possibleValuesArray => {
	return new SetInput(possibleValuesArray);
};

export { float, int, set };
