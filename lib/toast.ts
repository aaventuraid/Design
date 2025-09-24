type ToastType = 'success' | 'error' | 'info';

export function showToast(message: string, type: ToastType = 'info', duration = 2000) {
  if (typeof document === 'undefined') return;
  const rootId = 'yyc-toast-root';
  let root = document.getElementById(rootId);
  if (!root) {
    root = document.createElement('div');
    root.id = rootId;
    root.className = 'fixed top-4 right-4 z-50 space-y-2';
    document.body.appendChild(root);
  }
  const el = document.createElement('div');
  const base =
    'px-4 py-2 rounded-lg shadow-lg text-white text-sm transition-all duration-300 backdrop-blur';
  const colors =
    type === 'success' ? 'bg-green-500/90' : type === 'error' ? 'bg-red-500/90' : 'bg-gray-800/90';
  el.className = `${base} ${colors}`;
  el.textContent = message;
  root.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-4px)';
    setTimeout(() => el.remove(), 200);
  }, duration);
}
