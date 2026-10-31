import type { User } from "firebase/auth";

export const ADMIN_EMAIL = "admin@ffg-ve.org";

export function isAuthorizedAdmin(user: User | null): boolean {
  return user?.email === ADMIN_EMAIL && user.emailVerified;
}
