import React from 'react';
import Proptypes from 'prop-types';

const AuthInput = ({ label, name, type, placeholder, Icon, value, onChange }) => {
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="p-2 pl-10 rounded-md border text-sm w-full"
        />
        <Icon className="absolute left-2 top-2 h-6 w-6 text-gray-500" />
      </div>
    </div>
  );
};

export default AuthInput;

AuthInput.propTypes = {
  label: Proptypes.string,
  name: Proptypes.string,
  type: Proptypes.string,
  placeholder: Proptypes.string,
  Icon: Proptypes.func,
  value: Proptypes.string,
  onChange: Proptypes.func,
};
