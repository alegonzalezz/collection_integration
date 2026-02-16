import { useState, useMemo } from 'react'
import { Download, FileJson, Code, Hash, Plus, X, Layers, Zap, Box, Globe, FileCode, CheckCircle } from 'lucide-react'
import { generateStatusCodeTest } from '../lib/domain-logic'

const MainEditor = ({ collection, selectedRequestId, selectedUseCaseId, onUpdateRequest, onExport, darkMode }) => {
  const [activeTab, setActiveTab] = useState('headers')
  const [newTestName, setNewTestName] = useState('')
  const [newTestStatusCode, setNewTestStatusCode] = useState('200')

  const requestData = useMemo(() => {
    if (!selectedRequestId || !selectedUseCaseId) return null
    const useCase = collection.item.find(uc => uc.name === selectedUseCaseId)
    if (!useCase) return null
    const request = useCase.item.find(r => r.name === selectedRequestId)
    if (!request) return null
    return {
      name: request.name,
      method: request.request.method,
      url: request.request.url?.raw || '',
      headers: request.request.header || [],
      body: request.request.body?.raw || '',
      tests: request.event?.[0]?.script?.exec || []
    }
  }, [selectedRequestId, selectedUseCaseId, collection])

  const handleChange = (field, value) => {
    onUpdateRequest(selectedRequestId, { [field]: value })
  }

  const handleUrlChange = (value) => {
    onUpdateRequest(selectedRequestId, {
      request: {
        url: { raw: value, host: [value] }
      }
    })
  }

  const handleMethodChange = (method) => {
    onUpdateRequest(selectedRequestId, {
      request: {
        method
      }
    })
  }

  const handleHeaderChange = (index, field, value) => {
    const newHeaders = [...requestData.headers]
    newHeaders[index] = { ...newHeaders[index], [field]: value }
    onUpdateRequest(selectedRequestId, {
      request: {
        header: newHeaders
      }
    })
  }

  const addHeader = () => {
    const newHeaders = [...requestData.headers, { key: '', value: '' }]
    onUpdateRequest(selectedRequestId, {
      request: {
        header: newHeaders
      }
    })
  }

  const removeHeader = (index) => {
    const newHeaders = requestData.headers.filter((_, i) => i !== index)
    onUpdateRequest(selectedRequestId, {
      request: {
        header: newHeaders
      }
    })
  }

  const handleBodyChange = (value) => {
    onUpdateRequest(selectedRequestId, {
      request: {
        body: { mode: 'raw', raw: value }
      }
    })
  }

  const handleAddTest = () => {
    if (!newTestName.trim()) return
    
    const statusCode = parseInt(newTestStatusCode, 10) || 200
    const testCode = generateStatusCodeTest(newTestName.trim(), statusCode)
    
    const updatedTests = [...requestData.tests, testCode]
    
    onUpdateRequest(selectedRequestId, {
      event: [
        {
          listen: 'test',
          script: {
            exec: updatedTests,
            type: 'text/javascript'
          }
        }
      ]
    })
    
    // Limpiar el formulario
    setNewTestName('')
    setNewTestStatusCode('200')
  }

  const handleRemoveTest = (index) => {
    const updatedTests = requestData.tests.filter((_, i) => i !== index)
    
    onUpdateRequest(selectedRequestId, {
      event: [
        {
          listen: 'test',
          script: {
            exec: updatedTests,
            type: 'text/javascript'
          }
        }
      ]
    })
  }

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-400', hover: 'hover:bg-emerald-500/20' }
      case 'POST': return { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-400', hover: 'hover:bg-amber-500/20' }
      case 'DELETE': return { bg: 'bg-rose-500/10', text: 'text-rose-600', border: 'border-rose-400', hover: 'hover:bg-rose-500/20' }
      case 'PUT': return { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-400', hover: 'hover:bg-blue-500/20' }
      case 'PATCH': return { bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-400', hover: 'hover:bg-purple-500/20' }
      default: return { bg: 'bg-slate-500/10', text: 'text-slate-600', border: 'border-slate-400', hover: 'hover:bg-slate-500/20' }
    }
  }

  const getMethodDarkColor = (method) => {
    switch (method) {
      case 'GET': return { bg: 'bg-emerald-900/30', text: 'text-emerald-400', border: 'border-emerald-700', hover: 'hover:bg-emerald-900/50' }
      case 'POST': return { bg: 'bg-amber-900/30', text: 'text-amber-400', border: 'border-amber-700', hover: 'hover:bg-amber-900/50' }
      case 'DELETE': return { bg: 'bg-rose-900/30', text: 'text-rose-400', border: 'border-rose-700', hover: 'hover:bg-rose-900/50' }
      case 'PUT': return { bg: 'bg-blue-900/30', text: 'text-blue-400', border: 'border-blue-700', hover: 'hover:bg-blue-900/50' }
      case 'PATCH': return { bg: 'bg-purple-900/30', text: 'text-purple-400', border: 'border-purple-700', hover: 'hover:bg-purple-900/50' }
      default: return { bg: 'bg-slate-700/30', text: 'text-slate-400', border: 'border-slate-600', hover: 'hover:bg-slate-700/50' }
    }
  }

  const tabs = [
    { id: 'headers', label: 'Headers', icon: Hash },
    { id: 'body', label: 'Body', icon: Box },
    { id: 'tests', label: 'Tests', icon: Code }
  ]

  if (!requestData) {
    return (
      <div className={`flex-1 p-8 flex flex-col items-center justify-center h-full transition-all duration-300 ${darkMode ? 'bg-slate-900/50' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
        <div className="text-center max-w-md">
          <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center transition-all duration-300 ${darkMode ? 'bg-gradient-to-br from-blue-600/20 to-indigo-600/20 shadow-2xl shadow-blue-900/20' : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/25'}`}>
            <Layers className="w-12 h-12 text-white" />
          </div>
          <h2 className={`text-2xl font-bold mb-3 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-slate-800'}`}>API Collection Builder</h2>
          <p className={`mb-6 transition-colors duration-300 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Select a request from the sidebar to edit</p>
          <button
            onClick={onExport}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl ${darkMode ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-900/50' : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-blue-500/25'}`}
          >
            <Download className="w-5 h-5" />
            Export Collection
          </button>
        </div>
      </div>
    )
  }

  const methodColors = darkMode ? getMethodDarkColor(requestData.method) : getMethodColor(requestData.method)

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ${darkMode ? 'bg-slate-900/50' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      <div className={`p-6 border-b transition-all duration-300 ${darkMode ? 'bg-slate-800/80 backdrop-blur-lg border-slate-700' : 'bg-white/80 backdrop-blur-lg border-slate-200'}`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`relative group`}>
            <select
              value={requestData.method}
              onChange={(e) => handleMethodChange(e.target.value)}
              className={`font-semibold px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all duration-300 cursor-pointer appearance-none pr-10 ${methodColors.bg} ${methodColors.text} ${methodColors.border} ${methodColors.hover} border`}
            >
              {methods.map(m => (
                <option key={m} value={m} className={`text-slate-800`}>{m}</option>
              ))}
            </select>
            <Globe className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none ${methodColors.text}`} />
          </div>
          <div className="flex-1 relative">
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              <Globe className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={requestData.url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://api.example.com/endpoint"
              className={`w-full pl-12 pr-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all duration-300 font-mono ${darkMode ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500 border'}`}
            />
          </div>
        </div>
        <div className={`relative`}>
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            <FileCode className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={requestData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Request name"
            className={`w-full pl-12 pr-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all duration-300 font-medium ${darkMode ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500 border'}`}
          />
        </div>
      </div>

      <div className={`border-b transition-all duration-300 ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white/80 border-slate-200'}`}>
        <div className="flex">
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-300 hover:scale-105 ${isActive
                  ? `border-b-2 ${darkMode ? 'border-blue-500 text-blue-400 bg-blue-600/10' : 'border-blue-500 text-blue-600 bg-blue-50'}`
                  : `${darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto scrollbar-thin">
        <div className={`rounded-2xl p-6 transition-all duration-300 ${darkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-slate-200 shadow-lg'}`}>
          {activeTab === 'headers' && (
            <div className="space-y-3">
              {requestData.headers.map((header, index) => (
                <div key={index} className={`flex gap-3 items-center p-2 rounded-xl transition-all duration-300 group hover:scale-[1.01] ${darkMode ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'}`}>
                  <div className={`flex-1 relative`}>
                    <input
                      type="text"
                      value={header.key}
                      onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                      placeholder="Key"
                      className={`w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all duration-300 ${darkMode ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500 border'}`}
                    />
                  </div>
                  <div className={`flex-1 relative`}>
                    <input
                      type="text"
                      value={header.value}
                      onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                      placeholder="Value"
                      className={`w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all duration-300 ${darkMode ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500 border'}`}
                    />
                  </div>
                  <button
                    onClick={() => removeHeader(index)}
                    className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-110 ${darkMode ? 'text-rose-400 hover:bg-rose-900/30' : 'text-rose-500 hover:bg-rose-50'}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addHeader}
                className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.01] group flex items-center justify-center gap-2 ${darkMode ? 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 hover:shadow-md'}`}
              >
                <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                Add Header
              </button>
            </div>
          )}

          {activeTab === 'body' && (
            <div className="relative">
              <textarea
                value={requestData.body}
                onChange={(e) => handleBodyChange(e.target.value)}
                placeholder="Enter request body (JSON, XML, etc.)"
                className={`w-full h-80 px-4 py-3 rounded-xl text-sm focus:outline-none transition-all duration-300 font-mono resize-none ${darkMode ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500 border'}`}
              />
              <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${darkMode ? 'bg-amber-900/30 text-amber-400 border border-amber-700' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                <div className="flex items-center gap-1.5">
                  <FileJson className="w-3 h-3" />
                  JSON / XML
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tests' && (
            <div className="space-y-6">
              {/* Formulario para agregar test */}
              <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Agregar Test de Status Code
                </h3>
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Nombre del Test
                    </label>
                    <input
                      type="text"
                      value={newTestName}
                      onChange={(e) => setNewTestName(e.target.value)}
                      placeholder="Ej: Status code is 200"
                      className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-all duration-300 ${darkMode ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 border' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-blue-500 border'}`}
                    />
                  </div>
                  <div className="w-24">
                    <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Status Code
                    </label>
                    <input
                      type="number"
                      value={newTestStatusCode}
                      onChange={(e) => setNewTestStatusCode(e.target.value)}
                      placeholder="200"
                      className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-all duration-300 ${darkMode ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 border' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-blue-500 border'}`}
                    />
                  </div>
                  <button
                    onClick={handleAddTest}
                    disabled={!newTestName.trim()}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                      !newTestName.trim()
                        ? 'opacity-50 cursor-not-allowed ' + (darkMode ? 'bg-slate-700 text-slate-500' : 'bg-slate-200 text-slate-400')
                        : (darkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white')
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    Agregar
                  </button>
                </div>
              </div>

              {/* Lista de tests agregados */}
              {requestData.tests.length > 0 && (
                <div className="space-y-2">
                  <h3 className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Tests Agregados ({requestData.tests.length})
                  </h3>
                  {requestData.tests.map((test, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${darkMode ? 'bg-slate-700/50 border border-slate-600' : 'bg-slate-50 border border-slate-200'}`}
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
                        <div>
                          <p className={`text-sm font-medium ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                            Test #{index + 1}
                          </p>
                          <p className={`text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {test.split('\n')[0].replace('pm.test("', '').replace('",', '')}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveTest(index)}
                        className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${darkMode ? 'text-rose-400 hover:bg-rose-900/30' : 'text-rose-500 hover:bg-rose-50'}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Vista previa del código */}
              {requestData.tests.length > 0 && (
                <div className="relative">
                  <h3 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Código Generado
                  </h3>
                  <pre className={`w-full p-4 rounded-xl text-xs font-mono overflow-x-auto ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-900 border-slate-800 text-slate-300'} border`}>
                    <code>{requestData.tests.join('\n\n')}</code>
                  </pre>
                  <div className={`absolute top-8 right-4 px-2 py-1 rounded text-xs ${darkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                    JavaScript
                  </div>
                </div>
              )}

              {requestData.tests.length === 0 && (
                <div className={`text-center py-8 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  <Zap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No hay tests agregados</p>
                  <p className="text-xs mt-1">Agrega un test usando el formulario de arriba</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={`p-4 border-t transition-all duration-300 ${darkMode ? 'bg-slate-800/80 backdrop-blur-lg border-slate-700' : 'bg-white/80 backdrop-blur-lg border-slate-200'}`}>
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            <Layers className="w-4 h-4" />
            <span className="text-sm">{collection.item.reduce((acc, uc) => acc + uc.item.length, 0)} requests</span>
          </div>
          <button
            onClick={onExport}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl ${darkMode ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-900/50' : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-blue-500/25'}`}
          >
            <Download className="w-4 h-4" />
            Export Collection
          </button>
        </div>
      </div>
    </div>
  )
}

export default MainEditor
