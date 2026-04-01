import React, { useState } from 'react'
import { Book, Home, ChevronRight, Moon, Sun } from 'lucide-react'

const DocumentationViewer = () => {
  const [darkMode, setDarkMode] = useState(true)

  return (
    <div className={`h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b shadow-lg ${darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 border-slate-200'}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600`}>
              <Book className="w-6 h-6 text-white" />
            </div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Documentación</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <a
              href="/collection_integration/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${darkMode ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              <Home className="w-4 h-4" />
              <span>Volver al Editor</span>
            </a>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-[72px] overflow-hidden">
        {/* Sidebar */}
        <div className={`w-64 flex-shrink-0 border-r overflow-y-auto ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="p-6">
            <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Contenido</h2>
            <nav className="space-y-2">
              <a href="#introduccion" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100'}`}>
                <ChevronRight className="w-4 h-4" />
                Introducción
              </a>
              <a href="#funcionalidades" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100'}`}>
                <ChevronRight className="w-4 h-4" />
                Funcionalidades
              </a>
              <a href="#interfaz" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100'}`}>
                <ChevronRight className="w-4 h-4" />
                Interfaz
              </a>
              <a href="#urls" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100'}`}>
                <ChevronRight className="w-4 h-4" />
                Gestión de URLs
              </a>
              <a href="#requests" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100'}`}>
                <ChevronRight className="w-4 h-4" />
                Requests
              </a>
              <a href="#variables" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100'}`}>
                <ChevronRight className="w-4 h-4" />
                Variables
              </a>
              <a href="#import" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100'}`}>
                <ChevronRight className="w-4 h-4" />
                Import/Export
              </a>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <section id="introduccion" className={`rounded-2xl shadow-lg border p-8 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Introducción</h2>
              <p className={`leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Postman Collection Builder es una herramienta visual para crear y gestionar colecciones de Postman
                de manera sencilla y rápida, sin necesidad de usar la interfaz nativa de Postman.
              </p>
              <div className={`mt-6 p-4 rounded-xl border ${darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
                <p className={`${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                  <strong>Ideal para:</strong> Equipos que trabajan con APIs y necesitan una forma estructurada
                  de gestionar sus requests y entornos.
                </p>
              </div>
            </section>

            <section id="funcionalidades" className={`rounded-2xl shadow-lg border p-8 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Funcionalidades Principales</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-emerald-900/30 border-emerald-700' : 'bg-emerald-50 border-emerald-200'}`}>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-800'}`}>Requests</h3>
                  <p className={`text-sm ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                    Crear y editar requests con método, URL, headers y body.
                  </p>
                </div>
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-amber-900/30 border-amber-700' : 'bg-amber-50 border-amber-200'}`}>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-amber-400' : 'text-amber-800'}`}>URLs Base</h3>
                  <p className={`text-sm ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Gestionar URLs para LOCAL, DEV y PROD fácilmente.
                  </p>
                </div>
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>Variables</h3>
                  <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    Extraer valores de respuestas JSON y reutilizarlos.
                  </p>
                </div>
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 border-purple-200'}`}>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-purple-400' : 'text-purple-800'}`}>Tests</h3>
                  <p className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                    Tests automáticos: status code, JSON path, array length.
                  </p>
                </div>
              </div>
            </section>

            <section id="interfaz" className={`rounded-2xl shadow-lg border p-8 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Interfaz</h2>
              <div className="space-y-4">
                <div className={`flex items-start gap-4 p-4 rounded-xl ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                    Header
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Header Superior</h3>
                    <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Nombre de colección, gestor de URLs, selector de entorno, botones de Import/Export y toggle de dark mode.
                    </p>
                  </div>
                </div>
                <div className={`flex items-start gap-4 p-4 rounded-xl ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold">
                    Sidebar
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Sidebar Izquierda</h3>
                    <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Use cases y requests. Permite agregar, eliminar y seleccionar.
                    </p>
                  </div>
                </div>
                <div className={`flex items-start gap-4 p-4 rounded-xl ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold">
                    Editor
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Editor (Derecha)</h3>
                    <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Configuración de requests: método, URL, headers, body, tests y variables.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="urls" className={`rounded-2xl shadow-lg border p-8 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Gestión de URLs</h2>
              <div className="space-y-4">
                <div className={`p-4 rounded-xl border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Agregar URL</h3>
                  <ol className={`list-decimal list-inside space-y-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    <li>Click en <code className={`px-1.5 py-0.5 rounded font-mono text-xs ${darkMode ? 'bg-slate-700 text-cyan-300' : 'bg-slate-100'}`}>URLs (X)</code> en header</li>
                    <li>Click en "Agregar URL"</li>
                    <li>Completar nombre y valores LOCAL, DEV, PROD</li>
                  </ol>
                </div>
                <div className={`p-4 rounded-xl border ${darkMode ? 'border-slate-700 bg-slate-700/50' : 'border-slate-200 bg-slate-50'}`}>
                  <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Formato de URL</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className={`p-3 rounded-lg border ${darkMode ? 'bg-emerald-900/30 border-emerald-700' : 'bg-emerald-50 border-emerald-200'}`}>
                      <span className={`text-xs font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>LOCAL</span>
                      <p className={`text-sm mt-1 font-mono ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>http://localhost:PUERTO</p>
                    </div>
                    <div className={`p-3 rounded-lg border ${darkMode ? 'bg-amber-900/30 border-amber-700' : 'bg-amber-50 border-amber-200'}`}>
                      <span className={`text-xs font-bold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>DEV</span>
                      <p className={`text-sm mt-1 font-mono ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>http://dev.tuservicio.com</p>
                    </div>
                    <div className={`p-3 rounded-lg border ${darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
                      <span className={`text-xs font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>PROD</span>
                      <p className={`text-sm mt-1 font-mono ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>http://tuservicio.com</p>
                    </div>
                  </div>
                  <p className={`text-xs mt-3 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Usa en requests: <code className={`px-1.5 py-0.5 rounded font-mono ${darkMode ? 'bg-slate-700 text-cyan-300' : 'bg-slate-100'}`}>{'{{NOMBRE_URL}}'}</code>
                  </p>
                </div>
                <div className={`p-4 rounded-xl border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Usar URL en Request</h3>
                  <p className={`${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    Escribe <code className={`px-1.5 py-0.5 rounded font-mono text-xs ${darkMode ? 'bg-slate-700 text-cyan-300' : 'bg-slate-100'}`}>{'{{'}</code> en el campo URL para activar el autocomplete.
                  </p>
                </div>
              </div>
            </section>

            <section id="requests" className={`rounded-2xl shadow-lg border p-8 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Requests</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-emerald-900/30 border-emerald-700' : 'bg-emerald-50 border-emerald-200'}`}>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-800'}`}>GET</h3>
                  <p className={`text-sm ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>Obtener datos</p>
                </div>
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-amber-900/30 border-amber-700' : 'bg-amber-50 border-amber-200'}`}>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-amber-400' : 'text-amber-800'}`}>POST</h3>
                  <p className={`text-sm ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>Crear datos</p>
                </div>
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>PUT</h3>
                  <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>Actualizar datos</p>
                </div>
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-rose-900/30 border-rose-700' : 'bg-rose-50 border-rose-200'}`}>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-rose-400' : 'text-rose-800'}`}>DELETE</h3>
                  <p className={`text-sm ${darkMode ? 'text-rose-300' : 'text-rose-700'}`}>Eliminar datos</p>
                </div>
              </div>
            </section>

            <section id="variables" className={`rounded-2xl shadow-lg border p-8 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Variables</h2>
              <div className="space-y-4">
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-cyan-900/30 border-cyan-700' : 'bg-cyan-50 border-cyan-200'}`}>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-cyan-400' : 'text-cyan-800'}`}>Extraer Variable</h3>
                  <p className={`text-sm ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                    En tab "Variables", ingresa nombre y JSON path del valor a extraer del response.
                  </p>
                </div>
                <div className={`p-4 rounded-xl border ${darkMode ? 'border-slate-700 bg-slate-700/50' : 'border-slate-200 bg-slate-50'}`}>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Usar Variable</h3>
                  <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    Usa <code className={`px-1.5 py-0.5 rounded font-mono text-xs ${darkMode ? 'bg-slate-700 text-cyan-300' : 'bg-slate-100'}`}>{'{{variable}}'}</code> en cualquier campo.
                  </p>
                </div>
              </div>
            </section>

            <section id="import" className={`rounded-2xl shadow-lg border p-8 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Import/Export</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Importar</h3>
                  <ul className={`text-sm space-y-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    <li>• <strong>Colección:</strong> Archivo JSON de Postman</li>
                    <li>• <strong>URLs:</strong> Archivos environment.json</li>
                  </ul>
                </div>
                <div className={`p-4 rounded-xl border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Exportar</h3>
                  <ul className={`text-sm space-y-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    <li>• <strong>Colección:</strong> JSON para Postman</li>
                    <li>• <strong>URLs:</strong> 3 archivos (local, dev, prod)</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentationViewer