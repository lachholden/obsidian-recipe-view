import { jsPDF } from "jspdf";
import { App, TFile } from "obsidian";
import RecipeViewPlugin from "./main";
import { ParsedRecipeComponent, parseRecipeMarkdown } from "./parsing";
import RecipeLeaf from "./RecipeLeaf.svelte";

function getHtml(c: ParsedRecipeComponent): HTMLElement {
    if (c.type == RecipeLeaf) {
        console.log(c.props.childNodesOf);
        return c.props.childNodesOf as HTMLElement;
    } else {
        return createDiv("uh oh");
    }
}

export async function exportPDF(file: TFile, plugin: RecipeViewPlugin) {
    const text = await plugin.app.vault.cachedRead(file);
    const metadata = await plugin.app.metadataCache.getFileCache(file);
    const parsedRecipe = parseRecipeMarkdown(plugin, text, file.path, plugin);  // TODO component
    const doc = new jsPDF();
    parsedRecipe.sections.forEach((s) => {
        s.mainComponents.forEach((c) => {
            doc.html(getHtml(c), { callback: (doc) => { doc.save("test.pdf") }, x: 10, y: 10 });
        })
    });
}