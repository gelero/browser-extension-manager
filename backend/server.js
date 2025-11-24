import express from 'express'
import cors from 'cors'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const extensionsData = require('./data.json')

const app = express()
const PORT = process.env.PORT || 5000

const allowedOrigins = [
    'https://browser-extension-manager-ruddy.vercel.app',
    'http://localhost:5173'
];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json())

let extensions = extensionsData.map((ext, index) => ({
    id: index + 1,
    ...ext
}))

app.get('/api/extensions', (req, res) => {
    res.json({ extensions })
})

app.patch('/api/extensions/:id/toggle', (req, res) => {
    const extensionId = parseInt(req.params.id)
    const index = extensions.findIndex(ext => ext.id === extensionId)

    if (index !== -1) {
        extensions[index].isActive = !extensions[index].isActive
        res.json(extensions[index])
    } else {
        res.status(404).json({ message: 'Extensão não encontrada!' })
    }
})

app.delete('/api/extensions/:id', (req, res) => {
    const extensionId = parseInt(req.params.id)
    const initialLength = extensions.length

    extensions = extensions.filter(ext => ext.id !== extensionId)

    if (extensions.length < initialLength) {
        res.status(200).json({ message: 'Extensão removida com sucesso!', id: extensionId })
    } else {
        res.status(404).json({ message: 'Extensão não encontrada!!' })
    }
})

app.listen(PORT, () => {
    console.log(`Servidor em http://localhost:${PORT}`)
})