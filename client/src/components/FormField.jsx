import React from 'react';

const FormField = ({ labelName, type, name, placeholder, value, handleChange }) => (
  <div className="flex flex-col gap-2 w-full">
    <label htmlFor={name} className="block text-sm font-medium text-zinc-400">
      {labelName}
    </label>
    <input
      type={type} id={name} name={name} placeholder={placeholder} value={value} onChange={handleChange} required
      className="bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none block w-full p-3.5 transition-all placeholder:text-zinc-600"
    />
  </div>
);

export default FormField;