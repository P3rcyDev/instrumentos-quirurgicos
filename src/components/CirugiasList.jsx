import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

function Cirugias() {
  const setsRef = collection(db, "sets");
  const [sets, setSets] = useState([]);
  const [nuevoSet, setNuevoSet] = useState("");
  const [instrumentoNuevo, setInstrumentoNuevo] = useState({
    nombre: "",
    cantidad: 1,
  });
  const [instrumentos, setInstrumentos] = useState([]);
  const [editandoSetId, setEditandoSetId] = useState(null);
  const [editNombre, setEditNombre] = useState("");

  const cargarDatos = async () => {
    const snapshotSets = await getDocs(setsRef);
    const setsData = snapshotSets.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSets(setsData);

    const snapshotInst = await getDocs(collection(db, "instrumentos"));
    const instrumentosData = snapshotInst.docs.map((doc) => doc.data());
    setInstrumentos(instrumentosData);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleCrearSet = async () => {
    if (!nuevoSet.trim()) return;
    await addDoc(setsRef, {
      nombreCirugia: nuevoSet,
      instrumentos: [],
    });
    setNuevoSet("");
    cargarDatos();
  };

  const handleAgregarInstrumento = async (setId) => {
    if (!instrumentoNuevo.nombre || instrumentoNuevo.cantidad < 1) return;

    const setDocRef = doc(db, "sets", setId);
    const setData = sets.find((s) => s.id === setId);
    const nuevosInstrumentos = [
      ...(setData.instrumentos || []),
      instrumentoNuevo,
    ];

    await updateDoc(setDocRef, { instrumentos: nuevosInstrumentos });
    setInstrumentoNuevo({ nombre: "", cantidad: 1 });
    cargarDatos();
  };

  const handleEliminarInstrumento = async (setId, index) => {
    if (!confirm("¿Eliminar este instrumento del set?")) return;

    const setDocRef = doc(db, "sets", setId);
    const setData = sets.find((s) => s.id === setId);
    const nuevosInstrumentos = setData.instrumentos.filter((_, i) => i !== index);

    await updateDoc(setDocRef, { instrumentos: nuevosInstrumentos });
    cargarDatos();
  };

  const handleEliminarSet = async (setId) => {
    if (!confirm("¿Eliminar toda la cirugía?")) return;
    await deleteDoc(doc(db, "sets", setId));
    cargarDatos();
  };

  const handleEditarNombre = async (setId) => {
    if (!editNombre.trim()) return;
    await updateDoc(doc(db, "sets", setId), {
      nombreCirugia: editNombre,
    });
    setEditandoSetId(null);
    setEditNombre("");
    cargarDatos();
  };

  return (
    <div>
      <h2 class="text-xl font-bold mb-4">Sets quirúrgicos</h2>
      <div class="mb-6">
        <input type="text" placeholder="Nombre de cirugía" value={nuevoSet} onChange={(e) => setNuevoSet(e.target.value)} class="text-black"/>
        <button onClick={handleCrearSet}>
          Crear Set
        </button>
      </div>

      <div>
        {sets.map((set) => (
          <div  className="border mb-4" key={set.id}>
            {editandoSetId === set.id ? (
              <div>
                <input type="text" value={editNombre} onChange={(e) => setEditNombre(e.target.value)}/>
                <button onClick={() => handleEditarNombre(set.id)}>
                  Guardar
                </button>
                <button onClick={() => {setEditandoSetId(null); setEditNombre("");}}>
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="flex">
                <h3 className="container font-bold text-center align-middle">{set.nombreCirugia}</h3>
                <div className="flex">
                  <button
                    onClick={() => {setEditandoSetId(set.id); setEditNombre(set.nombreCirugia);}}>
                    Editar
                  </button>
                  <button onClick={() => handleEliminarSet(set.id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            )}

            <ul className="mb-10">
              {set.instrumentos?.map((inst, i) => (
                <li key={i} class="">
                  <span>
                    {inst.nombre} (x{inst.cantidad})
                  </span>
                  <button
                    onClick={() => handleEliminarInstrumento(set.id, i)}>
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>

            <div>
              <select value={instrumentoNuevo.nombre} onChange={(e) => setInstrumentoNuevo((prev) => ({...prev,nombre: e.target.value,}))}>
                <option value="">Seleccionar instrumento</option>
                {instrumentos.map((inst, i) => (
                  <option key={i} value={inst.nombre}>
                    {inst.nombre} ({inst.tipo})
                  </option>
                ))}
              </select>

              <input type="number" min="1" value={instrumentoNuevo.cantidad} onChange={(e) => setInstrumentoNuevo((prev) => ({ ...prev, cantidad: Number(e.target.value),}))}/>
              <button onClick={() => handleAgregarInstrumento(set.id)}>
                Agregar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cirugias;
