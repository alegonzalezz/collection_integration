import { useState } from 'react'
import { Layers, Sun, Moon } from 'lucide-react'
import Sidebar from './components/Sidebar'
import MainEditor from './components/MainEditor'
import { emptyCollection } from './lib/domain-logic'

function App() {
  const [collection, setCollection] = useState(emptyCollection)
  const [selectedRequestId, setSelectedRequestId] = useState(null)
  const [selectedUseCaseId, setSelectedUseCaseId] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

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
          const updatedRequest = {
            ...uc.item[requestIndex],
            ...(updates.request ? { request: { ...uc.item[requestIndex].request, ...updates.request } } : updates)
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
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>
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
