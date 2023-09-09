import { FileView, WorkspaceLeaf } from "obsidian";

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
        const container = this.containerEl.children[1];
        container.empty();
        container.createEl("h4", { text: "RECIPE" });
    }

    async onClose() {

    }
}