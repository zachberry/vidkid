import valueControlComponents from "./value-control-components/all";

export default (controlType, restrict, typeOfInputValue) => {
	if (!controlType && restrict && restrict.controlType) controlType = restrict.controlType;

	switch (controlType) {
		case "number":
			return valueControlComponents.Number;

		case "range":
			return valueControlComponents.Range;

		case "toggle":
			return valueControlComponents.Toggle;

		case "color":
			return valueControlComponents.Color;

		case "text":
			return valueControlComponents.Text;

		case "select":
			return valueControlComponents.Select;

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
