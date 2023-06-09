import React from "react";

export const Textarea = ({
    placeholder,
    label,
    onChange,
    name,
    value,
    size,
    disabled,
}) => {
    return (
        <div className="form-control">
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <textarea
                className={`textarea textarea-bordered ${size ? size : "h-24"}`}
                placeholder={placeholder}
                onChange={onChange}
                name={name}
                value={value}
                disabled={disabled}
            ></textarea>
        </div>
    );
};
