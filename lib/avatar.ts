export type AvatarStyle = "initials";

export function generateAvatarUrl(seed: string, _style: AvatarStyle = "initials", size = 128): string {
  return `/api/avatar?seed=${encodeURIComponent(seed)}&size=${size}`;
}
