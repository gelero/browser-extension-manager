import React, { useState, useEffect } from 'react'

const API_URL = 'http://localhost:5000/api/extensions'

function App() {
  const [extensions, setExtensions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

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

  const handleToggle = async (id, /* currentIsActive */) => {
    const toggleUrl = `${API_URL}/${id}/toggle`

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

      const updatedExtension = await response.json();

      setExtensions(prevExtensions =>
        prevExtensions.map(ext =>
          ext.id === id
            ? updatedExtension
            : ext
        )
      );

    } catch (err) {
      console.error('Erro ao alternar o estado:', err);
      setError(err.message);
    }
  };

  const handleRemove = async (id) => {
    const deleteUrl = `${API_URL}/${id}`

    if (!window.confirm(`Tem certeza que deseja remover a extensãoID ${id}?`)) {
      return
    }

    try {
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Falha ao remover a extensão ${id}.Status: ${response.status}`)
      }

      setExtensions(prevExtensions =>
        prevExtensions.filter(ext => ext.id !== id)
      )

      setError(null)

    } catch (err) {
      console.error('Erro ao remover o estado:', err)
    }

  }

  useEffect(() => {
    fetchExtensions()
  }, [])

  const filteredExtensions = extensions.filter(ext => {
    if (filterStatus === 'all') {
      return true
    }
    if (filterStatus === 'active') {
      return ext.isActive
    }
    if (filterStatus === 'inactive') {
      return !ext.isActive
    }
    return true
  })

  if (isLoading) {
    return <div className="loadin-screen">Carregando extensões...</div>
  }

  if (error) {
    return <div className="error-screen">Erro: {error}</div>
  }

  return (
    <div className="extension-manager">
      <h1>Gerenciador de Extensões</h1>

      <div className="filter-controls">
        <button onClick={() => setFilterStatus('all')}
          style={{ fontWeight: filterStatus === 'all' ? 'bold' : 'normal' }}>
          Todos
        </button>

        <button onClick={() => setFilterStatus('active')}
          style={{ fontWeight: filterStatus === 'active' ? 'bold' : 'normal' }}>
          Ativos
        </button>

        <button onClick={() => setFilterStatus('inactive')}
          style={{ fontWeight: filterStatus === 'inactive' ? 'bold' : 'normal' }}>
          Inativos
        </button>
      </div>

      <p>Total de extensões carregadas: {extensions.length}</p>

      <ul>
        {filteredExtensions.map(ext => (
          <li key={ext.id}>
            {ext.name} (ID: {ext.id}) - {ext.isActive ? 'Ativa' : 'Inativa'}
            <button
              style={{ marginLeft: '10px', marginRight: '5px' }}
              onClick={() => handleToggle(ext.id/* , ext.isActive */)}
            >
              {ext.isActive ? 'Desativar' : 'Ativar'}
            </button>

            <button
              style={{ color: 'red' }}
              onClick={() => handleRemove(ext.id)}
            >
              Remover
            </button>

          </li>
        ))}
      </ul>

      <p>Lembre-se de manter o backend Node.js rodando!</p>
    </div>
  )

}

export default App
