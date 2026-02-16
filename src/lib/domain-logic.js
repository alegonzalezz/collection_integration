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

export { 
  emptyCollection, 
  createUseCase, 
  createRequest, 
  exportCollection,
  generateStatusCodeTest,
  generateJsonPathTest,
  addTestToRequest,
  removeTestFromRequest
};
