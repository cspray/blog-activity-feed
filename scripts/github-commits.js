import { readJSON, writeJSON } from 'https://deno.land/x/flat/mod.ts';

// The filename is the first invocation argument
const filename = Deno.args[0];
const data = await readJSON(filename);

data.push({"from": "cspray script"});

await writeJSON("my_custom_events.json", data);