export const formConfigs = {
  contact: {
    fields: [
      { name: "email", type: "email", required: true, validators: ["email", "required"], placeholder: "Email" },
      { name: "phone", type: "text", required: false, validators: ["phone"], placeholder: "Контактный телефон" },
    ],
  },
  order: {
    fields: [
      { name: "phone", type: "text", required: true, validators: ["phone", "required"], placeholder: "Контактный телефон", filterType: "phone" },
      { name: "firstName", type: "text", required: true, validators: ["required"], placeholder: "Имя" },
      { name: "lastName", type: "text", required: true, validators: ["required"], placeholder: "Фамилия" },
      { name: "email", type: "email", required: true, validators: ["email", "required"], placeholder: "Email" },
    ],
  },
};
