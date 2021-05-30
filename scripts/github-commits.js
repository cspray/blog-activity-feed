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
            cleanEvent.payload.branch = ghEvent.payload.ref.replace('refs/heads/', '');
            cleanEvent.payload.branchUrl =  `${cleanEvent.repoUrl}/tree/${cleanEvent.payload.branch}`;
            cleanEvent.payload.head = ghEvent.payload.head.substring(0, 7);
            cleanEvent.payload.headUrl = `${cleanEvent.repoUrl}/commit/${ghEvent.payload.head}`;

        } else if (ghEvent.type === 'WatchEvent') {
            cleanEvent.payload.action = ghEvent.payload.action;
        }

        cleanData[ghEvent.type].push(cleanEvent);
    }
});

await writeJSON('recent_github_activity.json', cleanData);
