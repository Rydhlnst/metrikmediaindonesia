export type AvatarStyle = "initials";

export function generateAvatarUrl(seed: string, style: AvatarStyle = "initials", size = 128): string {
  void style;
  return `/api/avatar?seed=${encodeURIComponent(seed)}&size=${size}`;
}
