import { useState, useRef } from 'react'
import { Layers, Sun, Moon, Upload, Download, FileJson } from 'lucide-react'
import Sidebar from './components/Sidebar'
import MainEditor from './components/MainEditor'
import URLManager from './components/URLManager'
import { emptyCollection, importCollection, isEnvironmentFile, exportCollectionWithEnv, exportCollectionWithVariables, exportEnvironment } from './lib/domain-logic'

function App() {
  const [collection, setCollection] = useState(emptyCollection)
  const [selectedRequestId, setSelectedRequestId] = useState(null)
  const [selectedUseCaseId, setSelectedUseCaseId] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [importError, setImportError] = useState(null)
  const [currentEnv, setCurrentEnv] = useState('local')
  const collectionInputRef = useRef(null)
  const urlsInputRef = useRef(null)

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
          
          // Manejar protocolProfileBehavior
          if (updates.protocolProfileBehavior !== undefined) {
            updatedRequest.protocolProfileBehavior = updates.protocolProfileBehavior
          }
          
          updatedRequests[requestIndex] = updatedRequest
          return { ...uc, item: updatedRequests }
        }
        return uc
      })
      return { ...prev, item: updatedItem }
    })
  }

  const handleExport = (type = 'all') => {
    const environments = ['local', 'dev', 'prod']
    const urls = collection.info?.urls || []
    
    const downloadFile = (content, filename) => {
      const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    }
    
    if (urls.length === 0 || type === 'collection') {
      downloadFile(collection, `${collection.info.name || 'collection'}.json`)
      return
    }
    
    const collectionWithVars = exportCollectionWithVariables(collection)
    downloadFile(collectionWithVars, `${collection.info.name || 'collection'}.json`)
    
    if (type === 'collection') return
    
    environments.forEach(envName => {
      const environment = exportEnvironment(collection, envName)
      downloadFile(environment, `${collection.info.name || 'collection'}_${envName}.environment.json`)
    })
  }

  const handleImportClick = () => {
    collectionInputRef.current?.click()
  }

  const handleImportEnvClick = () => {
    environmentInputRef.current?.click()
  }

  const handleExportUrls = () => {
    const urls = collection.info?.urls || []
    if (urls.length === 0) {
      setImportError('No hay URLs para exportar')
      return
    }
    
    const downloadFile = (content, filename) => {
      const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    }
    
    const urlsData = { urls: urls }
    downloadFile(urlsData, `${collection.info.name || 'collection'}_urls.json`)
    
    ['local', 'dev', 'prod'].forEach(envName => {
      const environment = exportEnvironment(collection, envName)
      downloadFile(environment, `${collection.info.name || 'collection'}_${envName}.environment.json`)
    })
  }

  const handleImportUrls = (event) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const currentUrls = collection.info?.urls || []
    const urlsMap = {}
    
    currentUrls.forEach(url => {
      urlsMap[url.name] = { ...url }
    })
    
    Array.from(files).forEach(file => {
      if (!file.name.endsWith('.json')) return
      
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result)
          
          if (isEnvironmentFile(jsonData)) {
            const envName = jsonData.name
            if (!['local', 'dev', 'prod'].includes(envName)) return
            
            jsonData.values.forEach(v => {
              if (v.enabled) {
                if (!urlsMap[v.key]) {
                  urlsMap[v.key] = {
                    name: v.key,
                    local: 'http://localhost:3000',
                    dev: 'https://dev-api.com',
                    prod: 'https://api.com'
                  }
                }
                urlsMap[v.key][envName] = v.value
              }
            })
          } else if (jsonData.urls && Array.isArray(jsonData.urls)) {
            jsonData.urls.forEach(url => {
              urlsMap[url.name] = {
                name: url.name,
                local: url.local || 'http://localhost:3000',
                dev: url.dev || 'https://dev-api.com',
                prod: url.prod || 'https://api.com'
              }
            })
          }
          
          const updatedUrls = Object.values(urlsMap)
          setCollection(prev => ({
            ...prev,
            info: { ...prev.info, urls: updatedUrls }
          }))
          
          setImportError(null)
        } catch (error) {
          console.error('Error processing URLs file:', error)
        }
      }
      reader.readAsText(file)
    })
    
    event.target.value = ''
  }

  const getUseCaseVariables = (collection, useCaseId) => {
    const useCase = collection.item.find(uc => uc.name === useCaseId)
    if (!useCase || !useCase.item) return []
    
    const variables = []
    useCase.item.forEach(request => {
      const tests = request.event?.[0]?.script?.exec || []
      tests.forEach(test => {
        if (test && test.includes('pm.globals.set("')) {
          const match = test.match(/pm\.globals\.set\("([^"]+)",\s*jsonData\.(.+?)(?:;|$)/)
          if (match) {
            variables.push({ name: match[1], jsonPath: match[2], requestName: request.name })
          }
        }
      })
    })
    return variables
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.name.endsWith('.json')) {
      setImportError('Por favor selecciona un archivo JSON')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result)
        
        if (isEnvironmentFile(jsonData)) {
          setImportError(`Detectado archivo de environment: ${jsonData.name}. Por favor importá primero la colección y luego el environment.`)
          event.target.value = ''
          return
        }
        
        const importedCollection = importCollection(jsonData)
        
        setCollection(importedCollection)
        setSelectedRequestId(null)
        setSelectedUseCaseId(null)
        setImportError(null)
        
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

  const handleImportEnvironment = (event) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const processFiles = (fileList) => {
      const currentUrls = collection.info?.urls || []
      const urlsMap = {}
      
      currentUrls.forEach(url => {
        urlsMap[url.name] = { ...url }
      })
      
      Array.from(fileList).forEach(file => {
        if (!file.name.endsWith('.json')) return
        
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const envData = JSON.parse(e.target.result)
            
            if (!isEnvironmentFile(envData)) return
            
            const envName = envData.name
            if (!['local', 'dev', 'prod'].includes(envName)) return
            
            envData.values.forEach(v => {
              if (urlsMap[v.key] && v.enabled) {
                urlsMap[v.key][envName] = v.value
              }
            })
            
            const updatedUrls = Object.values(urlsMap)
            setCollection(prev => ({
              ...prev,
              info: { ...prev.info, urls: updatedUrls }
            }))
            
            setImportError(null)
          } catch (error) {
            console.error('Error processing environment file:', error)
          }
        }
        reader.readAsText(file)
      })
    }
    
    processFiles(files)
    event.target.value = ''
  }

  const handleUpdateUrls = (urls) => {
    setCollection(prev => ({
      ...prev,
      info: { ...prev.info, urls }
    }))
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      <header className={`backdrop-blur-lg px-6 py-4 flex items-center justify-between shadow-lg transition-all duration-300 ${darkMode ? 'bg-slate-800/90 border-b border-slate-700' : 'bg-white/90 border-b border-slate-200'}`}>
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-xl shadow-lg transition-all duration-300 ${darkMode ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <input
              type="text"
              value={collection.info.name}
              onChange={(e) => setCollection(prev => ({
                ...prev,
                info: { ...prev.info, name: e.target.value }
              }))}
              className={`text-xl font-bold tracking-tight bg-transparent border-none focus:outline-none focus:ring-0 ${darkMode ? 'text-white' : 'text-slate-800'}`}
              placeholder="Collection name"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <URLManager
            collection={collection}
            onUpdateUrls={handleUpdateUrls}
            darkMode={darkMode}
            currentEnv={currentEnv}
            onEnvChange={setCurrentEnv}
          />
          <div className={`flex items-center gap-1 px-1 py-1 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
            {['local', 'dev', 'prod'].map(env => (
              <button
                key={env}
                onClick={() => setCurrentEnv(env)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  currentEnv === env
                    ? env === 'local' 
                      ? (darkMode ? 'bg-emerald-600 text-white' : 'bg-emerald-500 text-white')
                      : env === 'dev'
                        ? (darkMode ? 'bg-amber-600 text-white' : 'bg-amber-500 text-white')
                        : (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                    : (darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-800')
                }`}
              >
                {env.toUpperCase()}
              </button>
            ))}
          </div>
          
          {/* Import Collection */}
          <button
            onClick={handleImportClick}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}
            title="Import Collection"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Import</span>
          </button>
          <input
            ref={collectionInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {/* Export Collection */}
          <button
            onClick={() => handleExport('collection')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            title="Export Collection"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          
          {/* Import URLs - multiple files allowed */}
          <button
            onClick={() => urlsInputRef.current?.click()}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}
            title="Import URLs - select multiple files"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Import URLs</span>
          </button>
          <input
            ref={urlsInputRef}
            type="file"
            accept=".json"
            onChange={handleImportUrls}
            className="hidden"
            multiple
          />
          
          {/* Export URLs */}
          <button
            onClick={handleExportUrls}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            title="Export URLs"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export URLs</span>
          </button>
          
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
      {collection.info.name && collection.info.name !== 'Nueva Coleccion' && collection.info.name !== 'Nueva Coleccion' && collection.info.name.length > 0 && (
        <div className={`px-6 py-2 ${darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'} border-b`}>
          <div className="flex items-center gap-2">
            <FileJson className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              {collection.item.length > 0 && (
                <span>
                  {collection.item.length} use cases, {collection.item.reduce((acc, uc) => acc + uc.item.length, 0)} requests
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
          useCaseVariables={getUseCaseVariables(collection, selectedUseCaseId)}
          urls={collection.info?.urls || []}
        />
      </div>
    </div>
  )
}

export default App
