import { readJSON, writeJSON } from 'https://deno.land/x/flat/mod.ts';

// The filename is the first invocation argument
const filename = Deno.args[0];
const data = await readJSON(filename);

const cleanData = [];

data.forEach(ghEvent => {
    if (cleanData[ghEvent.type]) {
        const cleanEvent = {};
        cleanEvent.id = ghEvent.id;
        cleanEvent.type = ghEvent.type;
        cleanEvent.createdAt = ghEvent.created_at;
        cleanEvent.payload = {};
        cleanEvent.payload.repoName = ghEvent.repo.name;
        cleanEvent.payload.repoUrl = `https://github.com/${ghEvent.repo.name}`;
        if (ghEvent.type === 'PushEvent') {
            cleanEvent.payload.branch = ghEvent.payload.ref.replace('refs/heads/', '');
            cleanEvent.payload.branchUrl =  `${cleanEvent.payload.repoUrl}/tree/${cleanEvent.payload.branch}`;
            cleanEvent.payload.head = ghEvent.payload.head.substring(0, 7);
            cleanEvent.payload.headUrl = `${cleanEvent.payload.repoUrl}/commit/${ghEvent.payload.head}`;
        } else if (ghEvent.type === 'CreateEvent') {
            cleanEvent.payload.refType = ghEvent.payload.ref_type;
            if (cleanEvent.payload.refType === 'branch') {
                cleanEvent.payload.branch = ghEvent.payload.ref;
            }
        } else if (ghEvent.type === 'WatchEvent') {
            cleanEvent.payload.action = ghEvent.payload.action;
        }

        cleanData.push(cleanEvent);
    }
});

await writeJSON('recent_github_activity.json', cleanData);
