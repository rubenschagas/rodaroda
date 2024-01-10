// noinspection JSStringConcatenationToES6Template,SpellCheckingInspection

//exporting the data base configs
const dataBase = require('./data-base-config/db-config');

//exporting the app controllers
const brazilianStatesController = require('./controllers/brazilian-states/brazilian-states-controller');
const driversController = require('./controllers/drivers/drivers-controller');
const licensePlatesController = require('./controllers/drivers/drivers-controller');
const logisticRolesController = require('./controllers/logistic-roles/logistic-roles-controller');
const productCategoriesController = require('./controllers/product-categories/product-categories-controller');
const vehicleTypesController = require('./controllers/vehicle-types/vehicle-types-controller');
const vehiclesFleetController = require('./controllers/vehicles-fleet/vehicles-fleet-controller');
const localitiesController = require('./controllers/localities/localities-controller');
const productsController = require('./controllers/products/products-controller');
const carriersController = require('./controllers/carriers/carriers-controller');
const vehiclesController = require('./controllers/vehicles/vehicles-controller');
const tripsController = require('./controllers/trips/trips-controller');

const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();

app.use(bodyParser.json());

const port = dataBase.dbAppPort;

//Configurating the db connection
const pool = new Pool(dataBase.dbConfig);

// CRUD brazilian States
app.get('/brazilian-states', brazilianStatesController.getAll);
app.get('/brazilian-states/:id', brazilianStatesController.getOne);
app.post('/brazilian-states', brazilianStatesController.postOne);
app.put('/brazilian-states/:id', brazilianStatesController.updateOne);
app.delete('/brazilian-states/:id', brazilianStatesController.deleteOne);

// CRUD drivers
app.get('/drivers', driversController.getAll);
app.get('/drivers/:id', driversController.getOne);
app.post('/drivers', driversController.postOne);
app.put('/drivers/:id', driversController.updateOne);
app.delete('/drivers/:id', driversController.deleteOne);

// CRUD license plates
app.get('/license-plates', licensePlatesController.getAll);
app.get('/license-plates/:id', licensePlatesController.getOne);
app.post('/license-plates', licensePlatesController.postOne);
app.put('/license-plates/:id', licensePlatesController.updateOne);
app.delete('/license-plates/:id', licensePlatesController.deleteOne);

// CRUD logistic roles
app.get('/logistic-roles', logisticRolesController.getAll);
app.get('/logistic-roles/:id', logisticRolesController.getOne);
app.post('/logistic-roles', logisticRolesController.postOne);
app.put('/logistic-roles/:id', logisticRolesController.updateOne);
app.delete('/logistic-roles/:id', logisticRolesController.deleteOne);

// CRUD product categories
app.get('/product-categories', productCategoriesController.getAll);
app.get('/product-categories/:id', productCategoriesController.getOne);
app.post('/product-categories', productCategoriesController.postOne);
app.put('/product-categories/:id', productCategoriesController.updateOne);
app.delete('/product-categories/:id', productCategoriesController.deleteOne);

// CRUD vehicle types
app.get('/vehicle-types', vehicleTypesController.getAll);
app.get('/vehicle-types/:id', vehicleTypesController.getOne);
app.post('/vehicle-types', vehicleTypesController.postOne);
app.put('/vehicle-types/:id', vehicleTypesController.updateOne);
app.delete('/vehicle-types/:id', vehicleTypesController.deleteOne);

// CRUD vehicles fleet
app.get('/vehicles-fleet', vehiclesFleetController.getAll);
app.get('/vehicles-fleet/:id', vehiclesFleetController.getOne);
app.post('/vehicles-fleet', vehiclesFleetController.postOne);
app.put('/vehicles-fleet/:id', vehiclesFleetController.updateOne);
app.delete('/vehicles-fleet/:id', vehiclesFleetController.deleteOne);

// CRUD localities
app.get('/localities', localitiesController.getAll);
app.get('/localities/:id', localitiesController.getOne);
app.post('/localities', localitiesController.postOne);
app.put('/localities/:id', localitiesController.updateOne);
app.delete('/localities/:id', localitiesController.deleteOne);

// CRUD products
app.get('/products', productsController.getAll);
app.get('/products/:id', productsController.getOne);
app.post('/products', productsController.postOne);
app.put('/products/:id', productsController.updateOne);
app.delete('/products/:id', productsController.deleteOne);

// CRUD carriers
app.get('/carriers', carriersController.getAll);
app.get('/carriers/:id', carriersController.getOne);
app.post('/carriers', carriersController.postOne);
app.put('/carriers/:id', carriersController.updateOne);
app.delete('/carriers/:id', carriersController.deleteOne);

// CRUD vehicles
app.get('/vehicles', vehiclesController.getAll);
app.get('/vehicles/:id', vehiclesController.getOne);
app.post('/vehicles', vehiclesController.postOne);
app.put('/vehicles/:id', vehiclesController.updateOne);
app.delete('/vehicles/:id', vehiclesController.deleteOne);

// CRUD trips
app.get('/trips', tripsController.getAll);
app.get('/trips/:id', tripsController.getOne);
app.post('/trips', tripsController.postOne);
app.put('/trips/:id', tripsController.updateOne);
app.delete('/trips/:id', tripsController.deleteOne);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
