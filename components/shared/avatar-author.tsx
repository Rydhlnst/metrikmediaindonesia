import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";

interface AvatarAuthorProps {
  name: string;
  src?: string;
  className?: string;
  size?: "default" | "sm" | "lg";
}

export function AvatarAuthor({ name, src, className, size = "default" }: AvatarAuthorProps) {
  return (
    <Avatar
      size={size}
      className={cn(
        "rounded-none after:rounded-none after:border-black/10 bg-surface-container",
        className
      )}
    >
      {src && <AvatarImage src={src} alt={name} className="rounded-none" />}
      <AvatarFallback className="rounded-none bg-surface-container text-foreground">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
