import RecipeViewPlugin from "main";
import { FileView, MarkdownRenderer, TFile, WorkspaceLeaf } from "obsidian";
import RecipeCard from "./RecipeCard.svelte"

export const VIEW_TYPE_RECIPE = "recipe-view";

export class RecipeView extends FileView {
    plugin: RecipeViewPlugin
    content?: RecipeCard

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
        this.content?.$destroy();
    }

    async onLoadFile(file: TFile): Promise<void> {
        super.onLoadFile(file);
        this.renderRecipe();
        return;
    }

    async renderRecipe(): Promise<boolean> {
        if (!this.file) { return false };
        const text = await this.app.vault.cachedRead(this.file!);
        const mdDiv = createDiv();
        MarkdownRenderer.render(this.app, text, mdDiv, this.file!.path, this);
        this.content = new RecipeCard({
            target: this.contentEl,
            props: {
                renderedMarkdownNodes: mdDiv.childNodes
            }
        });

        return true;
    }
}