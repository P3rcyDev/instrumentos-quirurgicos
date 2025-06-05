import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

export default function InstrumentList() {
  const instrumentosRef = collection(db, "instrumentos");
  const [instrumentos, setInstrumentos] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: "", tipo: "", estado: "" });
  const [editandoId, setEditandoId] = useState(null);

  const cargarInstrumentos = async () => {
    const snapshot = await getDocs(instrumentosRef);
    setInstrumentos(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    cargarInstrumentos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevo.nombre || !nuevo.tipo || !nuevo.estado) return;

    if (editandoId) {
      const docRef = doc(db, "instrumentos", editandoId);
      await updateDoc(docRef, nuevo);
    } else {
      await addDoc(instrumentosRef, nuevo);
    }
    setNuevo({ nombre: "", tipo: "", estado: "" });
    setEditandoId(null);
    cargarInstrumentos();
  };

  const handleEditar = (inst) => {
    setNuevo({ nombre: inst.nombre, tipo: inst.tipo, estado: inst.estado });
    setEditandoId(inst.id);
  };

  const handleEliminar = async (id) => {
    if (confirm("¿Eliminar instrumento?")) {
      await deleteDoc(doc(db, "instrumentos", id));
      cargarInstrumentos();
    }
  };

  return (
    <section>
      <h2 class="text-xl font-bold mb-4">Instrumentos quirúrgicos</h2>
      <form onSubmit={handleSubmit} class="mb-6">
        <input
          type="text"
          placeholder="Nombre"
          value={nuevo.nombre}
          onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
          class="text-black"
        />
        <input
          type="text"
          placeholder="Tipo"
          value={nuevo.tipo}
          onChange={(e) => setNuevo({ ...nuevo, tipo: e.target.value })}
          class="text-black"
        />
        <input
          type="text"
          placeholder="Estado"
          value={nuevo.estado}
          onChange={(e) => setNuevo({ ...nuevo, estado: e.target.value })}
          class="text-black"
        />
        <button type="submit" class="">
          {editandoId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      <table class="table-auto md:table-fixed">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {instrumentos.map((inst) => (
            <tr key={inst.id} class="border-t text-stone-400 hover:bg-neutral-100 hover:bg-opacity-10">
              <td>{inst.nombre}</td>
              <td>{inst.tipo}</td>
              <td>{inst.estado}</td>
              <td>
                <button onClick={() => handleEditar(inst)}>
                  Editar
                </button>
                <button onClick={() => handleEliminar(inst.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
