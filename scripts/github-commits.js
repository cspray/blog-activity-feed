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
        cleanEvent.repoName = ghEvent.repo.name;
        cleanEvent.repoUrl = ghEvent.repo.url;
        cleanData[ghEvent.type].push(ghEvent);
        cleanEventName = `Clean${ghEvent.type}`;
        if (cleanData[cleanEventName] === undefined) {
            cleanData[cleanEventName] = [];
        }
        cleanData[cleanEventName].push(cleanEvent);
    }
});

await writeJSON('recent_github_activity.json', cleanData);
