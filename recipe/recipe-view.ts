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
        const md_div = container.createDiv();
        MarkdownRenderer.render(this.app, text, md_div, this.file!.path, this);
        return true;
    }
}