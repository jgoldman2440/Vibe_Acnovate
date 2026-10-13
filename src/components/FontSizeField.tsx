interface Props {
  label: string;
  value: number;
  sizes: number[];
  onChange: (size: number) => void;
  // optional helper text shown under the dropdown
  hint?: string;
}

// labelled px font-size dropdown used inside the ColorPicker popovers
export default function FontSizeField({ label, value, sizes, onChange, hint }: Props) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="block w-full px-1 py-1 text-xs bg-white border border-gray-200 rounded focus:outline-none focus:border-indigo-400 cursor-pointer"
      >
        {sizes.map((size) => (
          <option key={size} value={size}>
            {size}px
          </option>
        ))}
      </select>
      {hint && <p className="mt-0.5 text-[10px] text-gray-400">{hint}</p>}
    </div>
  );
}
