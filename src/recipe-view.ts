import RecipeViewPlugin from "./main";
import { EditableFileView, Keymap, TFile, WorkspaceLeaf } from "obsidian";
import RecipeCard from "./RecipeCard.svelte"
import { parseRecipeMarkdown } from "./parsing";

export const VIEW_TYPE_RECIPE = "recipe-view";

export class RecipeView extends EditableFileView {
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
        // These events can be registered directly as they'll be cleaned up
        // when `containerEl` goes out of scope
        this.containerEl.on('mouseover', 'a.internal-link', (e, el) => {
            this.app.workspace.trigger('hover-link', {
                event: e,
                source: this,
                hoverParent: this,
                el,
                linktext: el.getAttr("href"),
                sourcePath: this.file!.path,
            });
        });
        this.containerEl.on('click', 'a.internal-link', (e, el) => {
            const inNewLeaf = Keymap.isModEvent(e);
            this.app.workspace.openLinkText(
                el.getAttr("href")!,
                this.file!.path,
                inNewLeaf,
            )
        });
        this.containerEl.on('click', 'a.tag', (e, el) => {
            (this.app as any).internalPlugins.getPluginById('global-search')
                .instance.openGlobalSearch(`tag:${el.getAttr('href')}`);
        });
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
        if (!this.file) { return false }
        const text = await this.app.vault.cachedRead(this.file!);
        const metadata = await this.app.metadataCache.getFileCache(this.file!);
        const parsedRecipe = parseRecipeMarkdown(this.plugin, text, this.file!.path, this);
        this.content = new RecipeCard({
            target: this.contentEl,
            props: {
                parsedRecipe: parsedRecipe,
                file: this.file!,
                metadata: metadata || undefined,
            }
        });

        return true;
    }
}