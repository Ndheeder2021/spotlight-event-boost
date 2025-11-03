import * as React from "react";
import "./animated-input.css";

export interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ icon, ...props }, ref) => {
    const [value, setValue] = React.useState(props.value || "");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      if (props.onChange) {
        props.onChange(e);
      }
    };

    const handleReset = () => {
      setValue("");
      if (props.onChange) {
        const event = {
          target: { value: "" }
        } as React.ChangeEvent<HTMLInputElement>;
        props.onChange(event);
      }
    };

    return (
      <div className="form">
        {icon && <span className="form-icon">{icon}</span>}
        <input
          {...props}
          ref={ref}
          value={value}
          onChange={handleChange}
          className="input"
          placeholder={props.placeholder || ""}
        />
        {value && (
          <button 
            type="button"
            className="reset" 
            onClick={handleReset}
            aria-label="Clear"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";

export { AnimatedInput };
