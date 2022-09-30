#!/usr/bin/env node
import { program } from 'commander';
import { clear, log } from 'console';
import prompts from 'prompts';
import kleur from 'kleur';
import { Environment } from './types';
import { interpret } from '.';

program
  .command('repl')
  .description('launches an interactive Read-Eval-Print loop')
  .action(async () => {
    clear();
    log('Running Lisp interperter in REPL mode');
    log('Type `exit` to stop');

    const env = Environment.CreateGlobal();

    while (true) {
      const { input } = await prompts({
        type: 'text',
        name: 'input',
        message: kleur.bold().blue('Input'),
      });

      const cleanInput = (input as string).trim();

      if (cleanInput === 'exit') break;

      try {
        const value = interpret(cleanInput, env);
        console.log(kleur.italic(value));
      } catch (err) {
        console.log(kleur.bold().red((err as Error).message));
      }
    }
  });

program
  .command('run <file>')
  .description('Runs the interpreter on a file')
  .action((file) => {
    clear();
    log('Running: %s', file);
  });

program.parse(process.argv);
