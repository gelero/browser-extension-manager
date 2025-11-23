import React, { useState, useEffect } from 'react'
import './App.css'
import ProjectLogoLight from '/assets/images/logo.svg'
import ProjectLogoDark from '/assets/images/logov1.svg'
import MoonIcon from '/assets/images/icon-moon.svg'
import SunIcon from '/assets/images/icon-sun.svg'

const API_URL = 'http://localhost:5000/api/extensions'

function App() {
  const [extensions, setExtensions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [theme, setTheme] = useState('light')

  const fetchExtensions = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error(`Erro HTTP! status: ${response.status}`)
      }

      const data = await response.json()
      const extensionList = Array.isArray(data) ? data : (data.extensions || data.data || [])

      setExtensions(extensionList)
      /* setExtensions(data) */

    } catch (err) {
      console.log('Falha ao buscqar extensões:', err)
      setError('Não foi possível carregar os dados.Verifique se o banco Node está rodando')

    } finally {
      setIsLoading(false)
    }

  }

  const handleToggle = async (id) => {
    const toggleUrl = `${API_URL}/${id}/toggle`

    setExtensions(prevExtensions =>
      prevExtensions.map(ext =>
        ext.id === id ? { ...ext, isActive: !ext.isActive } : ext
      )
    )

    try {
      const response = await fetch(toggleUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Falha ao alternar estado da extensão ${id}. Status: ${response.status}`)
      }

      const updatedExtension = await response.json()

      setExtensions(prevExtensions => {

        const isDisqualified =
          (filterStatus === 'active' && !updatedExtension.isActive) ||
          (filterStatus === 'inactive' && updatedExtension.isActive)

        if (isDisqualified) {
          return prevExtensions.filter(ext => ext.id !== id)
        }

        return prevExtensions.map(ext =>
          ext.id === id ? updatedExtension : ext
        )
      })

    } catch (err) {
      console.error('Erro ao alternar o estado:', err)
      setError(err.message)

      setExtensions(prevExtensions =>
        prevExtensions.map(ext =>
          ext.id === id ? { ...ext, isActive: !ext.isActive } : ext
        )
      )
    }
  }

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

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
    fetchExtensions()
  }, [theme])

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

    <div className="extension-manager" data-theme={theme}>

      <header className="main-header">
        <div className="logo-container">
          <img
            src={theme === 'light' ? ProjectLogoLight : ProjectLogoDark}
            alt="Logo do Projeto Extensions"
            className="project-logo"
          />
        </div>

        <button className="theme-toggle-btn"
          onClick={toggleTheme}
        >
          <img className='theme-button'
            src={theme === 'light' ? MoonIcon : SunIcon}
            alt={theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
            style={{ width: '25px', height: '25px' }}
          />
        </button>
      </header>

      <div className="controls-container">
        <h2 className="section-title">Extensions List</h2>
        <div className="filter-controls">
          <button
            onClick={(e) => {
              setFilterStatus('all')
              e.currentTarget.blur()
            }}
            className={filterStatus === 'all' ? 'filter-active' : ''}>
            All
          </button>
          <button
            onClick={(e) => {
              setFilterStatus('active')
              e.currentTarget.blur()
            }}
            className={filterStatus === 'active' ? 'filter-active' : ''}>
            Active
          </button>
          <button
            onClick={(e) => {
              setFilterStatus('inactive')
              e.currentTarget.blur()
            }}
            className={filterStatus === 'inactive' ? 'filter-active' : ''}>
            Inactive
          </button>
        </div>
      </div>

      <section className="extensions-grid">
        {filteredExtensions.map(ext => (
          <div key={ext.id} className="extension-card">
            <div className="card-info">
              <img
                src={ext.logo.replace('./', '/')}
                alt={`${ext.name} logo`}
                className="extension-logo"
                style={{ width: '58px', height: '58px' }}
              />
              <div className="text-details">
                <h3>{ext.name}</h3>
                <p className="description">{ext.description}</p>
              </div>
            </div>

            <div className="card-actions">

              <button
                className="remove-btn"
                onClick={() => handleRemove(ext.id)}
              >
                Remove
              </button>

              <div className="toggle-switch">
                <label>
                  <input
                    type="checkbox"
                    checked={ext.isActive}
                    onChange={() => handleToggle(ext.id)}
                    disabled={filterStatus === 'active' || filterStatus === 'inactive'}
                  />
                  <span className="slider"
                  >

                  </span>
                </label>
              </div>

            </div>

          </div>
        ))}
      </section>
    </div>
  )

}

export default App
