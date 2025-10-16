import { LoginForm } from "@/components/auth";

export default function LoginPage() {
    return (
        <>
            <h1 className="text-xl font-semibold">Iniciar sesión</h1>
            <p className="text-sm text-fg/70 mt-1">Accede a tus cursos y progreso.</p>
            <div className="mt-4">
                <LoginForm />
            </div>
        </>
    );
}
