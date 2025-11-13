import React, { useState, useEffect } from 'react'

const API_URL = 'http://localhost:5000/api/extensions'

function App() {
  const [extensions, setExtensions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchExtensions = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error(`Erro HTTP! status: ${response.status}`)
      }

      const data = await response.json()
      setExtensions(data.extensions)

    } catch (err) {
      console.log('Falha ao buscqar extensões:', err)
      setError('Não foi possível carregar os dados.Verifique se o banco Node está rodando')

    } finally {
      setIsLoading(false)
    }

  }

  const handleToggle = async (id, currentIsActive) => {
    const toggleUrl = `${API_URL}/${id}/toggle`;

    try {
      const response = await fetch(toggleUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },

      });

      if (!response.ok) {
        throw new Error(`Falha ao alternar estado da extensão ${id}. Status: ${response.status}`);
      }

      // 2. O backend retorna a extensão atualizada.
      const updatedExtension = await response.json();

      // 3. Atualizar o estado do React (extensions)
      setExtensions(prevExtensions =>
        prevExtensions.map(ext =>
          ext.id === id
            ? updatedExtension // Substitui a extensão antiga pela nova
            : ext
        )
      );

    } catch (err) {
      console.error('Erro ao alternar o estado:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchExtensions()
  }, [])

  if (isLoading) {
    return <div className="loadin-screen">Carregando extensões...</div>
  }

  if (error) {
    return <div className="error-screen">Erro: {error}</div>
  }

  return (
    <div className="extension-manager">
      <h1>Gerenciador de Extensões</h1>

      <p>Total de extensões carregadas: {extensions.length}</p>

      <ul>
        {extensions.map(ext => (
          <li key={ext.id}>
            {ext.name} (ID: {ext.id}) - {ext.isActive ? 'Ativa' : 'Inativa'}
            <button
              style={{ marginLeft: '10px' }}
              onClick={() => handleToggle(ext.id, ext.isActive)}
            >
              {ext.isActive ? 'Desativar' : 'Ativar'}
            </button>
          </li>
        ))}
      </ul>

      <p>Lembre-se de manter o backend Node.js rodando!</p>
    </div>
  )

}

export default App
