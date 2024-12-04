const express = require('express');
const mysql = require('mysql2');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'gonza',
    password: 'tp_bdd',
    database: 'alumnos_bdd'
});

db.connect((err) => {
    if (err) {
      console.error('Error conexion MySQL:', err.message);
    } else {
      console.log('Conectado a MySQL');
    }
});

mongoose.connect('mongodb://localhost:27017/alumnos_bdd')
const db_nosql = mongoose.connection
db_nosql.on('open', ()=>{ console.log('Conectado a Mongodb') })
db_nosql.on('error', ()=>{ console.error('Error conexion mongodb') })

const alumnoSchema = new mongoose.Schema (
    {
        id: Number,
        observaciones: String,
    },
)
const modeloAlumno = mongoose.model('alumnos', alumnoSchema);

app.post('/agregar_alumno', (req, res)=>{

    const { nombre, apellido, email, edad, padron, observaciones } = req.body

    db.query('INSERT INTO alumnos (nombre, apellido, email, edad, padron) VALUES (?, ?, ?, ?, ?)', [nombre, apellido, email, edad, padron],
    (err, result)=>{
        if (err) {
            console.error('Error al guardar al alumno', err);
        } else {
            
            const nuevoAlumno = new modeloAlumno({
                id: result.insertId,
                observaciones: observaciones,
            });
              
            nuevoAlumno.save()
            .then(() => {
                res.send('Alumno guardado');
            }).catch(err => {
                console.error('Error al guardar observacion del alumno:', err);
            });
        }
    });
});

app.get('/listado_alumnos', async (req, res) => {
    try {
        db.query('SELECT * FROM alumnos', async (err, alumnos) => {
            if (err) {
                console.error('Error al obtener los datos:', err);
            }

            //Obtengo observaciones desde MongoDB para cada alumno
            const alumnosConObservaciones = await Promise.all(alumnos.map(async (alumno) => {
                let observaciones = await modeloAlumno.find({ id: alumno.id }).exec();
                observaciones = observaciones[0].observaciones //de cada elemento en la bdd nosql solo me quedo con la parte de las observaciones que es lo que me interesa, lo demas lo descarto.
                return {
                    ...alumno, // Datos del alumno de MySQL
                    observaciones // Observaciones asociadas al alumno en MongoDB
                };
            }));

            //Envio la respuesta combinada
            res.json(alumnosConObservaciones);
        });
    } catch (err) {
        console.error('Error al obtener los datos:', err);
    }
});

app.put('/actualizar_alumno', (req, res)=>{
    
    const { nombre, apellido, email, edad, padron, observaciones, id } = req.body

    db.query('UPDATE alumnos SET nombre = ?, apellido = ?, email = ?, edad = ?, padron = ? WHERE id = ?', [nombre, apellido, email, edad, padron, id],
    (err, result)=>{
        if (err) {
            console.error('Error al actualizar al alumno:', err);
        } else {
            modeloAlumno.findOneAndUpdate({ id: id }, { observaciones: observaciones }, { new: true })
            .then(() => {
                res.send('Alumno actualizado');
            })
            .catch(err => {
                console.error('Error al actualizar al alumno:', err);
            });
        }
    }
    );
});

app.delete('/eliminar_alumno:id', (req, res)=>{
    
    const id = req.params.id

    db.query('DELETE FROM alumnos WHERE id = ?', [id],
    (err, result)=>{
        if (err) {
            console.error('Error al eliminar al alumno', err);
        } else {
            modeloAlumno.deleteOne({id: id})
            .then((result) => {
            if (result) {
                res.send('Alumno eliminado');
            } else {
                console.error('Error al eliminar al Alumno');
            }
            });
        }
    }
    );
});

app.listen(5000,()=>{
    console.log('Corriendo en el puerto 5000');
})