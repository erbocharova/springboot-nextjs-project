import React, { useState } from "react";
import Button from "../button/button";
import "./accordion.scss";


const Accordion = ({ className, buttonClassName, text, isAlwaysExpanded, accordionBody, icon, style }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`accordion-block collapsible ${className}`}>
      {isAlwaysExpanded ? (
        <h3 className={`${className}__title`}>{text}</h3>
      ) : (
        <Button
          onClick={toggleAccordion}
          className={`expanding-info-button ${isOpen ? "active" : ""} ${buttonClassName || ""}`}
          text={text}
          icon={icon}
          style={style}
        />
      )}


      {(isAlwaysExpanded || isOpen) && accordionBody}
    </div>
  );
};

export default Accordion;