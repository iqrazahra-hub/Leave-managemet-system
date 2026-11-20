import { createContext, useCallback, useContext, useState } from "react";

// Small confirmation messages. Any screen can call:  const toast = useToast(); toast("Saved");
const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const toast = useCallback((message, kind = "success") => {
    const id = Math.random();
    setItems((list) => [...list, { id, message, kind }]);
    setTimeout(() => setItems((list) => list.filter((t) => t.id !== id)), 3800);
  }, []);
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toasts" aria-live="polite">
        {items.map((t) => <div key={t.id} className={`toast toast--${t.kind}`}>{t.message}</div>)}
      </div>
    </ToastContext.Provider>
  );
}
