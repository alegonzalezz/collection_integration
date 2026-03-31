import { useState, useEffect, useCallback, useRef } from 'react'
import { Variable, Search, X, Link } from 'lucide-react'

const VariableAutocomplete = ({ value, onChange, variables, urls, darkMode, placeholder, isTextarea = false, rows = 4, onEditUrl }) => {
  const [showPopup, setShowPopup] = useState(false)
  const [filter, setFilter] = useState('')
  const inputRef = useRef(null)
  const lastFocusedElement = useRef(null)
  const filterInputRef = useRef(null)
  const savedCursorPosition = useRef(null)

  const urlVariables = (urls || []).map(url => ({
    name: url.name,
    jsonPath: url.name,
    requestName: 'URL',
    isUrl: true,
    urlData: url
  }))

  const allVariables = [...variables, ...urlVariables]

  const getCursorPosition = useCallback(() => {
    return inputRef.current?.selectionStart || savedCursorPosition.current || 0
  }, [])

  useEffect(() => {
    if (!value) {
      setShowPopup(false)
      return
    }

    const cursorPos = inputRef.current?.selectionStart || 0
    const textBeforeCursor = value.substring(0, cursorPos)
    const lastDoubleBrace = textBeforeCursor.lastIndexOf('{{')

    if (lastDoubleBrace !== -1) {
      const afterBraces = textBeforeCursor.substring(lastDoubleBrace + 2)
      if (!afterBraces.includes('}')) {
        setShowPopup(true)
        lastFocusedElement.current = inputRef.current
      }
    } else {
      setShowPopup(false)
    }
  }, [value])

  useEffect(() => {
    if (showPopup && lastFocusedElement.current) {
      const cursorPos = inputRef.current?.selectionStart || savedCursorPosition.current || 0
      const textBeforeCursor = value.substring(0, cursorPos)
      const lastDoubleBrace = textBeforeCursor.lastIndexOf('{{')
      if (lastDoubleBrace !== -1) {
        const afterBraces = textBeforeCursor.substring(lastDoubleBrace + 2)
        setFilter(afterBraces)
      }
    }
  }, [showPopup, value])

  const filteredVariables = allVariables.filter(v =>
    v.name.toLowerCase().includes(filter.toLowerCase())
  )

  const handleChange = (e) => {
    onChange(e.target.value)
  }

  const handleSelectVariable = (variableName) => {
    const cursorPos = savedCursorPosition.current || inputRef.current?.selectionStart || 0
    const textBeforeCursor = value.substring(0, cursorPos)
    const lastDoubleBrace = textBeforeCursor.lastIndexOf('{{')
    
    if (lastDoubleBrace !== -1) {
      const textBefore = value.substring(0, lastDoubleBrace)
      const textAfter = value.substring(cursorPos)
      const newValue = `${textBefore}{{${variableName}}}${textAfter}`
      onChange(newValue)
    }
    
    setShowPopup(false)
    setFilter('')
    savedCursorPosition.current = null
  }

  const handleClose = () => {
    setShowPopup(false)
    setFilter('')
    savedCursorPosition.current = null
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 50)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && showPopup) {
      handleClose()
    }
  }

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (showPopup && e.key === 'Escape') {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [showPopup])

  const inputClassName = `w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all duration-300 font-mono ${darkMode ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500 border'}`

  return (
    <div className="relative flex-1">
      {isTextarea ? (
        <textarea
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={rows}
          className={`${inputClassName} resize-none h-auto`}
        />
      ) : (
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={inputClassName}
        />
      )}
      
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={handleClose}>
          <div 
            className={`w-full max-w-md mx-4 rounded-2xl shadow-2xl border overflow-hidden ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-slate-600' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2">
                <Variable className={`w-5 h-5 ${darkMode ? 'text-cyan-400' : 'text-cyan-500'}`} />
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  Insertar Variable
                </h3>
              </div>
              <button
                onClick={handleClose}
                className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`} />
                <input
                  ref={filterInputRef}
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Filtrar variables..."
                  className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg focus:outline-none ${darkMode ? 'bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500' : 'bg-slate-100 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-cyan-500'}`}
                  autoFocus
                />
              </div>
            </div>
            
            <div className={`max-h-80 overflow-y-auto ${darkMode ? 'bg-slate-700/30' : 'bg-slate-50'}`}>
              {filteredVariables.length > 0 ? (
                <div className="p-2">
                  {filteredVariables.map((variable, index) => (
                    <div key={index} className="mb-1">
                      {variable.isUrl ? (
                        <button
                          onClick={() => handleSelectVariable(variable.name)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
                        >
                          <Link className={`w-4 h-4 flex-shrink-0 ${darkMode ? 'text-amber-400' : 'text-amber-500'}`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                              {variable.name}
                            </p>
                            <p className={`text-xs truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                              URL
                            </p>
                          </div>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSelectVariable(variable.name)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
                        >
                          <Variable className={`w-4 h-4 flex-shrink-0 ${darkMode ? 'text-cyan-400' : 'text-cyan-500'}`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                              {variable.name}
                            </p>
                            <p className={`text-xs truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                              {variable.jsonPath} • {variable.requestName}
                            </p>
                          </div>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    No hay variables que coincidan con "{filter}"
                  </p>
                </div>
              )}
            </div>
            
            <div className={`p-3 border-t text-center ${darkMode ? 'border-slate-600 bg-slate-700/30' : 'border-slate-200 bg-slate-50'}`}>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Presiona <kbd className={`px-1.5 py-0.5 rounded text-xs font-mono ${darkMode ? 'bg-slate-600 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>Esc</kbd> para cerrar
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VariableAutocomplete