import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import "./animated-input.css";

export interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  onClear?: () => void;
}

const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ className, icon, onClear, ...props }, ref) => {
    const [value, setValue] = React.useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      if (props.onChange) {
        props.onChange(e);
      }
    };

    const handleReset = () => {
      setValue("");
      if (onClear) {
        onClear();
      }
    };

    return (
      <div className={cn("form", className)}>
        {icon && <div className="form-icon">{icon}</div>}
        <input
          className="input"
          ref={ref}
          value={value}
          onChange={handleChange}
          {...props}
        />
        <button
          type="button"
          className="reset"
          onClick={handleReset}
          aria-label="Clear input"
        >
          <X size={17} />
        </button>
      </div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";

export { AnimatedInput };
