import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function FormInput({ label, className, id, ...props }: FormInputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="font-label-md text-label-md text-foreground">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full border border-black/10 bg-white px-3 py-2.5 text-sm outline-none transition-colors",
          "focus:border-gold",
          className
        )}
        {...props}
      />
    </div>
  );
}
