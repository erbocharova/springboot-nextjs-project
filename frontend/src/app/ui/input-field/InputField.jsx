import React, { memo, useCallback } from "react";
import PropTypes from "prop-types";
import "./input-field.scss";

/**
 * filterType — один из предустановленных типов фильтра: "email", "phone", "name", "number"
 * filterPattern — своя regexp-строка (без /^$/), применяется в приоритете перед filterType
 * filterFunction — своя функция фильтрации: (value: string) => boolean
 */
import { PATTERNS } from "./patterns";

const InputField = memo(
  React.forwardRef(
    (
      {
        type = "text",
        name,
        value,
        onChange,
        placeholder,
        required = false,
        readOnly = false,
        disabled = false,
        maxLength,
        minLength,
        pattern,
        min,
        max,
        step,
        autoFocus = false,
        size,
        autoComplete,
        list,
        accept,
        multiple = false,
        id,
        ariaLabel,
        className = "",
        // новые пропсы
        filterType,         // "email" | "phone" | "name" | "number"
        filterPattern,      // своя regexp-строка, напр. "\\d{0,10}"
        filterFunction,     // (value) => boolean
        showRequiredError = true, // new prop to control required error message display
        errorMessage = "", // new prop: single error message string
        showErrors = false, // new prop: whether to show error messages
        ...rest
      },
      ref
    ) => {
      // Предустановленные шаблоны
      const presets = {
        email: PATTERNS.email.replace(/^\^|\$$/g, ""),
        phone: PATTERNS.phone.replace(/^\^|\$$/g, ""),
        name: PATTERNS.name.replace(/^\^|\$$/g, ""),
        number: "\\d*",
      };

      // Компонуем конечный regexp
      const effectivePattern = filterPattern
        ? `^${filterPattern}`
        : filterType && presets[filterType]
        ? `^${presets[filterType]}`
        : pattern
        ? `^${pattern}`
        : null;

      const handleInputChange = useCallback(
        (e) => {
          const val = e.target.value;

          // Сначала кастомная функция
          if (filterFunction && !filterFunction(val)) {
            // не блокируем ввод, просто вызываем onChange
            onChange(e);
            return;
          }

          // Затем regexp
          if (effectivePattern) {
            const regex = new RegExp(effectivePattern);
            if (!regex.test(val) && val !== "") {
              // не блокируем ввод, просто вызываем onChange
              onChange(e);
              return;
            }
          }

          onChange(e);
        },
        [filterFunction, effectivePattern, onChange]
      );

      const inputProps = {
        type,
        name,
        id,
        onChange: handleInputChange,
        placeholder,
        required,
        readOnly,
        disabled,
        maxLength,
        minLength,
        pattern: effectivePattern ? effectivePattern.slice(1) : pattern, // remove leading ^ for native validation
        min,
        max,
        step,
        autoFocus,
        size,
        autoComplete,
        list,
        accept,
        multiple,
        "aria-label": ariaLabel,
        className: `input-field ${className}`,
        ...rest,
      };

      if (type === "file") {
        delete inputProps.value;
      } else {
        inputProps.value = value;
      }

      // Compose error message to show
      let messageToShow = errorMessage;

      // Добавим проверку на соответствие паттерну, если showErrors=true
      if (showErrors && value && effectivePattern) {
        const regex = new RegExp(effectivePattern);
        if (!regex.test(value)) {
          messageToShow = errorMessage || "Пожалуйста, введите корректное значение";
        }
      }

      if (required && showRequiredError && showErrors && (!value || value === "")) {
        messageToShow = "Пожалуйста, заполните это поле";
      }

      return (
        <>
          <input ref={ref} {...inputProps} />
          {showErrors && messageToShow && (
            <div className="error-message small">{messageToShow}</div>
          )}
        </>
      );
    }
  )
);

InputField.displayName = "InputField";

InputField.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  maxLength: PropTypes.number,
  minLength: PropTypes.number,
  pattern: PropTypes.string,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  autoFocus: PropTypes.bool,
  size: PropTypes.number,
  autoComplete: PropTypes.string,
  list: PropTypes.string,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  id: PropTypes.string,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  // новые пропсы
  filterType: PropTypes.oneOf(["email", "phone", "name", "number"]),
  filterPattern: PropTypes.string,
  filterFunction: PropTypes.func,
  showRequiredError: PropTypes.bool,
};

export default InputField;
