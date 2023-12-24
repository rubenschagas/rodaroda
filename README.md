# RODARODA - SIMPLY A CRUD POC

Screenshot:
![](./assets/readMeMd/env.png)

## TABLE OF CONTENTS

[OVERVIEW](#overview)

[PREREQUISITES](#prerequisites)

[USE CASES](#use-cases)

[SENDING DATA TO THE DATABASE THROUGH THE BACKEND SERVICE](#sending-data-to-the-database-through-the-backend-service)

[REFERENCES](#references)

## OVERVIEW

The objective of this README.md document file is to provide help on how to run the automated deployment of a [local] CRUD project, as a Proof of Concept (POC), running a backend service.

The purpose of this app is to build a basic structure for a backend application, along with an automated database, where, upon sending requests to the backend, we can query and insert data into it.

The master carrier's structure revolves around trips, with dependencies on entities such as location (origin and destination types), product, and carrier.

## PREREQUISITES

1. docker: 24.0.7;

2. docker compose: 2.17.2;

3. a postgres dbms server and populate the database project structure, running the ansible playbook rodaroda.yml,
`ansible-playbook -vv -e "ansible_user=ansible" rodaroda.yml`
from the project:
https://github.com/rubenschagas/ansibleAutomatedPlaybooks

4. a postgres dbms client, like DBeaver: >=23.x (optional);

5. npm: ^8.11.0;

6. node: ^16.16.0.


On the rodaroda project folder, open a terminal and run the following command:

```
npm install
```

## USE CASES

Start the server:

Make sure the Node.js server is running. 

You can start the server by executing the following command in the terminal within the project directory:

```
node index.js
```

## SENDING DATA TO THE DATABASE THROUGH THE BACKEND SERVICE

It is possible to send requests through Postman to test the CRUD endpoints created in the previous example. 

Here are some steps to test the GET and POST endpoints for the `localidade` entity:

Open the Postman application.

Import the collection file available at assets/collections folder.

Open the `Consulta de Produtos` request.

---

Send a GET request to list localities:

Select the GET method.

Enter the URL: http://localhost:3000/localidades

Click "Send" to submit the request.

---

Send a POST request to create a locality:

Select the POST method.

Enter the URL: http://localhost:3000/localidades

Go to the "Body" tab and select the raw format.

Insert the locality data in the request body, json, for example:

```
{
"nome": "Localidade Teste",
"tipo": "origem"
}
```

Click "Send" to submit the request.

---

## REFERENCES

#### [Official Docker Daemon Documentation Install](https://docs.docker.com/engine/install/ubuntu/)

#### [Official Docker Compose Documentation Install](https://docs.docker.com/compose/install/linux/#install-the-plugin-manually)

#### [Official Ansible Documentation Install](https://docs.ansible.com/ansible/2.9/installation_guide/intro_installation.html#installing-ansible-on-ubuntu)
