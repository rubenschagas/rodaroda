// noinspection TypeScriptValidateJSTypes

import yargs from 'yargs';

export interface CliOptions {
  appp: string;
  dbh: string;
  dbp: string;
  dbn: string;
  dbu: string;
  dbw: string;
}

/**
 * A function to build an interactive command line tool, by parsing arguments and generating an elegant user interface,
 * It uses: commands and (grouped) options;
 * a dynamically generated help menu based on some arguments;
 * bash-completion shortcuts for commands and options.
 * These arguments are used through all automation scripts.
 * @link https://github.com/yargs/yargs
 * */
export function createOptions(): CliOptions {
  return yargs
    .usage(
      'Usage: ts-node rodaroda.ts [-appp 3000] [-dbh localhost] [-dbp 5432] [-dbn rodaroda] [-dbu postgres] [-dbw postgres]'
    )
    .env('RODARODACLI')
    .option('appp', {
      alias: 'p',
      describe: 'The application server port number. E.G.: 3000',
      type: 'string',
      default: '3000',
      demandOption: false,
    })
    .option('dbh', {
      alias: 'h',
      describe:
        'The database server hostname. E.G.: localhost|127.0.0.1',
      type: 'string',
      default: 'localhost',
      demandOption: false,
    })
    .option('dbp', {
      alias: 't',
      describe: 'The database server port number. E.G.: 5432',
      type: 'string',
      default: '5432',
      demandOption: false,
    })
    .option('dbn', {
      alias: 'n',
      describe:
        'The database name. E.G.: rodaroda',
      type: 'string',
      default: 'rodaroda',
      demandOption: false,
    })
    .option('dbu', {
      alias: 'u',
      describe: 'The database username. E.G.: postgres',
      type: 'string',
      default: 'postgres',
      demandOption: false,
    })
    .option('dbw', {
      alias: 'w',
      describe:
        'The database username. E.G.: p******s',
      type: 'string',
      default: 'postgres',
      demandOption: false,
    }).argv;
}
