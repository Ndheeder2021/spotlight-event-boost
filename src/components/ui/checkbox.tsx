import * as React from "react";
import "./checkbox.css";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(e.target.checked);
      }
    };

    return (
      <label className="container">
        <input
          type="checkbox"
          ref={ref}
          onChange={handleChange}
          {...props}
        />
        <span className="checkmark"></span>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
