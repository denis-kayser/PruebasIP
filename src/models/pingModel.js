import { pool } from '../config/conexion.js'

export const getPingModelo = async () => {
  const [rows] = await pool.query('SELECT 1 + 1 as result')
  console.log(rows)
  return rows[0]; // { result: 2 }
}


export const publicRutaModelo = async () => {
  const [rows] = await pool.query('SELECT 1 + 1 as result')
  console.log(rows)
  return rows[0]; // { result: 2 }
}


