import React, { useState } from 'react';

type TextFieldProps = {
  label: string;
  value: string | null;
  placeholder?: string;
  onChange: React.ChangeEventHandler;
  disabled?: boolean;
};
const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  placeholder = '',
  onChange,
  disabled = false,
  ...props
}) => {
  return (
    <div className="flex flex-col space-y-1.5" {...props}>
      <label className="text-secondary text-sm">{label}</label>
      <input
        type="text"
        disabled={disabled}
        onChange={onChange}
        value={value || placeholder}
        className="bg-input-normal border-input-normal disabled:border-input-disabled read-only:border-input-disabled disabled:text-disabled read-only:text-disabled placeholder:text-disabled focus:border-input-focus rounded-md border px-3 py-3 focusring"
      />
    </div>
  );
};

export default TextField;
