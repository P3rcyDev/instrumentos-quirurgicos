import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import InstrumentList from "../components/InstrumentList";
import CirugiasList from "../components/CirugiasList";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function Dashboard() {
  const navigate = useNavigate();
  const [instrumentos, setInstrumentos] = useState([]);

  const cargarInstrumentos = async () => {
    const snapshot = await getDocs(collection(db, "instrumentos"));
    setInstrumentos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    cargarInstrumentos();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div class="p-4 max-w-5xl mx-auto">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-6xl font-bold">Dashboard</h1>
        <button onClick={handleLogout} class="bg-red-600 text-white px-4 py-2 rounded">
          Cerrar sesión
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-gray-900 rounded-2xl shadow-md p-6">
          <InstrumentList />
        </div>
        <div class="bg-gray-900 --tw-bg-opacity:.2 rounded-2xl shadow-md p-6">
          <CirugiasList instrumentos={instrumentos} />
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
