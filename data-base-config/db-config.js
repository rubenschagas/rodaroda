// noinspection JSStringConcatenationToES6Template,SpellCheckingInspection

const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

exports.dbAppPort = process.env.APPLICATION_PORT || '3000';
const databaseHostname = process.env.DATABASE_HOSTNAME || 'localhost';
const databasePort = process.env.DATABASE_PORT || '5432';
const databaseName = process.env.DATABASE_NAME || 'rodaroda';
const databaseUsername = process.env.DATABASE_USER || 'postgres';
const databasePassword = process.env.DATABASE_PASSWORD || 'postgres';


exports.dbConfig = {
    host: databaseHostname,
    port: databasePort,
    database: databaseName,
    user: databaseUsername,
    password: databasePassword,
}
