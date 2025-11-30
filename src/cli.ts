#!/usr/bin/env node

import { hello } from "./index";

function parseArgs(args: string[]): { say?: string } {
  const result: { say?: string } = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-s" || args[i] === "--say") {
      result.say = args[i + 1];
      i++;
    }
  }

  return result;
}

const args = parseArgs(process.argv.slice(2));

if (args.say) {
  console.log(args.say);
} else {
  console.log(hello());
}
