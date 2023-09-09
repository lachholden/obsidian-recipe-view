import RecipeViewPlugin from "main";
import { FileView, MarkdownRenderer, TFile, WorkspaceLeaf } from "obsidian";

export const VIEW_TYPE_RECIPE = "recipe-view";

export class RecipeView extends FileView {
    plugin: RecipeViewPlugin

    constructor(leaf: WorkspaceLeaf, plugin: RecipeViewPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType(): string {
        return VIEW_TYPE_RECIPE;
    }

    getDisplayText(): string {
        return this.file?.basename || "Recipe";
    }

    getIcon(): string {
        return "chef-hat";
    }

    async onOpen() {
        this.renderRecipe();
    }

    async onClose() {

    }

    async onLoadFile(file: TFile): Promise<void> {
        super.onLoadFile(file);
        this.renderRecipe();
        return;
    }

    async renderRecipe(): Promise<boolean> {
        if (!this.file) { return false };
        const text = await this.app.vault.cachedRead(this.file!);
        const container = this.containerEl.children[1];
        container.empty()
        const md_div = createDiv();
        const recipe_container = container.createDiv({ cls: "recipe__container" });
        const side_col = recipe_container.createDiv({ cls: ["recipe__column", "recipe__column-side"] });
        const main_col = recipe_container.createDiv({ cls: ["recipe__column", "recipe__column-main"] });
        MarkdownRenderer.render(this.app, text, md_div, this.file!.path, this);

        var i = 0;
        while (i < md_div.childNodes.length) {
            var item = md_div.childNodes.item(i)!;
            // Extract sections with key titles
            if (item.nodeName.startsWith("H") && item.textContent!.match(this.plugin.settings.sideColumnRegex)) {
                side_col.appendChild(item.cloneNode(true));
                const heading_level = parseInt(item.nodeName.at(1)!);
                while (true) {
                    item = md_div.childNodes.item(++i);
                    var nextHeadingLevel = item.nodeName.startsWith("H") ?
                        parseInt(item.nodeName.at(1)!) : 7;
                    if (nextHeadingLevel <= heading_level) {
                        break;
                    } else {
                        side_col.appendChild(item.cloneNode(true));
                    }
                }
            } else {
                main_col.appendChild(item.cloneNode(true));
                i++;
            }
        }

        return true;
    }
}