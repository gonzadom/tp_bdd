import React from 'react';
import { MdModeEdit } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";

const TablaDatosAlumnos = ({ listaAlumnos, prepararEditar, eliminarAlumno}) => {
  return (
    <table className='tablaDatosAlumnos'>
        
      <thead>

        <tr>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Email</th>
          <th>Edad</th>
          <th>Padron</th>
          <th>Observaciones</th>
          <th>Opciones</th>
        </tr>

      </thead>

      <tbody>

        {
          listaAlumnos.map((valor, llave)=>{ //recorro la lista y tomo cada par clave valor
            return (
              <tr key={valor.id}>
                <td>{valor.nombre}</td>
                <td>{valor.apellido}</td>
                <td>{valor.email}</td>
                <td>{valor.edad}</td>
                <td>{valor.padron}</td>

                <td className='observaciones'>{valor.observaciones}</td>

                <td>
                  <button onClick={()=>prepararEditar(valor)}><MdModeEdit/></button> {/*valor ya tiene la informacion del alumno*/}
                  <button onClick={()=>eliminarAlumno(valor.id)}><IoMdTrash/></button>
                </td>

              </tr>
            );
          })
        }

      </tbody>

    </table>
  );
};

export default TablaDatosAlumnos;