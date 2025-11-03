import "./price-toggle.css";

interface PriceToggleProps {
  isYearly: boolean;
  onToggle: (checked: boolean) => void;
}

export const PriceToggle = ({ isYearly, onToggle }: PriceToggleProps) => {
  return (
    <>
      <input
        type="checkbox"
        id="check"
        checked={isYearly}
        onChange={(e) => onToggle(e.target.checked)}
      />
      <label htmlFor="check" className="switch">
        <svg viewBox="0 0 212.4992 84.4688" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 42.2346 0 C 18.9082 0 0 18.9082 0 42.2346 C 0 65.5609 18.9082 84.4688 42.2346 84.4688 C 65.5609 84.4688 84.4688 65.5609 84.4688 42.2346 C 84.4688 18.9082 65.5609 0 42.2346 0 Z M 42.2346 16 C 56.6436 16 68.4688 27.8251 68.4688 42.2346 C 68.4688 56.6436 56.6436 68.4688 42.2346 68.4688 C 27.8251 68.4688 16 56.6436 16 42.2346 C 16 27.8251 27.8251 16 42.2346 16 Z"
            fill="currentColor"
            stroke="currentColor"
          />
        </svg>
      </label>
    </>
  );
};
