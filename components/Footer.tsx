export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6 text-sm text-neutral-gray flex items-center justify-between">
        <p>© {new Date().getFullYear()} Yuki Yaki Corner</p>
        <p>Didesain sesuai brand guideline</p>
      </div>
    </footer>
  );
}
