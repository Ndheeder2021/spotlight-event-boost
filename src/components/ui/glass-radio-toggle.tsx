import "./glass-radio-toggle.css";

interface GlassRadioToggleProps {
  options: {
    id: string;
    label: string;
    value: boolean;
  }[];
  selected: boolean;
  onChange: (value: boolean) => void;
}

export const GlassRadioToggle = ({ options, selected, onChange }: GlassRadioToggleProps) => {
  return (
    <div className="glass-radio-group">
      {options.map((option, index) => (
        <div key={option.id}>
          <input
            type="radio"
            id={option.id}
            name="billing-period"
            checked={selected === option.value}
            onChange={() => onChange(option.value)}
          />
          <label htmlFor={option.id}>{option.label}</label>
        </div>
      ))}
      <div className="glass-glider" />
    </div>
  );
};
