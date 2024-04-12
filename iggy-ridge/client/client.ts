global.exports["iggy-laptop"].RegisterLaptopCallback(
    "ridge:searchURL",
    async (url: string) => {
        let data = await global.exports["iggy-utils"].TriggerQBCallBack(
            "iggy-ridge:cb:searchURL",
            url
        );
        return data;
    }
);

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "ridge:isSiteOwner",
    async (url: string) => {
        let data = await global.exports["iggy-utils"].TriggerQBCallBack(
            "iggy-ridge:cb:isSiteOwner",
            url
        );
        return data;
    }
);
