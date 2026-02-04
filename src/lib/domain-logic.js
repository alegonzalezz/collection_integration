/**
 * LÓGICA DE NEGOCIO - GENERADOR DE COLECCIONES POSTMAN
 * Estructura de Datos y Transformaciones
 */

const emptyCollection = {
  info: {
    name: "Nueva Coleccion",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  item: []
};

const createUseCase = (name) => ({
  name: name,
  item: [],
  protocolProfileBehavior: {}
});

const createRequest = (name, method = "GET", url = "") => {
  const timestamp = Date.now()
  const randomSuffix = Math.floor(Math.random() * 1000)
  const uniqueName = name ? `${name} ${timestamp}` : `New Request ${timestamp}`
  
  return {
    name: uniqueName,
    request: {
      method: method,
      header: [],
      url: { raw: url, host: [url] },
      body: { mode: "raw", raw: "" }
    },
    event: [
      {
        listen: "test",
        script: {
          exec: [],
          type: "text/javascript"
        }
      }
    ]
  }
}

const exportCollection = (data) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  return URL.createObjectURL(blob);
};

export { emptyCollection, createUseCase, createRequest, exportCollection };
