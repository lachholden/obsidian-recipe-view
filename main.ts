import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

import { RecipeView, VIEW_TYPE_RECIPE } from 'recipe/recipe-view';

interface RecipeViewPluginSettings {
	sideColumnRegex: string;
}

const DEFAULT_SETTINGS: RecipeViewPluginSettings = {
	sideColumnRegex: 'Ingredients|Nutrition'
}

export default class RecipeViewPlugin extends Plugin {
	settings: RecipeViewPluginSettings;

	async onload() {
		await this.loadSettings();

		this.registerView(VIEW_TYPE_RECIPE, (leaf) => new RecipeView(leaf, this));

		this.addRibbonIcon("chef-hat", "Open as recipe", () => {
			this.activateView();
		})

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {

	}

	async activateView() {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		activeView?.leaf.setViewState({
			type: VIEW_TYPE_RECIPE,
			active: true,
			state: activeView.leaf.view.getState(),
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
				.setValue(this.plugin.settings.sideColumnRegex)
				.onChange(async (value) => {
					this.plugin.settings.sideColumnRegex = value;
					await this.plugin.saveSettings();
				}));
	}
}