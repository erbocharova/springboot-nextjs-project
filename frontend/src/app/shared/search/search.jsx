import React from 'react';
import Button from "@/app/ui/button/button";
import './search.scss';

const Search = ({ className, onClick, inputType, id, placeholder, icon }) => {
    return (
        <div className={`search-form ${className}`}>
            <input
                className={`search-input ${className}-input`}
                type={inputType}
                id={id}
                placeholder={placeholder}
            />
            <Button
                className={`search-button ${className}-button`}
                onClick={onClick}
                icon={icon}
            />
        </div>
    );
};

export default Search;