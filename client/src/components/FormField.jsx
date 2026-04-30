import React from 'react';

const FormField = ({ labelName, type, name, placeholder, value, handleChange }) => (
  <div className="flex flex-col gap-2 w-full">
    {labelName && (
      <label htmlFor={name} className="block text-sm font-semibold text-slate-700 ml-1">
        {labelName}
      </label>
    )}
    <input
      type={type} id={name} name={name} placeholder={placeholder} value={value} onChange={handleChange} required
      /* FIXED CONTRAST: Slate-100 background that turns white on focus */
      className="bg-slate-100 border border-slate-200 text-slate-900 text-sm rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none block w-full p-4 transition-all shadow-sm hover:bg-slate-50 placeholder:text-slate-400"
    />
  </div>
);

export default FormField;