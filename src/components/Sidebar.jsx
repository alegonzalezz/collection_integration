import { useState, useEffect, useRef } from 'react'
import { ChevronRight, ChevronDown, Folder, Plus, FolderOpen, Sparkles, X } from 'lucide-react'
import { createRequest } from '../lib/domain-logic'

const Sidebar = ({ collection, selectedRequestId, selectedUseCaseId, onSelectRequest, onSelectUseCase, onAddUseCase, onAddRequest, onDeleteRequest, darkMode }) => {
  const [newUseCaseName, setNewUseCaseName] = useState('')
  const [expandedUseCases, setExpandedUseCases] = useState({})
  const selectedRequestRef = useRef(null)
  const selectedUseCaseRef = useRef(null)

  useEffect(() => {
    if (selectedRequestId && selectedRequestRef.current) {
      selectedRequestRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else if (selectedUseCaseId && selectedUseCaseRef.current) {
      selectedUseCaseRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [selectedRequestId, selectedUseCaseId])

  const toggleUseCase = (useCaseId) => {
    setExpandedUseCases(prev => {
      const newState = {}
      newState[useCaseId] = !prev[useCaseId]
      return newState
    })
  }

  const handleAddUseCase = () => {
    if (newUseCaseName.trim()) {
      onAddUseCase(newUseCaseName.trim())
      setNewUseCaseName('')
      setExpandedUseCases(prev => ({ ...prev, [newUseCaseName.trim()]: true }))
    }
  }

  const handleAddRequest = (useCaseId) => {
    const request = createRequest('New Request', 'GET', '')
    onAddRequest(useCaseId, request)
  }

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return { bg: 'bg-emerald-100/50', text: 'text-emerald-600', border: 'border-emerald-300' }
      case 'POST': return { bg: 'bg-amber-100/50', text: 'text-amber-600', border: 'border-amber-300' }
      case 'DELETE': return { bg: 'bg-rose-100/50', text: 'text-rose-600', border: 'border-rose-300' }
      case 'PUT': return { bg: 'bg-blue-100/50', text: 'text-blue-600', border: 'border-blue-300' }
      case 'PATCH': return { bg: 'bg-purple-100/50', text: 'text-purple-600', border: 'border-purple-300' }
      default: return { bg: 'bg-gray-100/50', text: 'text-gray-600', border: 'border-gray-300' }
    }
  }

  const getMethodDarkColor = (method) => {
    switch (method) {
      case 'GET': return { bg: 'bg-emerald-900/30', text: 'text-emerald-400', border: 'border-emerald-700' }
      case 'POST': return { bg: 'bg-amber-900/30', text: 'text-amber-400', border: 'border-amber-700' }
      case 'DELETE': return { bg: 'bg-rose-900/30', text: 'text-rose-400', border: 'border-rose-700' }
      case 'PUT': return { bg: 'bg-blue-900/30', text: 'text-blue-400', border: 'border-blue-700' }
      case 'PATCH': return { bg: 'bg-purple-900/30', text: 'text-purple-400', border: 'border-purple-700' }
      default: return { bg: 'bg-slate-700/30', text: 'text-slate-400', border: 'border-slate-600' }
    }
  }

  const colors = darkMode

  return (
    <div className={`w-72 flex flex-col h-full transition-all duration-300 ${darkMode ? 'bg-slate-800/95 border-r border-slate-700' : 'bg-white/95 border-r border-slate-200'}`}>
      <div className={`p-5 border-b transition-colors duration-300 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between mb-2">
          <h2 className={`text-sm font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>{collection.info.name}</h2>
          <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
            {collection.item.length}
          </div>
        </div>
        <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>use cases</p>
      </div>
      
      <div className={`p-4 border-b transition-all duration-300 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-slate-200'}`}>
        <div className="flex gap-2">
          <input
            type="text"
            value={newUseCaseName}
            onChange={(e) => setNewUseCaseName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddUseCase()}
            placeholder="New Use Case..."
            className={`flex-1 px-3 py-2.5 text-sm rounded-xl focus:outline-none transition-all duration-300 ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500 border shadow-sm'}`}
          />
          <button
            onClick={handleAddUseCase}
            className={`px-3 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 ${darkMode ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-900/50' : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/25'}`}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {collection.item.map((useCase, index) => {
          const isExpanded = expandedUseCases[useCase.name]
          const isSelected = selectedUseCaseId === useCase.name
          const methodColors = darkMode ? getMethodDarkColor(useCase.item[0]?.request?.method) : getMethodColor(useCase.item[0]?.request?.method)
          
          return (
            <div 
              key={useCase.name} 
              className={`border-b transition-colors duration-300 ${darkMode ? 'border-slate-700/50' : 'border-slate-100'}`}
              ref={isSelected ? selectedUseCaseRef : null}
            >
              <div
                className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-300 group hover:scale-[1.02] ${isSelected ? (darkMode ? 'bg-blue-600/20' : 'bg-blue-50') : ''}`}
                onClick={() => toggleUseCase(useCase.name)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-1.5 rounded-lg transition-all duration-300 ${isExpanded ? (darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600') : (darkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500')}`}>
                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </div>
                  {isExpanded ? (
                    <FolderOpen className={`w-4 h-4 transition-colors duration-300 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                  ) : (
                    <Folder className={`w-4 h-4 transition-colors duration-300 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  )}
                  <span className={`text-sm font-medium truncate transition-colors duration-300 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{useCase.name}</span>
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                  {useCase.item.length}
                </div>
              </div>
              
              {isExpanded && (
                <div className={`transition-all duration-300 ${darkMode ? 'bg-slate-800/50' : 'bg-slate-50/50'}`}>
                  {useCase.item.map((request) => {
                    const colors = darkMode ? getMethodDarkColor(request.request.method) : getMethodColor(request.request.method)
                    const isRequestSelected = selectedRequestId === request.name
                    
                    return (
                      <div
                        key={request.name}
                        ref={isRequestSelected ? selectedRequestRef : null}
                        className={`flex items-center gap-3 px-4 py-2.5 mx-2 my-1 rounded-xl cursor-pointer transition-all duration-300 group hover:scale-[1.01] ${isRequestSelected ? (darkMode ? 'bg-blue-600/30' : 'bg-blue-100') : 'hover:bg-white/50'}`}
                        onClick={() => {
                          onSelectRequest(request.name)
                          onSelectUseCase(useCase.name)
                        }}
                      >
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md transition-all duration-300 ${colors.bg} ${colors.text} ${colors.border} border`}>
                          {request.request.method}
                        </span>
                        <span className={`text-sm flex-1 truncate transition-colors duration-300 ${isRequestSelected ? (darkMode ? 'text-blue-400' : 'text-blue-700 font-medium') : (darkMode ? 'text-slate-300' : 'text-slate-700')}`}>{request.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteRequest(useCase.name, request.name)
                          }}
                          className={`p-1.5 rounded-lg transition-all duration-300 hover:scale-110 ${darkMode ? 'text-rose-400 hover:bg-rose-900/30' : 'text-rose-500 hover:bg-rose-50'}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  })}
                  <button
                    onClick={() => handleAddRequest(useCase.name)}
                    className={`w-full mx-2 mb-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.01] group flex items-center justify-center gap-2 ${darkMode ? 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200' : 'text-slate-500 hover:bg-white hover:text-slate-700 hover:shadow-md'}`}
                  >
                    <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                    <span>Add Request</span>
                  </button>
                </div>
              )}
            </div>
          )
        })}
        
        {collection.item.length === 0 && (
          <div className="p-8 text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 ${darkMode ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
              <Sparkles className={`w-8 h-8 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
            </div>
            <p className={`text-sm font-medium mb-1 transition-colors duration-300 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>No use cases yet</p>
            <p className={`text-xs transition-colors duration-300 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Create your first use case above</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
