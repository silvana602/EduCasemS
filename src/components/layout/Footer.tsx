import Link from "next/link";

export const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer className="mt-10 border-t border-border bg-surface">
            <div className="container mx-auto max-w-7xl px-4 py-6 text-sm text-fg/70 flex flex-col md:flex-row gap-2 md:gap-4 items-center justify-between">
                <p>© {year} Educasem — Cecasem</p>
                <nav className="flex gap-4" aria-label="Enlaces de pie de página">
                    <Link href={'/terms'} className="hover:underline">
                        <span>Términos</span>
                    </Link>
                    <Link href={'/privacy'} className="hover:underline">
                        <span>Privacidad</span>
                    </Link>
                    <Link href={'/contact'} className="hover:underline">
                        <span>Contacto</span>
                    </Link>
                </nav>
            </div>
        </footer>
    );
};
