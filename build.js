const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const resources = [
    "iggy-admin",
    "iggy-boosting",
    "iggy-groups",
    "iggy-laptop",
    "iggy-rental",
];

resources.forEach((resource) => {
    exec(`cd ${resource} && npm i && npm run build`, (error) => {
        if (error) {
            console.error(error);
        }
        const web = path.join(resource, "web");
        if (fs.existsSync(web)) {
            exec(`cd ${web} && npm i && npm run build`, (viteError) => {
                if (viteError) {
                    console.log(viteError);
                }
            });
        }
        console.log(`Built resource ${resource}`);
    });
});
