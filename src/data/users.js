
export const ROLE_LABEL = { employee: "Employee", manager: "Manager", admin: "HR admin" };
export const DEPARTMENTS = ["Engineering & product", "Design", "Sales & marketing", "Customer success", "Operations", "People & finance"];

const KEY = "lms_users";
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const write = (list) => localStorage.setItem(KEY, JSON.stringify(list));

export async function hashPassword(password, salt) {
  try {
    const data = new TextEncoder().encode(`${salt}:${password}`);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return `plain:${password}`; // only if the browser has no crypto (non-secure page)
  }
}

// id, name, email, role, department, designation, employee id, joined, password
const SEED = [
  ["u-admin", "Admin", "admin@email.pk", "admin", "People & finance", "HR manager", "NST-0101", "2022-03-01", "Admin@123"],
  ["u-manager", "Manager", "manager@email.pk", "manager", "Engineering & product", "Engineering manager", "NST-0102", "2021-08-16", "Manager@123"],
  ["u-iqra", "user", "iqra@email.pk", "employee", "Engineering & product", "Frontend developer", "NST-0248", "2024-02-12", "Employee@123"],
];

// Runs once at start-up: creates the demo accounts the first time the app opens.
export async function seedIfEmpty() {
  if (read().length) return;
  const list = [];
  for (const [id, name, email, role, department, designation, employeeId, joined, pw] of SEED) {
    list.push({
      id, name, email, role, department, designation, employeeId, joined, phone: "+92 300 1234567",
      location: "Rawalpindi · Hybrid", manager: role === "employee" ? "Usman Raza" : "Executive team",
      status: "active", passwordHash: await hashPassword(pw, id),
    });
  }
  write(list);
}

export const listUsers = () => read().sort((a, b) => a.name.localeCompare(b.name));
export const findById = (id) => read().find((u) => u.id === id);

export async function authenticate(email, password) {
  const user = read().find((u) => u.email === email.trim().toLowerCase());
  if (!user || user.passwordHash !== (await hashPassword(password, user.id))) throw new Error("invalid");
  if (user.status !== "active") throw new Error("disabled");
  return user;
}

export async function createUser(f) {
  const all = read();
  const email = f.email.trim().toLowerCase();
  if (all.some((u) => u.email === email)) throw new Error("exists");
  const id = `u-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const next = Math.max(100, ...all.map((u) => parseInt(u.employeeId.split("-")[1], 10) || 0)) + 1;
  const user = {
    id, name: f.name.trim(), email, role: f.role, department: f.department, designation: f.designation.trim(),
    employeeId: `NST-${String(next).padStart(4, "0")}`, joined: new Date().toISOString().slice(0, 10),
    phone: "", location: "Rawalpindi · Hybrid", manager: "Usman Raza", status: "active",
    passwordHash: await hashPassword(f.password, id),
  };
  write([...all, user]);
  return user;
}

export function updateUser(id, patch) {
  write(read().map((u) => (u.id === id ? { ...u, ...patch } : u)));
}
export async function setPassword(id, password) {
  updateUser(id, { passwordHash: await hashPassword(password, id) });
}
export async function changePassword(id, current, next) {
  const user = findById(id);
  if (user.passwordHash !== (await hashPassword(current, id))) throw new Error("wrong");
  await setPassword(id, next);
}

export function passwordProblem(pw) {
  if (pw.length < 8) return "Use at least 8 characters.";
  if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return "Include at least one letter and one number.";
  return "";
}
export function generatePassword() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint32Array(10));
  return Array.from(bytes, (n) => chars[n % chars.length]).join("") + "7";
}
