import { useState, useMemo } from 'react'
import { Download, FileJson, Code, Hash, Plus, X, Layers, Zap, Box, Globe, FileCode, CheckCircle, GitBranch, List, Activity, Eye } from 'lucide-react'
import { generateStatusCodeTest, generateJsonPathTest, generateArrayLengthTest } from '../lib/domain-logic'

const MainEditor = ({ collection, selectedRequestId, selectedUseCaseId, onUpdateRequest, onExport, darkMode }) => {
  const [activeTab, setActiveTab] = useState('headers')
  
  // Estado para el tipo de test seleccionado
  const [selectedTestType, setSelectedTestType] = useState('status')
  
  // Campos comunes
  const [testName, setTestName] = useState('')
  
  // Campos específicos por tipo
  const [statusCode, setStatusCode] = useState('200')
  const [jsonPath, setJsonPath] = useState('')
  const [expectedValue, setExpectedValue] = useState('')
  const [arrayPath, setArrayPath] = useState('')
  const [arrayLength, setArrayLength] = useState('')

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

  // Generar preview del código según el tipo seleccionado
  const generatedCode = useMemo(() => {
    if (!testName.trim()) return ''
    
    switch (selectedTestType) {
      case 'status':
        if (!statusCode) return ''
        return generateStatusCodeTest(testName.trim(), parseInt(statusCode, 10) || 200)
      case 'json':
        if (!jsonPath.trim()) return ''
        return generateJsonPathTest(testName.trim(), jsonPath.trim(), expectedValue.trim())
      case 'array':
        if (!arrayPath.trim() || !arrayLength) return ''
        return generateArrayLengthTest(testName.trim(), arrayPath.trim(), parseInt(arrayLength, 10) || 0)
      default:
        return ''
    }
  }, [selectedTestType, testName, statusCode, jsonPath, expectedValue, arrayPath, arrayLength])

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
    if (!generatedCode) return
    
    const updatedTests = [...requestData.tests, generatedCode]
    
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
    
    // Limpiar formulario
    setTestName('')
    setStatusCode('200')
    setJsonPath('')
    setExpectedValue('')
    setArrayPath('')
    setArrayLength('')
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

  const testTypes = [
    { 
      id: 'status', 
      label: 'Status Code', 
      icon: Activity,
      description: 'Validar código HTTP',
      color: 'blue'
    },
    { 
      id: 'json', 
      label: 'JSON Path', 
      icon: GitBranch,
      description: 'Validar valor en JSON',
      color: 'purple'
    },
    { 
      id: 'array', 
      label: 'Array Length', 
      icon: List,
      description: 'Validar cantidad de elementos',
      color: 'orange'
    }
  ]

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
              {/* Selector de tipo de test */}
              <div>
                <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Selecciona el tipo de test
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {testTypes.map((type) => {
                    const Icon = type.icon
                    const isSelected = selectedTestType === type.id
                    const colorClasses = {
                      blue: isSelected 
                        ? (darkMode ? 'bg-blue-600 border-blue-500' : 'bg-blue-500 border-blue-600') 
                        : (darkMode ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'),
                      purple: isSelected 
                        ? (darkMode ? 'bg-purple-600 border-purple-500' : 'bg-purple-500 border-purple-600') 
                        : (darkMode ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'),
                      orange: isSelected 
                        ? (darkMode ? 'bg-orange-600 border-orange-500' : 'bg-orange-500 border-orange-600') 
                        : (darkMode ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 hover:bg-slate-100')
                    }
                    
                    return (
                      <button
                        key={type.id}
                        onClick={() => setSelectedTestType(type.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${colorClasses[type.color]} ${isSelected ? 'text-white' : (darkMode ? 'text-slate-300' : 'text-slate-700')}`}
                      >
                        <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-white' : (darkMode ? 'text-slate-400' : 'text-slate-500')}`} />
                        <p className="font-semibold text-sm">{type.label}</p>
                        <p className={`text-xs mt-1 ${isSelected ? 'text-white/80' : (darkMode ? 'text-slate-500' : 'text-slate-500')}`}>
                          {type.description}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Formulario dinámico según el tipo seleccionado */}
              <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Configurar Test
                </h3>
                
                {/* Campo común: Nombre del test */}
                <div className="mb-4">
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Nombre del Test *
                  </label>
                  <input
                    type="text"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    placeholder="Ej: Validar respuesta exitosa"
                    className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-all duration-300 ${darkMode ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 border' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-blue-500 border'}`}
                  />
                </div>

                {/* Campos específicos por tipo */}
                {selectedTestType === 'status' && (
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Status Code Esperado *
                    </label>
                    <input
                      type="number"
                      value={statusCode}
                      onChange={(e) => setStatusCode(e.target.value)}
                      placeholder="200"
                      className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-all duration-300 ${darkMode ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 border' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-blue-500 border'}`}
                    />
                  </div>
                )}

                {selectedTestType === 'json' && (
                  <div className="space-y-3">
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        JSON Path *
                      </label>
                      <input
                        type="text"
                        value={jsonPath}
                        onChange={(e) => setJsonPath(e.target.value)}
                        placeholder="Ej: data.name, response[0].id"
                        className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-all duration-300 ${darkMode ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 border' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-blue-500 border'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Valor Esperado
                      </label>
                      <input
                        type="text"
                        value={expectedValue}
                        onChange={(e) => setExpectedValue(e.target.value)}
                        placeholder="Ej: John Doe, 123, true"
                        className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-all duration-300 ${darkMode ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 border' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-blue-500 border'}`}
                      />
                    </div>
                  </div>
                )}

                {selectedTestType === 'array' && (
                  <div className="space-y-3">
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Path del Array *
                      </label>
                      <input
                        type="text"
                        value={arrayPath}
                        onChange={(e) => setArrayPath(e.target.value)}
                        placeholder="Ej: data.users, items"
                        className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-all duration-300 ${darkMode ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 border' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-blue-500 border'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Cantidad Esperada *
                      </label>
                      <input
                        type="number"
                        value={arrayLength}
                        onChange={(e) => setArrayLength(e.target.value)}
                        placeholder="5"
                        className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-all duration-300 ${darkMode ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 border' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-blue-500 border'}`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Preview del código generado */}
              {generatedCode && (
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
                    <h3 className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-200'}`}>
                      Código que se generará
                    </h3>
                  </div>
                  <pre className={`w-full p-3 rounded-lg text-xs font-mono overflow-x-auto ${darkMode ? 'bg-slate-900 text-slate-300' : 'bg-slate-800 text-slate-300'}`}>
                    <code>{generatedCode}</code>
                  </pre>
                  <button
                    onClick={handleAddTest}
                    className={`w-full mt-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                      darkMode ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Test
                  </button>
                </div>
              )}

              {/* Lista de tests agregados */}
              {requestData.tests.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Tests Agregados ({requestData.tests.length})
                    </h3>
                  </div>
                  {requestData.tests.map((test, index) => {
                    // Detectar el tipo de test
                    let testType = 'code'
                    let typeColor = darkMode ? 'text-blue-400' : 'text-blue-500'
                    let typeLabel = 'Código'
                    let bgColor = darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                    
                    if (test.includes('.to.have.status(')) {
                      testType = 'status'
                      typeColor = darkMode ? 'text-blue-400' : 'text-blue-600'
                      typeLabel = 'Status'
                      bgColor = darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                    } else if (test.includes('.length)')) {
                      testType = 'array'
                      typeColor = darkMode ? 'text-orange-400' : 'text-orange-600'
                      typeLabel = 'Array'
                      bgColor = darkMode ? 'bg-orange-900/30' : 'bg-orange-100'
                    } else if (test.includes('.to.eql(')) {
                      testType = 'json'
                      typeColor = darkMode ? 'text-purple-400' : 'text-purple-600'
                      typeLabel = 'JSON'
                      bgColor = darkMode ? 'bg-purple-900/30' : 'bg-purple-100'
                    }
                    
                    // Extraer nombre del test
                    const testNameMatch = test.match(/pm\.test\("([^"]+)"/,)
                    const testName = testNameMatch ? testNameMatch[1] : `Test #${index + 1}`
                    
                    return (
                      <div
                        key={index}
                        className={`flex items-start justify-between p-3 rounded-xl transition-all duration-300 ${darkMode ? 'bg-slate-700/50 border border-slate-600' : 'bg-slate-50 border border-slate-200'}`}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${darkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-medium truncate ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                {testName}
                              </p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${bgColor} ${typeColor}`}>
                                {typeLabel}
                              </span>
                            </div>
                            <p className={`text-xs font-mono mt-1 truncate ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                              {test.split('\n').slice(1, -1).join(' ').trim()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveTest(index)}
                          className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 flex-shrink-0 ml-2 ${darkMode ? 'text-rose-400 hover:bg-rose-900/30' : 'text-rose-500 hover:bg-rose-50'}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Código generado total */}
              {requestData.tests.length > 0 && (
                <div className="relative">
                  <h3 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Código JavaScript Completo
                  </h3>
                  <pre className={`w-full p-4 rounded-xl text-xs font-mono overflow-x-auto ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-900 border-slate-800 text-slate-300'} border`}>
                    <code>{requestData.tests.join('\n\n')}</code>
                  </pre>
                  <div className={`absolute top-8 right-4 px-2 py-1 rounded text-xs ${darkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                    JavaScript
                  </div>
                </div>
              )}

              {requestData.tests.length === 0 && !generatedCode && (
                <div className={`text-center py-8 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  <Zap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No hay tests agregados</p>
                  <p className="text-xs mt-1">Selecciona un tipo de test y configúralo arriba</p>
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
