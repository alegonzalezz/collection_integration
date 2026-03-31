import React from 'react'

const DocumentationViewer = () => {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="backdrop-blur-lg px-6 py-4 flex items-center justify-between shadow-lg transition-all duration-300 bg-white/90 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-500 to-indigo-600">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-slate-800">Documentation</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.href = '/collection_integration/'}
            className="p-2.5 rounded-xl transition-all duration-300 hover:scale-105 bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            <Sun className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Content from Documentation/README.md would go here */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Postman Collection Builder - Documentación</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4 text-slate-800">Introducción</h3>
                <p className="text-slate-600 leading-relaxed">
                  Aplicación React para crear y gestionar colecciones de Postman visualmente.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4 text-slate-800">Características Principales</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600">
                  <li>Crear y editar requests con método, URL, headers y body</li>
                  <li>Gestionar variables globales extraídas de respuestas</li>
                  <li>Definir URLs base para diferentes entornos (LOCAL, DEV, PROD)</li>
                  <li>Importar/exportar colecciones y entornos</li>
                  <li>Soporte para tests automáticos (status code, JSON path, array length)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4 text-slate-800">Estructura de la Interfaz</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-slate-800">Header</h4>
                    <p className="text-slate-600">
                      Contiene: nombre de la colección (editable), gestor de URLs, selector de entorno (LOCAL/DEV/PROD), 
                      botones de Import/Export y toggle de dark mode.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-slate-800">Sidebar (Izquierda)</h4>
                    <p className="text-slate-600">
                      Muestra la estructura de la colección: use cases (agrupadores) y requests dentro de cada use case.
                      Permite agregar use cases, agregar requests y eliminar requests.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-slate-800">Editor (Derecha)</h4>
                    <p className="text-slate-600">
                      Se abre al seleccionar un request y contiene barra de método/URL, nombre editable y tabs para:
                      Headers, Body, Tests y Variables.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4 text-slate-800">Gestión de URLs</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-slate-800">Agregar una URL</h4>
                    <ol className="list-decimal list-inside space-y-2 text-slate-600">
                      <li>Hacer clic en "URLs (X)" en el header</li>
                      <li>Click en "Agregar URL"</li>
                      <li>Ingresar nombre (se guarda en mayúsculas con guiones bajos)</li>
                      <li>Completar valores para cada entorno: LOCAL, DEV y PROD</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-slate-800">Usar una URL en un Request</h4>
                    <ol className="list-decimal list-inside space-y-2 text-slate-600">
                      <li>En el campo URL del editor, escribir <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-xs">{'{{'}</code></li>
                      <li>Aparece el autocomplete con las URLs disponibles</li>
                      <li>Seleccionar la URL deseada</li>
                      <li>Se insertará la variable como <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-xs">{'{{NOMBRE_URL}}'}</code></li>
                    </ol>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium mb-1 text-slate-800">Usar una Variable:</h5>
                    <p className="text-slate-600">
                      En cualquier campo (URL, headers, body), usar <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-xs">{'{{nombreVariable}}'}</code>
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4 text-slate-800">Gestión de Requests</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-slate-800">Crear un Request</h4>
                    <ol className="list-decimal list-inside space-y-2 text-slate-600">
                      <li>Seleccionar un Use Case en la sidebar</li>
                      <li>Click en "+" junto al nombre del Use Case</li>
                      <li>Se crea un request con nombre por defecto</li>
                      <li>El editor se abre automáticamente</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-slate-800">Editar un Request</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium mb-1 text-slate-800">Método:</h5>
                        <p className="text-slate-600">Seleccionar de la lista (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-1 text-slate-800">URL:</h5>
                        <p className="text-slate-600">Escribir la URL o usar variables {{variable}}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-1 text-slate-800">Nombre:</h5>
                        <p className="text-slate-600">Editable en el campo correspondiente</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-1 text-slate-800">Headers:</h5>
                        <p className="text-slate-600">Agregar/editar/remover cabeceras</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-1 text-slate-800">Body:</h5>
                        <p className="text-slate-600">Elegir tipo (Raw o GraphQL) y completar</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-slate-800">Tests</h4>
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium mb-1 text-slate-800">Tipos de Tests Disponibles:</h5>
                      <ul className="list-disc list-inside space-y-1 text-slate-600">
                        <li><strong>Status Code:</strong> Valida que la respuesta tenga un código HTTP específico (ej: pm.response.to.have.status(200))</li>
                        <li><strong>JSON Path:</strong> Valida un valor específico en el JSON de respuesta (ej: pm.expect(jsonData.name).to.eql('John'))</li>
                        <li><strong>Array Length:</strong> Valida la cantidad de elementos en un array (ej: pm.expect(jsonData.users.length).to.eql(5))</li>
                      </ul>
                      
                      <h5 className="text-sm font-medium mb-1 text-slate-800 mt-4">Agregar un Test:</h5>
                      <ol className="list-decimal list-inside space-y-2 text-slate-600">
                        <li>Seleccionar el tipo de test</li>
                        <li>Ingresar nombre del test</li>
                        <li>Completar los campos específicos (status code, json path, etc.)</li>
                        <li>Click en "Agregar Test"</li>
                      </ol>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-slate-800">Variables</h4>
                    <p className="text-slate-600 mb-2">
                      Permite extraer valores del JSON de respuesta y guardarlos en variables globales.
                    </p>
                    
                    <h5 className="text-sm font-medium mb-1 text-slate-800">Agregar Extracción:</h5>
                    <ol className="list-decimal list-inside space-y-2 text-slate-600">
                      <li>En la tab "Variables", ingresar:
                        <ul className="list-none pl-5 space-y-1">
                          <li><strong>Nombre de Variable:</strong> Nombre para usar después (ej: userId)</li>
                          <li><strong>JSON Path:</strong> Path del valor a extraer (ej: data.user.id)</li>
                        </ul>
                      </li>
                      <li>Click en "Agregar Extracción"</li>
                    </ol>
                    
                    <h5 className="text-sm font-medium mb-1 text-slate-800 mt-4">Usar una Variable:</h5>
                    <p className="text-slate-600">
                      En cualquier campo (URL, headers, body), usar {{nombreVariable}}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4 text-slate-800">Importación y Exportación</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-slate-800">Importar Colección</h4>
                    <ol className="list-decimal list-inside space-y-2 text-slate-600">
                      <li>Click en "Import" en el header</li>
                      <li>Seleccionar archivo .json de Postman</li>
                      <li>La colección se carga con todos los use cases y requests</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-slate-800">Importar Entornos/URLs</h4>
                    <ol className="list-decimal list-inside space-y-2 text-slate-600">
                      <li>Click en "Import URLs" en el header</li>
                      <li>Seleccionar uno o más archivos .environment.json</li>
                      <li>Se mergean con las URLs existentes</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-slate-800">Exportar Colección</h4>
                    <ol className="list-decimal list-inside space-y-2 text-slate-600">
                      <li>Click en "Export" en el header</li>
                      <li>Se descarga nombre_coleccion.json</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-slate-800">Exportar URLs</h4>
                    <ol className="list-decimal list-inside space-y-2 text-slate-600">
                      <li>Click en "Export URLs" en el header</li>
                      <li>Se descargan 3 archivos:</li>
                      <ul className="list-disc list-inside pl-5 space-y-1 text-slate-600">
                        <li>nombre_coleccion_local.environment.json</li>
                        <li>nombre_coleccion_dev.environment.json</li>
                        <li>nombre_coleccion_prod.environment.json</li>
                      </ul>
                    </ol>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4 text-slate-800">Atajos de Teclado</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600">
                  <li><strong>Esc:</strong> Cerrar popups/modales (autocomplete, URL manager)</li>
                  <li><strong>Ctrl/Cmd + S:</strong> (Próximamente) Guardar cambios</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4 text-slate-800">Tecnologías Usadas</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600">
                  <li>React 18+ con Hooks</li>
                  <li>Tailwind CSS para estilos</li>
                  <li>Lucide React para iconos</li>
                  <li>Vite como bundler</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4 text-slate-800">Tips y Trucos</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600">
                  <li><strong>Usar variables en URLs:</strong> Define URLs base y úsalas en todos los requests para cambiar fácilmente entre entornos.</li>
                  <li><strong>Tests encadenados:</strong> Extrae variables en un request y úsalas en el siguiente para crear flujos.</li>
                  <li><strong>Dark mode:</strong> Úsalo para sesiones largas de trabajo.</li>
                  <li><strong>Autocomplete:</strong> Escribe <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-xs">{'{{'}</code> en cualquier campo para ver variables y URLs disponibles.</li>
                  <li><strong>Collapse editor:</strong> Usa la flecha izquierda en el header del editor para volver rápidamente a la sidebar.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DocumentationViewer