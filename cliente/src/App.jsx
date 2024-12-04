import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import TablaDatosAlumnos from './components/TablaDatosAlumnos';

function App() {

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [edad, setEdad] = useState();
  const [padron, setPadron] = useState();

  const [observaciones, setObservaciones] = useState(" ");

  const [id, setId] = useState();

  const [listaAlumnos, setListaAlumnos] = useState([]);

  const [editar, setEditar] = useState(false);

  const actualizarListaAlumnos = () => {
    axios.get('http://localhost:5000/listado_alumnos').then((response)=>{
      setListaAlumnos(response.data);
    });
  }

  useEffect(() => {
    actualizarListaAlumnos(); //cargo por primera vez en la pagina los datos de las bdds
  }, []);

  const limpiarFormulario = () => {
    setNombre("");
    setApellido("");
    setEmail("");
    setEdad("");
    setPadron("");

    setObservaciones(" ");

    setId("");
  }

  const guardarAlumno = () => {
    axios.post('http://localhost:5000/agregar_alumno', {
      nombre: nombre,
      apellido: apellido,
      email: email,
      edad: edad,
      padron: padron,
      observaciones: observaciones,
    }).then(()=>{
      limpiarFormulario();
      actualizarListaAlumnos();
    })
  }

  const prepararEditar = (valor) => {
    setEditar(true);

    setNombre(valor.nombre);
    setApellido(valor.apellido);
    setEmail(valor.email);
    setEdad(valor.edad);
    setPadron(valor.padron);

    setObservaciones(valor.observaciones);

    setId(valor.id);
  }

  const actualizarAlumno = () => {
    axios.put('http://localhost:5000/actualizar_alumno', {
      nombre: nombre,
      apellido: apellido,
      email: email,
      edad: edad,
      padron: padron,
      observaciones: observaciones,
      id: id
    }).then(()=>{
      limpiarFormulario();
      setEditar(false);
      actualizarListaAlumnos();
    })
  }

  const eliminarAlumno = (id) => {
    axios.delete(`http://localhost:5000/eliminar_alumno${id}`).then(()=>{
      actualizarListaAlumnos();
    })
  }

  return (
    <div className='base'>
      <div className='formularioDatos'>

        <label>Nombre*: <input type='text' value={nombre}
        onChange={(event)=>{
          setNombre(event.target.value)
        }}/></label>

        <label>Apellido*: <input type='text' value={apellido}
        onChange={(event)=>{
          setApellido(event.target.value)
        }}/></label>

        <label>Email*: <input type='text' value={email}
        onChange={(event)=>{
          setEmail(event.target.value)
        }}/></label>

        <label>Edad*: <input type='number' value={edad}
        onChange={(event)=>{
          setEdad(event.target.value)
        }}/></label>

        <label>Padron*: <input type='number' value={padron}
        onChange={(event)=>{
          setPadron(event.target.value)
        }}/></label>

        <label>Observaciones: <input type='string' value={observaciones}
        onChange={(event)=>{
          setObservaciones(event.target.value)
        }}/></label>
        
        <label>*Campos obligatorios</label><br/>

        {
          editar==true? //con este condicional se rederiza una opcion o la otra
            <button className='botonEditar' onClick={actualizarAlumno}>Editar alumno</button>
          :
            <button className='botonGuardar' onClick={guardarAlumno}>Guardar alumno</button>
        }

      </div>

      <TablaDatosAlumnos listaAlumnos={listaAlumnos} prepararEditar={prepararEditar} eliminarAlumno={eliminarAlumno}/>

    </div>
  )
}

export default App
