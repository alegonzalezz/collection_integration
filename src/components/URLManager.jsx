import { useState } from 'react'
import { Plus, X, Link, Globe, Server, Database } from 'lucide-react'

const URLManager = ({ collection, onUpdateUrls, darkMode, currentEnv = 'local', onEnvChange, isOpen = false, onClose }) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const isCurrentlyOpen = isOpen || internalOpen
  const urls = collection.info?.urls || []

  const handleToggle = () => {
    if (isOpen && onClose) {
      onClose()
    } else {
      setInternalOpen(!internalOpen)
    }
  }

  const handleAddUrl = () => {
    const urlNames = ['USERS', 'ITEMS', 'AUTH', 'PRODUCTS', 'ORDERS', 'CUSTOMERS']
    let baseName = 'URL'
    for (const name of urlNames) {
      if (!urls.some(u => u.name === name + '_URL')) {
        baseName = name + '_URL'
        break
      }
    }
    if (urls.length > 0 && baseName === 'URL') {
      baseName = `URL_${urls.length + 1}`
    }
    
    const newUrl = {
      name: baseName,
      local: 'http://localhost:3000',
      dev: 'https://dev-api.com',
      prod: 'https://api.com'
    }
    onUpdateUrls([...urls, newUrl])
  }

  const handleUpdateUrl = (index, field, value) => {
    const updatedUrls = urls.map((url, i) => 
      i === index ? { ...url, [field]: value } : url
    )
    onUpdateUrls(updatedUrls)
  }

  const handleRemoveUrl = (index) => {
    const updatedUrls = urls.filter((_, i) => i !== index)
    onUpdateUrls(updatedUrls)
  }

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${darkMode ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
      >
        <Link className="w-4 h-4" />
        <span className="hidden sm:inline">URLs ({urls.length})</span>
      </button>

      {isCurrentlyOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={handleToggle} />
          <div className={`absolute right-0 top-full mt-2 w-96 max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl border z-50 ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'}`}>
            <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-slate-600' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2">
                <Globe className={`w-5 h-5 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  Gestor de URLs
                </h3>
              </div>
              <button
                onClick={handleToggle}
                className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {urls.length === 0 ? (
                <div className={`text-center py-8 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No hay URLs configuradas</p>
                  <p className="text-xs mt-1">Agregá una URL para usarla en tus requests</p>
                </div>
              ) : (
                urls.map((url, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <input
                        type="text"
                        value={url.name}
                        onChange={(e) => handleUpdateUrl(index, 'name', e.target.value.toUpperCase().replace(/\s+/g, '_'))}
                        className={`px-3 py-1.5 rounded-lg text-sm font-mono font-medium focus:outline-none ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-slate-800 border-slate-300'}`}
                        placeholder="URL_NAME"
                      />
                      <button
                        onClick={() => handleRemoveUrl(index)}
                        className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'text-rose-400 hover:bg-rose-900/30' : 'text-rose-500 hover:bg-rose-50'}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${currentEnv === 'local' ? (darkMode ? 'bg-emerald-900/30' : 'bg-emerald-50') : ''}`}>
                        <Database className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
                        <span className={`text-xs font-medium w-12 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>LOCAL</span>
                        <input
                          type="text"
                          value={url.local}
                          onChange={(e) => handleUpdateUrl(index, 'local', e.target.value)}
                          className={`flex-1 px-2 py-1.5 rounded text-xs font-mono focus:outline-none ${darkMode ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-white text-slate-700 border-slate-300'}`}
                          placeholder="http://localhost:3000"
                        />
                      </div>
                      <div className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${currentEnv === 'dev' ? (darkMode ? 'bg-amber-900/30' : 'bg-amber-50') : ''}`}>
                        <Server className={`w-4 h-4 ${darkMode ? 'text-amber-400' : 'text-amber-500'}`} />
                        <span className={`text-xs font-medium w-12 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>DEV</span>
                        <input
                          type="text"
                          value={url.dev}
                          onChange={(e) => handleUpdateUrl(index, 'dev', e.target.value)}
                          className={`flex-1 px-2 py-1.5 rounded text-xs font-mono focus:outline-none ${darkMode ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-white text-slate-700 border-slate-300'}`}
                          placeholder="https://dev-api.com"
                        />
                      </div>
                      <div className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${currentEnv === 'prod' ? (darkMode ? 'bg-blue-900/30' : 'bg-blue-50') : ''}`}>
                        <Globe className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                        <span className={`text-xs font-medium w-12 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>PROD</span>
                        <input
                          type="text"
                          value={url.prod}
                          onChange={(e) => handleUpdateUrl(index, 'prod', e.target.value)}
                          className={`flex-1 px-2 py-1.5 rounded text-xs font-mono focus:outline-none ${darkMode ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-white text-slate-700 border-slate-300'}`}
                          placeholder="https://api.com"
                        />
                      </div>
                    </div>

                    <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-slate-600' : 'border-slate-200'}`}>
                      <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Usar en request: <code className={`px-1.5 py-0.5 rounded ${darkMode ? 'bg-slate-600 text-cyan-300' : 'bg-slate-200 text-cyan-700'}`}>{"{{" + url.name + "}}"}</code>
                      </p>
                    </div>
                  </div>
                ))
              )}

              <button
                onClick={handleAddUrl}
                className={`w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${darkMode ? 'bg-cyan-600 hover:bg-cyan-500 text-white' : 'bg-cyan-500 hover:bg-cyan-600 text-white'}`}
              >
                <Plus className="w-4 h-4" />
                Agregar URL
              </button>
            </div>

            <div className={`p-3 border-t text-center ${darkMode ? 'border-slate-600 bg-slate-700/30' : 'border-slate-200 bg-slate-50'}`}>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Presiona <kbd className={`px-1.5 py-0.5 rounded text-xs font-mono ${darkMode ? 'bg-slate-600 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>Esc</kbd> para cerrar
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default URLManager