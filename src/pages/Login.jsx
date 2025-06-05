// src/pages/Login.jsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Correo o contraseña inválidos");
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        class="bg-blue-900 p-6 rounded shadow-md w-full max-w-sm border"
      >
        <h2 class="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>
        {error && (
          <div class="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
        )}
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          class="border p-2 w-full mb-4 rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          class="border p-2 w-full mb-4 rounded"
          required
        />
        <button
          type="submit"
          class="bg-blue-600 w-full p-2 rounded hover:bg-blue-700"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}

export default Login;
