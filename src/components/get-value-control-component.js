import valueControlComponents from "./value-control-components/all";

export default (controlType, typeOfInputValue) => {
	switch (controlType) {
		case "number":
			return valueControlComponents.Number;
			break;

		case "range":
			return valueControlComponents.Range;
			break;

		case "toggle":
			return valueControlComponents.Toggle;
			break;

		case "color":
			return valueControlComponents.Color;
			break;

		case "text":
			return valueControlComponents.Text;

		// None set:
		default:
			switch (typeOfInputValue) {
				case "number":
					return valueControlComponents.Number;
				case "boolean":
					return valueControlComponents.Toggle;
				case "string":
				default:
					return valueControlComponents.Text;
			}
	}
};
