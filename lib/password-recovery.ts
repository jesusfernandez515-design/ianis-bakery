import { sendPasswordResetEmail, type Auth } from "firebase/auth";

export type RecoveryNotice = { type: "success" | "error"; message: string };
const successMessage = "Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña. Revisa también la carpeta de spam.";

export async function requestPasswordRecovery(auth: Auth, email: string): Promise<RecoveryNotice> {
  const cleanEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+$/.test(cleanEmail) || cleanEmail.length > 254) return { type: "error", message: "Escribe un correo electrónico válido." };
  try {
    auth.languageCode = "es";
    await sendPasswordResetEmail(auth, cleanEmail);
    return { type: "success", message: successMessage };
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? error.code : "";
    // Do not disclose whether an address has an account.
    if (code === "auth/user-not-found") return { type: "success", message: successMessage };
    if (code === "auth/invalid-email") return { type: "error", message: "Escribe un correo electrónico válido." };
    if (code === "auth/too-many-requests") return { type: "error", message: "Hubo demasiados intentos. Espera unos minutos antes de volver a probar." };
    if (code === "auth/network-request-failed") return { type: "error", message: "No pudimos conectar. Revisa tu conexión y vuelve a intentar." };
    return { type: "error", message: "No pudimos procesar la solicitud. Intenta nuevamente más tarde." };
  }
}
