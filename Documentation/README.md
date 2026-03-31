# Postman Collection Builder - Documentación

Aplicación React para crear y gestionar colecciones de Postman visualmente.

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Estructura de la Interfaz](#estructura-de-la-interfaz)
3. [Gestión de URLs](#gestión-de-urls)
4. [Gestión de Requests](#gestión-de-requests)
5. [Variables y Tests](#variables-y-tests)
6. [Importación y Exportación](#importación-y-exportación)
7. [Atajos de Teclado](#atajos-de-teclado)

---

## Introducción

Esta herramienta permite crear colecciones de Postman de manera visual sin necesidad de usar la interfaz nativa de Postman. Ideal para equipos que trabajan con APIs y necesitan un way de gestionar sus requests de forma estructurada.

### Características Principales

- Crear y editar requests con método, URL, headers y body
- Gestionar variables globales extraídas de respuestas
- Definir URLs base para diferentes entornos (LOCAL, DEV, PROD)
- Importar/exportar colecciones y entornos
- Soporte para tests automáticos (status code, JSON path, array length)

---

## Estructura de la Interfaz

### Header

El header contiene:
- **Nombre de la colección**: Editable haciendo clic directo
- **Gestor de URLs**: Botón para configurar URLs base
- **Selector de entorno**: LOCAL / DEV / PROD para previsualizar URLs
- **Botones de Import/Export**: Para colección y URLs
- **Toggle dark mode**: Cambiar entre tema claro y oscuro

### Sidebar (Izquierda)

Muestra la estructura de la colección:
- **Use Cases**: Agrupadores de requests (carpetas lógicas)
- **Requests**: Requests individuales dentro de cada use case
- Acciones: Agregar use case, agregar request, eliminar request

### Editor (Derecha)

Se abre al seleccionar un request y contiene:
- **Barra de método y URL**: Método HTTP y endpoint
- **Nombre del request**: Editable
- **Tabs de configuración**:
  - Headers: Cabeceras HTTP
  - Body: Cuerpo de la petición (Raw/JSON o GraphQL)
  - Tests: Tests automatizados
  - Variables: Extracción de variables de respuesta

---

## Gestión de URLs

### Agregar una URL

1. Hacer clic en **"URLs (X)"** en el header
2. Click en **"Agregar URL"**
3. Ingresar nombre (se guarda en mayúsculas con guiones bajos)
4. Completar valores para cada entorno:
   - **LOCAL**: URL para desarrollo local (ej: `http://localhost:3000`)
   - **DEV**: URL para entorno de desarrollo
   - **PROD**: URL para entorno de producción

### Usar una URL en un Request

1. En el campo URL del editor, escribir `{{`
2. Aparece el autocomplete con las URLs disponibles
3. Seleccionar la URL deseada
4. Se insertará la variable como `{{NOMBRE_URL}}`

### Expandir/Contraer URLs

Cada URL en el gestor tiene un chevron (flecha) a la izquierda para expandirla y ver/editar sus valores directamente.

---

## Gestión de Requests

### Crear un Request

1. Seleccionar un Use Case en la sidebar
2. Click en **"+"** junto al nombre del Use Case
3. Se crea un request con nombre por defecto
4. El editor se abre automáticamente

### Editar un Request

- **Método**: Seleccionar de la lista (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)
- **URL**: Escribir la URL o usar variables `{{variable}}`
- **Nombre**: Editable en el campo correspondiente
- **Headers**: Agregar/editar/remover cabeceras
- **Body**: Elegir tipo (Raw o GraphQL) y completar

### Tests

#### Tipos de Tests Disponibles

1. **Status Code**: Valida que la respuesta tenga un código HTTP específico
   - Ejemplo: `pm.response.to.have.status(200)`

2. **JSON Path**: Valida un valor específico en el JSON de respuesta
   - Ejemplo: `pm.expect(jsonData.name).to.eql('John')`

3. **Array Length**: Valida la cantidad de elementos en un array
   - Ejemplo: `pm.expect(jsonData.users.length).to.eql(5)`

#### Agregar un Test

1. Seleccionar el tipo de test
2. Ingresar nombre del test
3. Completar los campos específicos (status code, json path, etc.)
4. Click en **"Agregar Test"**

### Variables

Permite extraer valores del JSON de respuesta y guardarlos en variables globales.

#### Agregar Extracción

1. En la tab **Variables**, ingresar:
   - **Nombre de Variable**: Nombre para usar después (ej: `userId`)
   - **JSON Path**: Path del valor a extraer (ej: `data.user.id`)
2. Click en **"Agregar Extracción"**

#### Usar una Variable

En cualquier campo (URL, headers, body), usar `{{nombreVariable}}`

---

## Importación y Exportación

### Importar Colección

1. Click en **"Import"** en el header
2. Seleccionar archivo `.json` de Postman
3. La colección se carga con todos los use cases y requests

### Importar Entornos/URLs

1. Click en **"Import URLs"** en el header
2. Seleccionar uno o más archivos `.environment.json`
3. Se mergean con las URLs existentes

### Exportar Colección

1. Click en **"Export"** en el header
2. Se descarga `nombre_coleccion.json`

### Exportar URLs

1. Click en **"Export URLs"** en el header
2. Se descargan 3 archivos:
   - `nombre_coleccion_local.environment.json`
   - `nombre_coleccion_dev.environment.json`
   - `nombre_coleccion_prod.environment.json`

---

## Atajos de Teclado

- **Esc**: Cerrar popups/modales (autocomplete, URL manager)
- **Ctrl/Cmd + S**: (Próximamente) Guardar cambios

---

## Tecnologías Usadas

- React 18+ con Hooks
- Tailwind CSS para estilos
- Lucide React para iconos
- Vite como bundler

---

## Estructura del Proyecto

```
src/
├── App.jsx                 # Componente principal
├── components/
│   ├── MainEditor.jsx      # Editor de requests
│   ├── Sidebar.jsx          # Sidebar con use cases/requests
│   ├── URLManager.jsx      # Gestor de URLs
│   └── VariableAutocomplete.jsx  # Autocomplete para variables
├── lib/
│   └── domain-logic.js     # Lógica de negocio
└── main.jsx                # Entry point
```

---

## Tips y Trucos

1. **Usar variables en URLs**: Define URLs base y úsalas en todos los requests para cambiar fácilmente entre entornos.

2. **Tests encadenados**: Extrae variables en un request y úsalas en el siguiente para crear flujos.

3. **Dark mode**: Úsalo para sesiones largas de trabajo.

4. **Autocomplete**: Escribe `{{` en cualquier campo para ver variables y URLs disponibles.

5. **Collapse editor**: Usa la flecha izquierda en el header del editor para volver rápidamente a la sidebar.
