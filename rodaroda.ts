// noinspection SpellCheckingInspection

import boxen, { Options } from 'boxen';
import chalk from 'chalk';
import moment from 'moment';
import { ChildProcess, exec } from 'child_process';
import { createOptions } from './cli/create-options';

const
  boxenOptions: Options = {
    padding: 1,
    margin: 1,
    borderStyle: "classic",
    borderColor: "green"
  };

// noinspection JSCheckFunctionSignatures
let taGreeting = chalk.white.bold("Running the Rodaroda API server.");
let atGreetingBox = boxen(taGreeting, boxenOptions);
let initial = moment();
let date_initial = initial.format("DD/MM/YYYY HH:mm:ss");

process.stdout.write(atGreetingBox + '\n');

const options = createOptions();

const applicationScript = "index.js";
const applicationPort = process.env.APPLICATION_PORT = options.appp;
const databaseHostname = process.env.DATABASE_HOSTNAME = options.dbh;
const databasePort = process.env.DATABASE_PORT = options.dbp;
const databaseName = process.env.DATABASE_NAME = options.dbn;
const databaseUsername = process.env.DATABASE_USER = options.dbu;
const databasePassword = process.env.DATABASE_PASSWORD = options.dbw;

try {
  process.stdout.write(`Application server script: ${applicationScript}` + '\n');
  process.stdout.write(`Server URL: http://localhost:${applicationPort}` + '\n');
  process.stdout.write(`Database server: http://${databaseHostname}:${databasePort}` + '\n');
  process.stdout.write(`Database name: ${databaseName}` + '\n');
  process.stdout.write(
    `Database credentials - Username: ${databaseUsername} / Password: ${databasePassword
      .split('')
      .map((e: string, i: number, a: string[]): string =>
        !(i < 1 || i > a.length - 2) ? '*' : e
      )
      .join('')}` + '\n'
  );

  process.stdout.write(`Execution start: ${date_initial}` + '\n');

  const command = `node ${applicationScript}`,
    env = {...process.env};

  const bigCommand: ChildProcess = exec(command, {env});

  bigCommand.on(
    'exit',
    async (code: number, signal: NodeJS.Signals): Promise<void> => {
      process.stdout.write('\n' + `Exit code: ${code}` + '\n\n');

      if (code !== null) {
        process.exit(code);
      } else {
        process.stdout.write('\n' + `Signal: ${signal}`);
        process.exit(1);
      }
    }
  );
} catch (err) {
  console.error('\nRodaroda execution failed!\nCheck connectivity.\n');
  console.error(err);
  process.exit(1);
}
