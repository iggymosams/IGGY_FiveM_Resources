import type { SvelteComponent } from "svelte";
import { activeTab, progress, tabs } from "../../store/ridge";
import { fetchNui } from "../../utils/fetchNui";
import Test from "./components/templates/Test.svelte";
import { get } from "svelte/store";

export async function searchURL(url: string, tab: string) {
    progressBar();
    let pageData = undefined;

    try {
        let resp = await fetchNui("ridge:searchURL", url);
        pageData = resp;
    } catch (error) {
        let example =
            '{"title":"IGGYMOSAMS","url":"iggymosams.dev","page":{"template":"Test","data":{"input1":"Welcome to IGGYMOSAMS.dev"}}}';

        pageData = JSON.parse(example);
    }

    let page: typeof SvelteComponent<any> | undefined = undefined;
    switch (pageData.page.template) {
        case "Test":
            page = Test;
            break;

        default:
            break;
    }

    if (page === undefined) return;

    tabs.update((currentTabs) => {
        let i = currentTabs.findIndex((t) => t.id === tab);
        currentTabs[i].title = pageData.title;
        currentTabs[i].url = pageData.url;
        currentTabs[i].page.content = page;
        currentTabs[i].page.data = pageData.page.data;

        return currentTabs;
    });

    activeTab.set(get(tabs).find((t) => t.id === tab) || get(tabs)[0]);

    progress.set(100);
    setTimeout(() => progress.set(0), 2000);
}

async function progressBar() {
    for (let i = 0; i < 90; i += 10) {
        progress.set(i);
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
}
