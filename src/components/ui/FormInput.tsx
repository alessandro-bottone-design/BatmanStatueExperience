import { useId, type InputHTMLAttributes } from "react";
export default function FormInput({
  label,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const id = useId();
  return (
    <div
      className={"ds-field" + (error ? " ds-field-error" : "")}
      data-figma-node="75:1701"
    >
      <label className="ds-body-space" htmlFor={id}>
        {label}
      </label>
      <div className="ds-field-control">
        <input
          {...props}
          id={id}
          autoComplete="off"
          aria-invalid={!!error}
          aria-describedby={error ? id + "-error" : undefined}
        />
      </div>
      {error && (
        <p className="ds-caption" id={id + "-error"}>
          {error}
        </p>
      )}
    </div>
  );
}
