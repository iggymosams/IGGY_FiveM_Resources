const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const resources = ["iggy-admin"];

resources.forEach(async (resource) => {
    const resourcePath = path.resolve(__dirname, resource);
    exec(`cd ${resourcePath} && yarn && yarn build`, (error) => {
        if (error) {
            console.error(error);
        }
        const web = path.join(resourcePath, "web");
        if (fs.existsSync(web)) {
            exec(`cd ${web} && yarn && yarn build`, (viteError) => {
                if (viteError) {
                    console.log(viteError);
                }
            });
            console.log(`Built resource and NUI ${resource}`);
        } else {
            console.log(`Built resource ${resource}`);
        }
    });
});
