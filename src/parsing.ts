import RecipeViewPlugin from "./main";
import RecipeLeaf from "./RecipeLeaf.svelte";
import CheckableIngredientList from "./CheckableIngredientList.svelte";
import SelectableStepList from "./SelectableStepList.svelte";
import { App, Component, MarkdownRenderer } from "obsidian";
import store from "./store"
import { Writable, get, writable } from "svelte/store"
import Fraction from "fraction.js";
import { deUnicodeFractions, matchQuantities } from "./quantities";
import ScaledQuantity from "./ScaledQuantity.svelte";
import { ComponentType, SvelteComponent } from "svelte";
import RecipeCard from "./RecipeCard.svelte";
import { receiveMessageOnPort } from "worker_threads";


export interface ParsedRecipeComponent {
    type: ComponentType;
    props: Record<string, unknown>;
    origIndex: number;
}

export interface ParsedRecipeSection {
    containsHeader: boolean;
    sideComponents: Array<ParsedRecipeComponent>;
    mainComponents: Array<ParsedRecipeComponent>;
}
export interface ParsedRecipe {
    title: string;
    thumbnailPath: string;
    sections: Array<ParsedRecipeSection>;
    renderedMarkdownParent: HTMLElement;
    qtyScaleStore: Writable<Fraction>;
}

function parseForQty(n: Node, qtyScaleStore: Writable<Fraction>) {
    if (n.nodeType == Node.ELEMENT_NODE) {
        if (
            (n as HTMLElement).hasAttribute("data-qty") ||
            (n as HTMLElement).hasAttribute("data-qty-no-parse")
        ) {
            return;
        }
    }

    if (n.nodeType == Node.TEXT_NODE) {
        const parent = n.parentNode!;
        let currentIndex = 0;
        n.textContent = deUnicodeFractions(n.textContent!);
        for (const match of matchQuantities(n.textContent!)) {
            parent.insertBefore(
                document.createTextNode(
                    n.textContent!.slice(currentIndex, match.index)
                ),
                n
            );
            const qtyTarget = createEl("span");
            qtyTarget.setAttribute("data-qty", "true");
            parent.insertBefore(qtyTarget, n);
            new ScaledQuantity({
                target: qtyTarget,
                props: {
                    value: match.value.value,
                    format: match.value.format,
                    unit: match.unit,
                    qtyScaleStore: qtyScaleStore,
                },
            });
            currentIndex = (match.index || currentIndex) + match.length;
        }
        parent.insertBefore(
            document.createTextNode(n.textContent!.slice(currentIndex)),
            n
        );
        parent.removeChild(n);
    }

    if (n.hasChildNodes()) {
        Array.from(n.childNodes).forEach((c) =>
            parseForQty(c, qtyScaleStore)
        );
    }
}

function injectQuantities(parsedRecipe: ParsedRecipe) {
    parsedRecipe.sections.flatMap((s) => s.sideComponents.concat(s.mainComponents)).map((c) => {
        switch (c.type) {
            case RecipeLeaf:
                Array.from((c.props.childNodesOf as HTMLElement).querySelectorAll("[data-qty-parse]"))
                    .forEach((n) => parseForQty(n, parsedRecipe.qtyScaleStore));
                break;

            case SelectableStepList:
                if (c.props.kind == "ol") {
                    Array.from((c.props.list as HTMLElement).querySelectorAll("[data-qty-parse]"))
                        .forEach((n) => parseForQty(n, parsedRecipe.qtyScaleStore));
                } else {
                    (c.props.list as Array<HTMLElement>).forEach((p) => {
                        Array.from(p.querySelectorAll("[data-qty-parse]"))
                            .forEach((n) => parseForQty(n, parsedRecipe.qtyScaleStore));
                    })
                }
                break;

            case CheckableIngredientList:
                parseForQty((c.props.list as HTMLElement), parsedRecipe.qtyScaleStore);
                break;

            default:
                break;
        }
    })
}

export function parseRecipeMarkdown(
    plugin: RecipeViewPlugin, text: string, path: string, component: Component
) {
    // Create our object to store the result.
    // - When we want to render HTML elements created from rendering the markdown, we need
    // to reparent them rather than clone them (or e.g. callout icons, transclusions,
    // etc. get lost.) As such, every element being rendered directly from the rendered
    // markdown needs to be wrapped in a RecipeLeaf, which ensures it doesn't get
    // destroyed if the components get rebuilt e.g. because the layout changes.
    const result: ParsedRecipe = {
        title: "",
        thumbnailPath: "",
        sections: [{
            containsHeader: false,
            sideComponents: [],
            mainComponents: [],
        }],
        renderedMarkdownParent: createDiv(),
        qtyScaleStore: writable(new Fraction(1)),
    };

    MarkdownRenderer.render(plugin.app, text, result.renderedMarkdownParent, path, component);


    const radioName = `selectable-steps-${get(store.counter)}`;
    store.counter.update((n) => n + 1);

    const sideColumnRegex = RegExp(plugin.settings.sideColumnRegex, "i");

    let currentSection = 0;
    let currentColumn = "mainComponents";

    let sendToSideUntilLevel = 7;
    for (let i = 0; i < result.renderedMarkdownParent.children.length; i++) {
        const item = result.renderedMarkdownParent.children.item(i)!;

        // Horizontal rules will create a new section
        if (item.nodeName == "HR") {
            result.sections.push({
                containsHeader: false,
                sideComponents: [],
                mainComponents: [],
            });
            currentSection++;
            currentColumn = "mainComponents"
            sendToSideUntilLevel = 7;
            continue; // Don't include the HR to be rendered
        }

        // Headers can change which column to send items to
        if (item.nodeName.match(/H[1-6]/)) {
            const headerLevel = parseInt(item.nodeName.at(1)!);
            if (
                plugin.settings.treatH1AsFilename &&
                headerLevel == 1 &&
                result.sections[currentSection].containsHeader == false
            ) {
                result.title = item?.textContent || "";
                continue;
            } else {
                result.sections[currentSection].containsHeader = true;
            }
            if (
                currentColumn == "mainComponents" &&
                item.textContent?.match(sideColumnRegex)
            ) {
                currentColumn = "sideComponents";
                sendToSideUntilLevel = headerLevel;
            } else if (
                currentColumn == "sideComponents" &&
                headerLevel <= sendToSideUntilLevel
            ) {
                currentColumn = "mainComponents";
                sendToSideUntilLevel = 7;
            }
        }

        // To stop margins from not collapsing below the title block,
        // get rid of the display: none frontmatter
        if (item.matches("pre.frontmatter")) {
            continue;
        }

        // Extract the first image as a thumbnail
        if (
            item.getElementsByTagName("IMG").length > 0 &&
            currentSection == 0 &&
            !result.thumbnailPath &&
            !result.sections[0].containsHeader
        ) {
            result.thumbnailPath = item
                .getElementsByTagName("IMG")
                .item(0)?.getAttribute("src") || "";
            console.log(result.thumbnailPath);
            continue; // Don't send to either column
        }

        // If it's an unordered list, make it checkable if either:
        // 1. it's going to the sidebar, or
        // 2. we haven't seen a header yet (and then send it there)
        if (
            item.nodeName == "UL" &&
            (currentColumn == "sideComponents" || !result.sections[currentSection].containsHeader)
        ) {
            result.sections[currentSection]["sideComponents"].push({
                type: CheckableIngredientList,
                props: { list: item, bullets: false },
                origIndex: i,
            });
            continue;
        }

        // If we're sending an ordered list to the main column, then make it selectable
        if (item.nodeName == "OL" && currentColumn == "mainComponents") {
            result.sections[currentSection][currentColumn].push({
                type: SelectableStepList,
                props: {
                    list: item,
                    kind: "ol",
                    radioName: radioName,
                },
                origIndex: i,
            });
            continue;
        }

        // If we're sending a paragraph to the main column, then make it selectable
        if (item.nodeName == "P" && currentColumn == "mainComponents") {
            let prev = result.sections[currentSection][currentColumn][result.sections[currentSection][currentColumn].length - 1];
            if (
                prev &&
                prev.type == SelectableStepList &&
                prev.props.kind == "p"
            ) {
                (prev.props.list as Array<HTMLElement>).push(item as HTMLElement);
            } else {
                result.sections[currentSection][currentColumn].push({
                    type: SelectableStepList,
                    props: {
                        list: [item],
                        kind: "p",
                        radioName: radioName,
                    },
                    origIndex: i,
                });
            }
            continue;
        }

        // Add current item to current column
        // @ts-ignore
        result.sections[currentSection][currentColumn].push({
            type: RecipeLeaf,
            props: { childNodesOf: item, asTag: item.nodeName },
            origIndex: i,
        });
    }

    injectQuantities(result);

    return result;
}