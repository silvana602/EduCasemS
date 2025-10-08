import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
    return (
        <>
            <h1 className="text-xl font-semibold">Crear cuenta</h1>
            <p className="text-sm text-fg/70 mt-1">Comienza a aprender con Educasem.</p>
            <div className="mt-4">
                <RegisterForm />
            </div>
        </>
    );
}