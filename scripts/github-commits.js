import { readJSON, writeJSON } from 'https://deno.land/x/flat/mod.ts';

// The filename is the first invocation argument
const filename = Deno.args[0];
const data = await readJSON(filename);

const cleanData = {
    'PushEvent': [],
    'CreateEvent': [],
    'WatchEvent': []
};

data.forEach(ghEvent => {
    if (cleanData[ghEvent.type]) {
        const cleanEvent = {};
        cleanEvent.id = ghEvent.id;
        cleanEvent.repoName = ghEvent.repo.name;
        cleanEvent.repoUrl = ghEvent.repo.url;
        cleanEvent.payload = {};
        if (ghEvent.type === 'PushEvent') {
            cleanEvent.payload.ref = ghEvent.payload.ref;
            cleanEvent.payload.head = ghEvent.payload.head;
        } else if (ghEvent.type === 'WatchEvent') {
            cleanEvent.payload.action = ghEvent.payload.action;
        }


        const cleanEventName = `Clean${ghEvent.type}`;
        if (cleanData[cleanEventName] === undefined) {
            cleanData[cleanEventName] = [];
        }

        cleanData[ghEvent.type].push(ghEvent);
        cleanData[cleanEventName].push(cleanEvent);
    }
});

await writeJSON('recent_github_activity.json', cleanData);
