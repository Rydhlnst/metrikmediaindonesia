import { describe, it, expect } from "vitest";
import {
  isContributor,
  isEditor,
  isAdmin,
  canManageEditorial,
} from "@/lib/server-session";

describe("role helpers", () => {
  const mockUser = (role: string) => ({ id: "1", name: "Test", email: "test@test.com", role });

  it("isContributor detects contributor roles", () => {
    expect(isContributor(mockUser("kontributor"))).toBe(true);
    expect(isContributor(mockUser("contributor"))).toBe(true);
    expect(isContributor(mockUser("reporter"))).toBe(true);
    expect(isContributor(mockUser("journalist"))).toBe(true);
    expect(isContributor(mockUser("admin"))).toBe(false);
  });

  it("isEditor detects editor roles", () => {
    expect(isEditor(mockUser("editor"))).toBe(true);
    expect(isEditor(mockUser("editor_in_chief"))).toBe(true);
    expect(isEditor(mockUser("chief_editor"))).toBe(true);
    expect(isEditor(mockUser("seo_manager"))).toBe(true);
    expect(isEditor(mockUser("admin"))).toBe(false);
  });

  it("isAdmin detects admin roles", () => {
    expect(isAdmin(mockUser("super_admin"))).toBe(true);
    expect(isAdmin(mockUser("administrator"))).toBe(true);
    expect(isAdmin(mockUser("admin"))).toBe(true);
    expect(isAdmin(mockUser("editor"))).toBe(false);
  });

  it("canManageEditorial returns true for admin or editor", () => {
    expect(canManageEditorial(mockUser("admin"))).toBe(true);
    expect(canManageEditorial(mockUser("editor"))).toBe(true);
    expect(canManageEditorial(mockUser("contributor"))).toBe(false);
    expect(canManageEditorial(mockUser("user"))).toBe(false);
  });

  it("handles null user", () => {
    expect(isContributor(null)).toBe(false);
    expect(isEditor(null)).toBe(false);
    expect(isAdmin(null)).toBe(false);
    expect(canManageEditorial(null)).toBe(false);
  });

  it("normalizes role with spaces and mixed case", () => {
    expect(isAdmin(mockUser("Super Admin"))).toBe(true);
    expect(isEditor(mockUser("Editor In Chief"))).toBe(true);
    expect(isContributor(mockUser("  Kontributor  "))).toBe(true);
  });
});
