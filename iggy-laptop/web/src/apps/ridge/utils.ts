import type { SvelteComponent } from "svelte";
import { activeTab, progress, tabs } from "../../store/ridge";
import { fetchNui } from "../../utils/fetchNui";
import Test from "./components/templates/Test.svelte";
import { get } from "svelte/store";
import type { SearchResult, Site } from "./types";
import SearchPage from "./components/SearchPage.svelte";

export async function searchURL(url: string, tab: string) {
    progress.set(90);
    let pageData: Site | SearchResult[] | undefined = undefined;

    try {
        let resp = await fetchNui("ridge:searchURL", url);
        pageData = resp;
    } catch (error) {
        let example =
            // '{"title":"IGGYMOSAMS","url":"iggymosams.dev","page":{"template":"Test","data":{"input1":"Welcome to IGGYMOSAMS.dev"}}}';
            '[{"url": "iggy.dev", "title":"iggy"},{"url": "iggymosams.com", "title":"IGGYMOSAMS"}]';
        pageData = JSON.parse(example);
    }
    if (pageData === undefined) return;
    if (Array.isArray(pageData)) {
        console.log(pageData);
        tabs.update((currentTabs) => {
            let i = currentTabs.findIndex((t) => t.id === tab);
            currentTabs[i].title = "Search";
            currentTabs[i].url = "ridge.com";
            currentTabs[i].page.content = SearchPage;
            currentTabs[i].page.data = { results: JSON.stringify(pageData) };

            return currentTabs;
        });

        activeTab.set(get(tabs).find((t) => t.id === tab) || get(tabs)[0]);
    } else {
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
    }

    progress.set(100);
    setTimeout(() => progress.set(0), 2000);
}
