// DEPRECATED — reemplazado por Supabase Auth.
// Mantenido solo para no romper imports durante la transición.
// Eliminar este archivo cuando todos los callers estén migrados.

export function getUserId(): string { return ""; }
export function getUser() { return null; }
export function saveUser(_user: unknown): void {}
export function clearUser(): void {}
