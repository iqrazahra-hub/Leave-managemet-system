// Initials in a colored circle. The color is picked from the name, so a person always gets the same one.
export default function Avatar({ name, size = 32 }) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 90;
  return (
    <span className="avatar" aria-hidden="true"
      style={{ width: size, height: size, fontSize: size * 0.38, background: `hsl(${150 + h} 38% 34%)` }}>
      {initials}
    </span>
  );
}
