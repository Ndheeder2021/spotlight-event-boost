import "./loading-spinner.css";

interface LoadingSpinnerProps {
  text?: string;
  size?: "sm" | "md" | "lg";
}

export const LoadingSpinner = ({ text = "Loading", size = "md" }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-20 h-20 text-xs",
    md: "w-32 h-32 text-base",
    lg: "w-44 h-44 text-xl"
  };

  const letters = text.split("");

  return (
    <div className={`loader-wrapper ${sizeClasses[size]}`}>
      <div className="loader" />
      <div className="loader-text">
        {letters.map((letter, index) => (
          <span
            key={index}
            className="loader-letter"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </div>
    </div>
  );
};
