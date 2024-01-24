declare module "simple-svelte-autocomplete" {
    import { SvelteComponent } from "svelte";

    export interface AutoCompleteProps<T>
        extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap["div"]> {
        items?: T[];
        labelFieldName?: string;
        valueFieldName?: string;
        lock?: boolean;
        closeOnBlur?: boolean;
        showClear?: boolean;
        hideArrow?: boolean;
        itemFilterFunction?: (T, keywords) => boolean;
        selectedItem?: T | undefined;
        disabled?: boolean;
        onChange?: (item: T) => void;
        className: string;
        placeholder: string;
        searchFunction?: () => Promise<T>;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface AutoCompleteEvents {
        // NOP
    }

    export default class AutoComplete extends SvelteComponent<
        AutoCompleteProps<T>,
        AutoCompleteEvents,
        {
            item: { item: T };
            "no-results": null;
        }
    > {}
}
