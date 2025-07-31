#!/usr/bin/env node

import { Command } from 'commander';
import { Server } from '../index.js';

const program = new Command();

program
  .name('yurba-mock')
  .description('Mock server for api.yurba.one')
  .option('--port <number>', 'Port to run the server on', '3000')
  .parse(process.argv);

const opts = program.opts();

const mockserver = new Server({ port: Number(opts.port) });

mockserver.start();
