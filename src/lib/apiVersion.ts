export const AllowedAPIVersion = ["2025-11-25"] as const;

export type APIVersion = (typeof AllowedAPIVersion)[number];

export function isValidVersion(version: string): version is APIVersion {
  return (AllowedAPIVersion as readonly string[]).includes(version);
}
