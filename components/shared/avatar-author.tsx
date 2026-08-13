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
    <Avatar size={size} className={cn("bg-surface-container", className)}>
      {src && <AvatarImage src={src} alt={name} />}
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}
