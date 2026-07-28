import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AvatarAuthorProps {
  name: string;
  src?: string;
  className?: string;
  size?: "default" | "sm" | "lg";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AvatarAuthor({ name, src, className, size = "default" }: AvatarAuthorProps) {
  return (
    <Avatar size={size} className={cn("bg-muted", className)}>
      {src && <AvatarImage src={src} alt={name} />}
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}
