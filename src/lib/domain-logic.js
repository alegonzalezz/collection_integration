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

/**
 * Genera el código JavaScript para un test de status code
 * @param {string} testName - Nombre del test
 * @param {number} statusCode - Código de status esperado
 * @returns {string} - Código JavaScript del test
 */
const generateStatusCodeTest = (testName, statusCode) => {
  return `pm.test("${testName}", function () {\n    pm.response.to.have.status(${statusCode});\n});`;
};

/**
 * Genera el código JavaScript para un test de JSON path
 * @param {string} testName - Nombre del test
 * @param {string} jsonPath - Path dentro del JSON (ej: "data.name", "users[0].id")
 * @param {string} expectedValue - Valor esperado
 * @returns {string} - Código JavaScript del test
 */
const generateJsonPathTest = (testName, jsonPath, expectedValue) => {
  // Escapar el valor esperado para que sea válido en JavaScript
  const escapedValue = typeof expectedValue === 'string' ? `"${expectedValue}"` : expectedValue;
  
  return `pm.test("${testName}", function () {\n    var jsonData = pm.response.json();\n    pm.expect(jsonData.${jsonPath}).to.eql(${escapedValue});\n});`;
};

/**
 * Genera el código JavaScript para un test de longitud de array
 * @param {string} testName - Nombre del test
 * @param {string} arrayPath - Path al array (ej: "data.users", "items")
 * @param {number} expectedLength - Cantidad esperada de elementos
 * @returns {string} - Código JavaScript del test
 */
const generateArrayLengthTest = (testName, arrayPath, expectedLength) => {
  return `pm.test("${testName}", function () {\n    var jsonData = pm.response.json();\n    pm.expect(jsonData.${arrayPath}.length).to.eql(${expectedLength});\n});`;
};

/**
 * Agrega un test a una request existente
 * @param {Object} request - La request a la que agregar el test
 * @param {string} testName - Nombre del test
 * @param {number} statusCode - Código de status esperado
 * @returns {Object} - Request actualizada con el nuevo test
 */
const addTestToRequest = (request, testName, statusCode) => {
  const testCode = generateStatusCodeTest(testName, statusCode);
  
  // Obtener tests existentes o crear array vacío
  const existingTests = request.event?.[0]?.script?.exec || [];
  
  // Agregar el nuevo test
  const updatedTests = [...existingTests, testCode];
  
  return {
    ...request,
    event: [
      {
        listen: "test",
        script: {
          exec: updatedTests,
          type: "text/javascript"
        }
      }
    ]
  };
};

/**
 * Elimina un test de una request por su índice
 * @param {Object} request - La request de la que eliminar el test
 * @param {number} testIndex - Índice del test a eliminar
 * @returns {Object} - Request actualizada sin el test
 */
const removeTestFromRequest = (request, testIndex) => {
  const existingTests = request.event?.[0]?.script?.exec || [];
  const updatedTests = existingTests.filter((_, index) => index !== testIndex);
  
  return {
    ...request,
    event: [
      {
        listen: "test",
        script: {
          exec: updatedTests,
          type: "text/javascript"
        }
      }
    ]
  };
};

/**
 * Importa una collection de Postman desde un archivo JSON
 * @param {Object} jsonData - El objeto JSON parseado de la collection
 * @returns {Object} - Collection estructurada para la aplicación
 */
const importCollection = (jsonData) => {
  // Validar estructura básica
  if (!jsonData || typeof jsonData !== 'object') {
    throw new Error('Invalid JSON format');
  }

  // Crear estructura base
  const collection = {
    info: {
      name: jsonData.info?.name || 'Imported Collection',
      schema: jsonData.info?.schema || 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
    },
    item: []
  };

  // Procesar items (casos de uso o requests directos)
  if (Array.isArray(jsonData.item)) {
    jsonData.item.forEach(item => {
      // Si tiene propiedad 'item', es un folder/caso de uso
      if (item.item && Array.isArray(item.item)) {
        const useCase = {
          name: item.name || 'Unnamed Folder',
          item: [],
          protocolProfileBehavior: item.protocolProfileBehavior || {}
        };

        // Procesar requests dentro del folder
        item.item.forEach(subItem => {
          if (subItem.request) {
            const request = parseRequest(subItem);
            useCase.item.push(request);
          }
        });

        collection.item.push(useCase);
      } else if (item.request) {
        // Es una request directa sin folder, creamos un folder default
        let defaultFolder = collection.item.find(uc => uc.name === 'Default');
        if (!defaultFolder) {
          defaultFolder = {
            name: 'Default',
            item: [],
            protocolProfileBehavior: {}
          };
          collection.item.push(defaultFolder);
        }
        
        const request = parseRequest(item);
        defaultFolder.item.push(request);
      }
    });
  }

  return collection;
};

/**
 * Parsea una request de Postman al formato de la aplicación
 * @param {Object} item - El item de la collection
 * @returns {Object} - Request parseada
 */
const parseRequest = (item) => {
  const request = item.request;
  
  // Parsear URL
  let url = '';
  if (typeof request.url === 'string') {
    url = request.url;
  } else if (request.url && typeof request.url === 'object') {
    url = request.url.raw || request.url.host?.join('.') || '';
  }

  // Parsear headers
  const headers = Array.isArray(request.header) 
    ? request.header.map(h => ({ key: h.key || '', value: h.value || '' }))
    : [];

  // Parsear body
  let body = { mode: 'raw', raw: '' };
  if (request.body) {
    body = {
      mode: request.body.mode || 'raw',
      raw: request.body.raw || ''
    };
  }

  // Parsear eventos (tests)
  const events = [];
  if (Array.isArray(item.event)) {
    item.event.forEach(event => {
      if (event.listen === 'test' && event.script) {
        const exec = Array.isArray(event.script.exec) 
          ? event.script.exec 
          : [event.script.exec || ''];
        events.push({
          listen: 'test',
          script: {
            exec: exec,
            type: event.script.type || 'text/javascript'
          }
        });
      }
    });
  }

  // Si no hay eventos, agregar uno vacío por defecto
  if (events.length === 0) {
    events.push({
      listen: 'test',
      script: {
        exec: [],
        type: 'text/javascript'
      }
    });
  }

  return {
    name: item.name || 'Unnamed Request',
    request: {
      method: request.method || 'GET',
      header: headers,
      url: { 
        raw: url, 
        host: url ? [url] : [] 
      },
      body: body
    },
    event: events
  };
};

export { 
  emptyCollection, 
  createUseCase, 
  createRequest, 
  exportCollection,
  importCollection,
  generateStatusCodeTest,
  generateJsonPathTest,
  generateArrayLengthTest,
  addTestToRequest,
  removeTestFromRequest
};
