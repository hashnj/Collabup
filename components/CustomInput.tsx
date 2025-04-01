import { ChangeEventHandler } from "react";

const CustomeInput = ({
  type = "text",
  placeholder,
  value,
  onChange,
}: CustomInput) => {
  return (
    <div className="w-full">
      <label className="block text-sm">{placeholder}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="border px-3 border-gray-400/40 py-2 rounded w-full"
      />
    </div>
  );
};

interface CustomInput {
  type?: string;
  placeholder: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export default CustomeInput;