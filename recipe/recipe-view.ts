import { FileView, MarkdownRenderer, TFile, WorkspaceLeaf } from "obsidian";

export const VIEW_TYPE_RECIPE = "recipe-view";

export class RecipeView extends FileView {

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
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
        const recipe_container = container.createDiv({ cls: "recipe__container" })
        const side_col = recipe_container.createDiv({ cls: ["recipe__column", "recipe__column-side"] })
        const main_col = recipe_container.createDiv({ cls: ["recipe__column", "recipe__column-main"] })
        MarkdownRenderer.render(this.app, text, md_div, this.file!.path, this);
        md_div.childNodes.forEach(child => {
            main_col.appendChild(child);
            side_col.createEl("h1", { text: "test" });
            side_col.createEl("h1", { text: "test2" });
            side_col.createEl("h1", { text: "test3" });
            side_col.createEl("h1", { text: "test4" });
        })
        return true;
    }
}