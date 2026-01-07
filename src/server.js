import express from 'express'
import { PORT } from './config/config.js'
import { getPingController, getpublicController } from './controllers/pingController.js'
import { logAndCheckIP as middleware } from './middleware/middleware.js'
const app = express()
app.use(express.json())


// Rutas
app.use('/api/v1', middleware, getPingController);
app.use('/api/v2', getpublicController);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


