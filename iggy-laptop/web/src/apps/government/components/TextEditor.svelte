<script lang="ts">
    import { type Writable } from "svelte/store";

    import "quill/dist/quill.core.css";
    import "quill/dist/quill.snow.css";
    import "quill/dist/quill.bubble.css";
    import Quill from "quill";
    import { onDestroy, onMount } from "svelte";
    import type { Law } from "../types";

    let editor: Quill;

    export let editing: Writable<boolean>;
    export let activeLaw: Writable<Law>;

    onMount(() => {
        editor = new Quill("#editor", {
            modules: {
                toolbar: [
                    [{ header: 1 }, { header: 2 }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ color: [] }, { background: [] }],
                    ["clean"],
                ],
            },
            theme: "bubble",
        });
        editor.disable();
    });
    onDestroy(() => {
        editor.off("text-change", () => {});
    });

    $: {
        if ($activeLaw) {
            let content = $activeLaw.html;
            if (content === undefined) {
                editor.root.innerHTML = "";
            } else {
                if (editor && content) {
                    editor.root.innerHTML = content;
                }
            }
            let readOnly = $editing;
            if (editor) {
                editor.enable(readOnly);
            }
        }
    }

    export let getEditorContent = () => editor.root.innerHTML;
</script>

<div class="h-full relative">
    <div id="editor" class="absolute top-0 left-0 h-full w-full" />
</div>
