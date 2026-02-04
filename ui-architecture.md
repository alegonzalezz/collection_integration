# Arquitectura de Interfaz - Postman Builder (React)

## 1. Estructura de Componentes
- <App />: Contenedor principal. Maneja el estado global.
- <Sidebar />: Panel izquierdo (ancho fijo ~300px).
    - <UseCaseList />: Mapea los Casos de Uso.
    - <RequestItem />: Item colapsable dentro del Caso de Uso.
- <MainEditor />: Panel derecho. Formulario dinámico.
    - <RequestHeader />: Input de Nombre y Selector de Método (GET, POST, etc).
    - <UrlBar />: Input para la URL y Query Params.
    - <ConfigTabs />: Tabs para (Headers, Body, Tests).

## 2. Estilos (Tailwind CSS)
- Sidebar: `bg-slate-900 text-white h-screen overflow-y-auto`
- Editor: `bg-white p-6 h-screen overflow-y-auto`
- Inputs: `border border-gray-300 rounded px-2 py-1 focus:ring-2`
- Badge Métodos:
    - GET: `text-green-500`
    - POST: `text-yellow-500`
    - DELETE: `text-red-500`

## 3. Comportamiento del Sidebar
- Los Casos de Uso deben ser acordeones.
- Al hacer clic en una Request, el estado `selectedRequestId` cambia y el <MainEditor /> carga sus datos.
