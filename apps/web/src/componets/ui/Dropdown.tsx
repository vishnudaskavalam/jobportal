import React from 'react';

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
}

export default function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className = ""
}: DropdownProps) {
  return (
    <select
      className={`px-4 bg-slate-950 border border-white/5 rounded-xl text-sm font-medium text-slate-300 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all duration-300 cursor-pointer ${className}`}
      value={value}
      onChange={onChange}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
