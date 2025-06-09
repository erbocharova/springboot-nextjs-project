import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputField from "./ui/input-field/InputField";
import { formConfigs } from "./formConfigs";
import { makeYupSchema } from "./makeYupSchema";

export default function DynamicForm({ formType, onSubmit }) {
  const config = formConfigs[formType];
  if (!config) {
    return <div>Форма с типом "{formType}" не найдена.</div>;
  }

  const schema = makeYupSchema(config);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-row">
        {config.fields.map((field) => {
          if (field.name === "firstName" || field.name === "lastName") {
            return null; // обработаем отдельно ниже
          }
          return (
            <div key={field.name} className="form-field" style={{ marginBottom: "1rem" }}>
              <Controller
                name={field.name}
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, ref } }) => (
                  <InputField
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    filterType={field.filterType}
                    value={value}
                    onChange={onChange}
                    ref={ref}
                    required={field.required}
                    showErrors={!!errors[field.name]}
                    errorMessage={errors[field.name]?.message}
                  />
                )}
              />
            </div>
          );
        })}
      </div>

      <div className="form-row name-row" style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
        {["firstName", "lastName"].map((name) => {
          const field = config.fields.find((f) => f.name === name);
          if (!field) return null;
          return (
            <div key={name} className="form-field" style={{ flex: 1 }}>
              <Controller
                name={name}
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, ref } }) => (
                  <InputField
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    filterType={field.filterType}
                    value={value}
                    onChange={onChange}
                    ref={ref}
                    required={field.required}
                    showErrors={!!errors[field.name]}
                    errorMessage={errors[field.name]?.message}
                  />
                )}
              />
            </div>
          );
        })}
      </div>

      <button type="submit">Отправить</button>
    </form>
  );
}
