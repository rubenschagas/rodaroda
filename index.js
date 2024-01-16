// noinspection JSStringConcatenationToES6Template,SpellCheckingInspection

//exporting the data base configs
const dataBase = require('./data-base-config/db-config');

//exporting the app controllers
const brazilianStatesController = require('./controllers/brazilian-states/brazilian-states-controller');
const driversController = require('./controllers/drivers/drivers-controller');
const licensePlatesController = require('./controllers/license-plates/license-plates-controller');
const logisticRolesController = require('./controllers/logistic-roles/logistic-roles-controller');
const productCategoriesController = require('./controllers/product-categories/product-categories-controller');
const vehicleTypesController = require('./controllers/vehicle-types/vehicle-types-controller');
const vehiclesFleetController = require('./controllers/vehicles-fleet/vehicles-fleet-controller');
const localitiesController = require('./controllers/localities/localities-controller');
const productsController = require('./controllers/products/products-controller'// CRUD logistic roles
56
 
app.get('/logistic-roles', logisticRolesController.getAll);
57
 
app.get('/logistic-roles/:id', logisticRolesController.getOne);
58
 
app.post('/logistic-roles', logisticRolesController.postOne);
59
 
app.put('/logistic-roles/:id', logisticRolesController.updateOne);
60
 
app.delete('/logistic-roles/:id', logisticRolesController.deleteOne);
61
 
​
62
 
// CRUD product categories
63
 
app.get('/product-categories', productCategoriesController.getAll);
64
 
app.get('/product-categories/:id', productCategoriesController.getOne);
65
 
app.post('/product-categories', productCategoriesController.postOne);
66
 
app.put('/product-categories/:id', productCategoriesController.updateOne);
67
 
app.delete('/product-categories/:id', productCategoriesController.deleteOne);
68
 
​
69
 
// CRUD vehicle types
70
 
app.get('/vehicle-types', vehicleTypesController.getAll);
71
 
app.get('/vehicle-types/:id', vehicleTypesController.getOne);
72
 
app.post('/vehicle-types', vehicleTypesController.postOne);
73
 
app.put('/vehicle-types/:id', vehicleTypesController.updateOne);
74
 
app.delete('/vehicle-types/:id', vehicleTypesController.deleteOne);
75
 
​
76
 
// CRUD vehicles fleet
77
 
app.get('/vehicles-fleet', vehiclesFleetController.getAll);
78
 
app.get('/vehicles-fleet/:id', vehiclesFleetController.getOne);
79
 
app.post('/vehicles-fleet', vehiclesFleetController.postOne);
80
 
app.put('/vehicles-fleet/:id', vehiclesFleetController.updateOne);
81
 
app.delete('/vehicles-fleet/:id', vehiclesFleetController.deleteOne);
82
 
​
83
 
// CRUD localities
84
 
app.get('/localities', localitiesController.getAll);
85
 
app.get('/localities/:id', localitiesController.getOne);
86
 
app.post('/localities', localitiesController.postOne);
87
 
app.put('/localities/:id', localitiesController.updateOne);
88
 
app.delete('/localities/:id', localitiesController.deleteOne);
89
 
​
90
 
// CRUD products
91
 
app.get('/products', productsController.getAll);
92
 
app.get('/products/:id', productsController.getOne);
93
 
app.post('/products', productsController.postOne);
94
 
app.put('/products/:id', productsController.updateOne);
95
 
app.delete('/products/:id', productsController.deleteOne);
96
 
​
97
 
// CRUD carriers
98
 
app.get('/carriers', carriersController.getAll);
99
 
app.get('/carriers/:id', carriersController.getOne);
100
 
app.post('/carriers', carriersController.postOne);
101
 
app.put('/carriers/:id', carriersController.updateOne);
102
 
app.delete('/carriers/:id', carriersController.deleteOne);
103
 
​
104
 
// CRUD vehicles
105
 
app.get('/vehicles', vehiclesController.getAll);
106
 
app.get('/vehicles/:id', vehiclesController.getOne);
107
 
app.post('/vehicles', vehiclesController.postOne);
108
 
app.put('/vehicles/:id', vehiclesController.updateOne);
109
 
app.delete('/vehicles/:id', vehiclesController.deleteOne);
110
 
​
111
 
// CRUD trips
112
 
app.get('/trips', tripsController.getAll);
113
 
app.get('/trips/:id', tripsController.getOne);
114
 
app.post('/trips', tripsController.postOne);
115
 
app.put('/trips/:id', tripsController.updateOne);
116
 
app.delete('/trips/:id', tripsController.deleteOne);
117
 
=======
118
 
// Configuração do pool de conexão com o PostgreSQL
119
 
const pool = new Pool({
120
 
  host: databaseHostname,
121
 
  port: databasePort,
122
 
  database: databaseName,
123
 
  user: databaseUsername,
124
 
  password: databasePassword,
125
 
});
126
 
​
127
 
// CRUD para localidade
128
 
app.get('/localities', async (req, res) => {
129
 
  const result = await pool.query('SELECT * FROM locality');
130
 
  if (result.rows.length === 0) {
131
 
    return res.status(404).json({ error: 'Cannot find localities.' });
132
 
  }
133
 
  res.json(result.rows);
134
 
});
135
 
​
136
 
app.post('/localities', async (req, res) => {
137
 
  const request = req.body;
138
 
  const errors = [];
139
 
​
140
 
  if(request.length > 1){
141
 
    for(const register of request){
142
 
      if(!register.name || !register.type){
143
 
          errors.push({ error: 'Failed to register locality.'});
144
 
      }
145
 
    }
146
 
    if(errors.length > 0){
147
 
      return res.status(400).json(errors););
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
