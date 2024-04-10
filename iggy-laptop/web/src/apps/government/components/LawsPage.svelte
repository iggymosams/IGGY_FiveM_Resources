<script lang="ts">
    import { writable } from "svelte/store";
    import TextEditor from "./TextEditor.svelte";
    import type { Law } from "../types";
    import { canEdit, laws } from "../../../store/government";
    import { fetchNui } from "../../../utils/fetchNui";
    import { debugData } from "../../../utils/debugData";

    function randomID() {
        return (
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15)
        );
    }

    let activeLaw = writable<Law>($laws[0] ? $laws[0] : undefined);
    let editing = writable(false);

    let title = $laws[0] ? $laws[0].title : undefined;
    let getEditorContent: any;

    function newLaw() {
        let law: Law = {
            title: "New Law",
            uuid: randomID(),
        };
        title = law.title;
        activeLaw.set(law);
        laws.update(($laws) => [law, ...$laws]);
        editing.set(true);
    }

    function toggleEditing() {
        if ($editing && title) {
            $activeLaw.html = getEditorContent();
            $activeLaw.title = title;
            const lawIdx = $laws.findIndex(
                (law) => law.uuid === $activeLaw.uuid
            );
            if (lawIdx !== -1) {
                laws.update(($laws) => {
                    const updatedLaws = [...$laws];
                    updatedLaws[lawIdx] = $activeLaw;
                    return updatedLaws;
                });
                fetchNui("gov:saveLaw", $activeLaw);
            }
        }
        $editing = !$editing;
    }

    debugData([
        {
            app: "gov",
            action: "updateLaws",
            data: [
                {
                    title: "The Constitution of San Andreas",
                    html: "<h2><strong>Preamble:</strong></h2><p>We, the People of the State of San Andreas, with clear mind and purpose, to ensure justice for all, perpetuate the principles of free government, promote the interests and happiness of the citizen and maintain order hereby declare the establishment of this constitution.</p><p><br></p><h2><strong>Article 1 - Bill of Rights</strong></h2><p>All Citizens of San Andreas are by nature free and independent and have inalienable rights. Among these are enjoying and defending life and liberty, acquiring, possessing, and protecting property, and pursuing and obtaining safety, happiness, and privacy.</p><p><br></p><p><strong><u>Amendment 1 - Expression and Religion</u></strong></p><p>The State Government shall make no law respecting an establishment of religion, or prohibiting the free exercise thereof, or abridging the freedom of speech, or of the press; or the right of the people peaceably to assemble, and to petition the Government for a redress of grievances.</p><p><br></p><p><strong><u>Amendment 2 - Slavery and Involuntary Servitude</u></strong></p><p>Neither slavery nor involuntary servitude, except as a punishment for crime whereof the party shall have been duly convicted, shall exist within San Andreas or any place subject to their jurisdiction.</p><p>The State Government and the Judiciary shall have the power to enforce this article by appropriate legislation.</p><p><br></p><p><strong><u>Amendment 3 - Rights Guaranteed, Privileges and Immunities of Citizenship, Due Process and Equal Protection</u></strong></p><p><strong>Section. 1.</strong> All persons born or naturalized in San Andreas and subject to the jurisdiction thereof are citizens of San Andreas. The State shall not make or enforce any law which shall abridge the privileges or immunities of citizens; nor shall the State deprive any person of life, liberty, or property without due process of law; nor deny to any person within its jurisdiction the equal protection of the laws.</p><p><strong>Section. 2.</strong> The State Government and the Judiciary shall have the power to enforce, by appropriate legislation, the provisions of this article.</p><p><br></p><p><strong><u>Amendment 4 - Search and Seizure</u></strong></p><p>The right of the people to be secure in their persons, houses, papers, and effects, against unreasonable searches and seizures, shall not be violated, and no Warrants shall be issued, but upon probable cause, supported by Oath or affirmation, and particularly describing the place to be searched and the persons or things to be seized.</p><p><br></p><p><strong><u>Amendment 5 - Rights of Persons</u></strong></p><p>No person shall be subject for the same offense to be twice put in jeopardy of life or limb; nor shall be compelled in any criminal case to be a witness against himself, nor be deprived of life, liberty, or property, without due process of law; nor shall private property be taken for public use, without just compensation.</p><p><br></p><p><strong><u>Amendment 6 - Rights of Accused in Criminal Prosecutions</u></strong></p><p>In all criminal prosecutions, the accused shall enjoy the right to a speedy and public trial by an impartial judge of the State and district wherein the crime shall have been committed, which district shall have been previously ascertained by law, and to be informed of the nature and cause of the accusation; to be confronted with the witnesses against him; to have compulsory process for obtaining witnesses in his favor, and to have the Assistance of Counsel for his defense.</p><p><br></p><p><strong><u>Amendment 7 - Income Tax</u></strong></p><p>The State Government and the Judiciary shall have the power to lay and collect taxes on incomes, from whatever source derived, without apportionment among the several States, and without regard to any census or enumeration.</p><p><br></p><p><strong><u>Amendment 8 - Further Guarantees in Criminal Cases</u></strong></p><p>Excessive bail shall not be required, nor excessive fines imposed, nor cruel and unusual punishments inflicted.</p><p><br></p><p><strong><u>Amendment 9 - Rights to Defense of Person</u></strong></p><p>Persons hold the right to defend their persons when threatened with serious harm and death. Persons are required to make all effort to avoid utilizing lethal force to defend their person but may employ it when those efforts are exhausted, or external circumstance makes immediate action imperative to survival.</p><p><br></p><h2><strong>Article 2 - Distribution of Powers</strong></h2><p>The powers of the Government shall be divided into three separate branches, the Legislative, the Executive, including the administrative, and the Judicial, and no person charged with official duties under one of these branches shall exercise any of the functions of another except as in this Constitution expressly provided.</p><p><br></p><p><strong>Article 3 - Legislative Power</strong></p><p>This Constitution grants the legislative powers of government to the citizens broadly. Any citizen of the State of San Andreas may take part in the legislative process and suggest legislation for the state. The Executive Branch and Judicial Branch serve to review, interpret and advise such suggestions before they are enacted, and the Governor of San Andreas serves as the final check before enactment.</p><p>Members of the Executive and Legislative branches may present legislation as any normal citizen but are subject to the exact same checks, balances and restrictions as any other citizen.</p><p><br></p><p><strong>Article 4 - Executive Power</strong></p><p>This Constitution grants the executive powers of government and the obligation to enforce and uphold the laws and legislation of the State of San Andreas to the Governor of San Andreas and the Los Santos Police Department.</p><p>As a check on The Legislature, the Governor of San Andreas holds the right to veto suggested legislation and serves as the final barrier for any new legislation. The Governor’s signature serves to finally enact legislation.</p><p><br></p><p><strong>Article 5 - Judicial Power</strong></p><p>This Constitution grants the judicial powers of government to the San Andreas Department of Justice and entrusts them the task of upholding this very constitution, adjudicating legal disputes and interpreting, defending and applying the laws and legislation of the State of San Andreas in legal cases.</p><p>The Judiciary upholds both the state’s and the people’s rights. Thus, consists of multiple parties. The Judiciary consists of Judges to interpret and apply the law, Attorneys to defend the people and the state, and may hire Clerks to support their operations.</p><p><br></p><p><strong>Article 6 - Judicial Statutory Limitation</strong></p><p>Within the State of San Andreas, Infractions, Misdemeanors and Felonies, as well as Civil Litigation, have a Statute of Limitation of 30 days. Capital crimes have a Statute of Limitation of 60 days.</p>",
                    uuid: "tvy5rmzpqba9kqtuyzof",
                },
            ],
        },
    ]);
</script>

<div
    class="text-left w-full h-full absolute top-0 left-0 px-16 overflow-auto py-3 flex flex-col"
>
    {#if $canEdit}
        <div class="w-full grid grid-cols-12 gap-2 pb-3">
            <input
                class="col-start-3 col-span-5 font-bold text-lg bg-transparent"
                bind:value={title}
                disabled={!$editing}
            />

            <button
                class="py-1 px-2 rounded-md bg-blue-400 hover:bg-blue-500 col-start-11"
                on:click={newLaw}
            >
                New
            </button>
            <button
                class="py-1 px-2 rounded-md bg-blue-400 hover:bg-blue-500"
                on:click={toggleEditing}
            >
                {$editing ? "Save" : "Edit"}
            </button>
        </div>
    {/if}
    <div class="w-full h-full grid grid-cols-12 flex-auto">
        <div class="col-span-2 relative overflow-auto">
            <div class="divide-y divide-blue-400 px-1 overflow-hidden absolute">
                {#each $laws as law, i}
                    <button
                        class={`w-full py-5 px-1 font-bold ${law.uuid === $activeLaw.uuid ? "bg-slate-300" : ""}`}
                        on:click={() => {
                            activeLaw.set({ ...$laws[i] });
                            title = law.title;
                        }}
                    >
                        {law.title}
                    </button>
                {/each}
            </div>
        </div>
        <div class="col-span-10 h-full relative">
            <div class="h-full w-full bg-white rounded-md shadow-md absolute">
                <TextEditor {activeLaw} {editing} bind:getEditorContent />
            </div>
        </div>
    </div>
</div>
