import { getPingModelo, publicRutaModelo } from '../models/pingModel.js'

const getPingController = async (req, res) => {
  try {
    const result = await getPingModelo()
    console.log(result)
    res.json(result)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export { getPingController }



export const getpublicController = async (req, res) => {
  try {
    const result = await publicRutaModelo()
    console.log(result)
    res.json(result)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
