import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';

import { RecipeView, VIEW_TYPE_RECIPE } from 'recipe/recipe-view';

interface RecipeViewPluginSettings {
	sideColumnRegex: string;
}

const DEFAULT_SETTINGS: RecipeViewPluginSettings = {
	sideColumnRegex: 'Ingredients|Nutrition'
}

export default class RecipeViewPlugin extends Plugin {
	settings: RecipeViewPluginSettings | undefined;

	async onload() {
		await this.loadSettings();

		this.registerView(VIEW_TYPE_RECIPE, (leaf) => new RecipeView(leaf, this));

		this.addRibbonIcon("chef-hat", "Toggle recipe view", () => {
			this.toggleView(false);
		});

		this.addCommand({
			id: "toggle-recipe-view",
			name: "Toggle recipe view and markdown view",
			checkCallback: (c) => this.toggleView(c),
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// Load style settings variables
		this.app.workspace.trigger("parse-style-settings");
	}

	onunload() {

	}

	toggleView(this: RecipeViewPlugin, checking: boolean) {
		const activeLeaf = this.app.workspace.getMostRecentLeaf();

		if (activeLeaf?.getViewState().type == "markdown") {
			if (!checking) {
				this.setRecipeView(activeLeaf!);
			}
		} else if (activeLeaf?.getViewState().type == VIEW_TYPE_RECIPE) {
			if (!checking) {
				this.setMarkdownView(activeLeaf!);
			}
		} else {
			return false;
		}
		return true;
	}

	async setRecipeView(leaf: WorkspaceLeaf) {
		await leaf.setViewState({
			type: VIEW_TYPE_RECIPE,
			state: leaf.view.getState(),
			active: true,
			// @ts-ignore
			popstate: true,
		})
	}

	async setMarkdownView(leaf: WorkspaceLeaf) {
		await leaf.setViewState({
			type: "markdown",
			state: leaf.view.getState(),
			active: true,
			// @ts-ignore
			popstate: true,
		})
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: RecipeViewPlugin;

	constructor(app: App, plugin: RecipeViewPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Side column regex')
			.setDesc('A regular expression for headings of sections to pull to the side column')
			.addText(text => text
				.setPlaceholder('Ingredients|Nutrition')
				.setValue(this.plugin.settings!.sideColumnRegex)
				.onChange(async (value) => {
					this.plugin.settings!.sideColumnRegex = value;
					await this.plugin.saveSettings();
				}));
	}
}
