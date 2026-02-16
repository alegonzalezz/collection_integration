import { useState, useRef } from 'react'
import { Layers, Sun, Moon, Upload, FileJson } from 'lucide-react'
import Sidebar from './components/Sidebar'
import MainEditor from './components/MainEditor'
import { emptyCollection, importCollection } from './lib/domain-logic'

function App() {
  const [collection, setCollection] = useState(emptyCollection)
  const [selectedRequestId, setSelectedRequestId] = useState(null)
  const [selectedUseCaseId, setSelectedUseCaseId] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [importError, setImportError] = useState(null)
  const fileInputRef = useRef(null)

  const handleAddUseCase = (name) => {
    setCollection(prev => ({
      ...prev,
      item: [...prev.item, { name, item: [], protocolProfileBehavior: {} }]
    }))
  }



  const handleAddRequest = (useCaseId, request) => {
    setCollection(prev => ({
      ...prev,
      item: prev.item.map(uc =>
        uc.name === useCaseId
          ? { ...uc, item: [...uc.item, request] }
          : uc
      )
    }))
  }

  const handleDeleteRequest = (useCaseId, requestId) => {
    const cleanRequestId = selectedRequestId
    setCollection(prev => ({
      ...prev,
      item: prev.item.map(uc =>
        uc.name === useCaseId
          ? { ...uc, item: uc.item.filter(r => r.name !== requestId) }
          : uc
      )
    }))
    if (cleanRequestId === requestId) {
      setSelectedRequestId(null)
    }
  }

  const handleUpdateRequest = (requestId, updates) => {
    setCollection(prev => {
      let found = false
      const updatedItem = prev.item.map(uc => {
        if (found) return uc
        const requestIndex = uc.item.findIndex(r => r.name === requestId)
        if (requestIndex !== -1) {
          found = true
          const updatedRequests = [...uc.item]
          const currentRequest = uc.item[requestIndex]
          
          // Manejar actualización de request (headers, body, url, method)
          let updatedRequest = { ...currentRequest }
          
          if (updates.request) {
            updatedRequest.request = {
              ...currentRequest.request,
              ...updates.request
            }
          }
          
          // Manejar actualización de eventos (tests)
          if (updates.event) {
            updatedRequest.event = updates.event
          }
          
          // Manejar otros campos como name
          if (updates.name !== undefined) {
            updatedRequest.name = updates.name
          }
          
          updatedRequests[requestIndex] = updatedRequest
          return { ...uc, item: updatedRequests }
        }
        return uc
      })
      return { ...prev, item: updatedItem }
    })
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(collection, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${collection.info.name || 'collection'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validar que sea un archivo JSON
    if (!file.name.endsWith('.json')) {
      setImportError('Por favor selecciona un archivo JSON')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result)
        const importedCollection = importCollection(jsonData)
        
        setCollection(importedCollection)
        setSelectedRequestId(null)
        setSelectedUseCaseId(null)
        setImportError(null)
        
        // Resetear el input para permitir cargar el mismo archivo nuevamente
        event.target.value = ''
      } catch (error) {
        console.error('Error importing collection:', error)
        setImportError('Error al importar la collection. Verifica que sea un archivo válido de Postman.')
      }
    }
    reader.onerror = () => {
      setImportError('Error al leer el archivo')
    }
    reader.readAsText(file)
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      <header className={`backdrop-blur-lg px-6 py-4 flex items-center justify-between shadow-lg transition-all duration-300 ${darkMode ? 'bg-slate-800/90 border-b border-slate-700' : 'bg-white/90 border-b border-slate-200'}`}>
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-xl shadow-lg transition-all duration-300 ${darkMode ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>API Collection Builder</h1>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Build and manage Postman collections</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Botón de Importar */}
          <button
            onClick={handleImportClick}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            title="Importar Collection"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Importar</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {/* Botón de Dark Mode */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mensaje de error de importación */}
      {importError && (
        <div className={`px-6 py-3 ${darkMode ? 'bg-rose-900/30 border-rose-700' : 'bg-rose-100 border-rose-300'} border-b`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-rose-400' : 'bg-rose-500'}`} />
            <p className={`text-sm ${darkMode ? 'text-rose-300' : 'text-rose-700'}`}>{importError}</p>
          </div>
        </div>
      )}

      {/* Info de la collection importada */}
      {collection.info.name !== 'Nueva Coleccion' && (
        <div className={`px-6 py-2 ${darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'} border-b`}>
          <div className="flex items-center gap-2">
            <FileJson className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              Collection: <strong>{collection.info.name}</strong>
              {collection.item.length > 0 && (
                <span className="ml-2">
                  ({collection.item.length} casos de uso, {collection.item.reduce((acc, uc) => acc + uc.item.length, 0)} requests)
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          collection={collection}
          selectedRequestId={selectedRequestId}
          selectedUseCaseId={selectedUseCaseId}
          onSelectRequest={setSelectedRequestId}
          onSelectUseCase={setSelectedUseCaseId}
          onAddUseCase={handleAddUseCase}
          onAddRequest={handleAddRequest}
          onDeleteRequest={handleDeleteRequest}
          darkMode={darkMode}
        />
        <MainEditor
          collection={collection}
          selectedRequestId={selectedRequestId}
          selectedUseCaseId={selectedUseCaseId}
          onUpdateRequest={handleUpdateRequest}
          onExport={handleExport}
          darkMode={darkMode}
        />
      </div>
    </div>
  )
}

export default App
