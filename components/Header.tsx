import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Yuki Yaki Corner" width={32} height={32} />
          <span className="font-semibold">Yuki Yaki Corner</span>
        </div>
        <nav className="flex gap-4 text-sm">
          <Link href="/">Studio</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
