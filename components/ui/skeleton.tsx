export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={`animate-pulse bg-muted ${className ?? ""}`} {...props} />
  );
}
