import * as yup from "yup";

interface FieldConfig {
  name: string;
  type: string;
  required?: boolean;
  validators?: string[];
}

interface FormConfig {
  fields: FieldConfig[];
}

export function makeYupSchema(config: FormConfig) {
  const shape: { [key: string]: any } = {};
  for (const f of config.fields) {
    let validator;

    switch (f.type) {
      case "email":
        validator = yup.string().email("Неверный email");
        break;
      case "number":
        validator = yup.number().typeError("Должно быть числом");
        break;
      case "text":
      default:
        validator = yup.string();
        break;
    }

    if (f.required || (f.validators && f.validators.includes("required"))) {
      validator = validator.required("Обязательное поле");
    }

    if (f.validators) {
      for (const rule of f.validators) {
        if (rule.startsWith("min:")) {
          const minValue = parseInt(rule.split(":")[1], 10);
          if (f.type === "number") {
            validator = validator.min(minValue, `Минимум ${minValue}`);
          } else {
            validator = validator.min(minValue, `Минимум ${minValue} символов`);
          }
        }
        // Можно добавить другие валидаторы по необходимости
      }
    }

    shape[f.name] = validator;
  }
  return yup.object().shape(shape);
}
