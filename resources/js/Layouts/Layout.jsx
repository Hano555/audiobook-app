import { Link } from '@inertiajs/react';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="border-b bg-white shadow-sm">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                    <div className="text-lg font-semibold">Audiobook App</div>
                    <nav className="space-x-4 text-sm text-slate-600">
                        <Link href="/" className="hover:text-slate-900">Books</Link>
                    </nav>
                </div>
            </header>
            <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </div>
    );
}
