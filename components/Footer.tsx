import StatusIndicator from './StatusIndicator';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-sm text-neutral-dark font-medium">
              © {new Date().getFullYear()} Yuki Yaki Corner
            </p>
            <p className="text-xs text-neutral-gray">Studio Foto F&B Profesional</p>
          </div>

          <div className="flex items-center gap-6 text-xs text-neutral-gray">
            <StatusIndicator />
            <span>Didesain sesuai panduan brand</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-neutral-gray">
            Transformasi foto makanan menjadi aset visual berkualitas tinggi untuk platform
            marketplace
          </p>
        </div>
      </div>
    </footer>
  );
}
