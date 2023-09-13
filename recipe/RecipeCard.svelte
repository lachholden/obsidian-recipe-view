<script lang="ts">
	import { CachedMetadata, TFile } from "obsidian";
	import RecipeCardTitleBlock from "./RecipeCardTitleBlock.svelte";
	import RecipeLeaf from "./RecipeLeaf.svelte";
	import CheckableIngredientList from "./CheckableIngredientList.svelte";
	import SelectableStepList from "./SelectableStepList.svelte";
	import RecipeViewPlugin from "main";
	import store from "./store";
	import { onMount, setContext } from "svelte";
	import ScaleSelector from "./ScaleSelector.svelte";
	import { writable } from "svelte/store";

	export let renderedMarkdownDiv: HTMLDivElement;
	export let metadata: CachedMetadata | undefined;
	export let file: TFile;

	let qtyScale: number;

	let sideColumnComponents = [];
	let mainColumnComponents = [];

	let titleProps = {
		title: "",
		thumbnailPath: null,
		frontmatter: null,
	};

	$: titleProps.title = file.basename;
	$: titleProps.frontmatter = metadata?.frontmatter;

	let plugin: RecipeViewPlugin;
	store.plugin.subscribe((p) => (plugin = p));

	onMount(() => {
		// We essentially want to create all our subcomponents that pick off
		// the nodes we want from the tree under renderedMarkdownDiv using
		// appendChild. As this process destructs renderedMarkdownDiv and leaves
		// just the bones, this process is only run once in onMount.
		// TODO figure out how to refresh if the document changes
		sideColumnComponents = [];
		mainColumnComponents = [];
		let sideColumnRegex = RegExp(plugin.settings.sideColumnRegex, "i");

		let sendToColumn = mainColumnComponents;
		let sendToSideUntilLevel = 7;
		for (let i = 0; i < renderedMarkdownDiv.children.length; i++) {
			let item = renderedMarkdownDiv.children.item(i)!;

			// Headers can change which column to send items to
			if (item.nodeName.startsWith("H")) {
				let headerLevel = parseInt(item.nodeName.at(1)!);
				if (
					sendToColumn == mainColumnComponents &&
					item.textContent?.match(sideColumnRegex)
				) {
					sendToColumn = sideColumnComponents;
					sendToSideUntilLevel = headerLevel;
				} else if (
					sendToColumn == sideColumnComponents &&
					headerLevel <= sendToSideUntilLevel
				) {
					sendToColumn = mainColumnComponents;
					sendToSideUntilLevel = 7;
				}

				// Don't extract any more images as a thumbnail
				if (titleProps.thumbnailPath == null) {
					titleProps.thumbnailPath = "";
				}
			}

			// Extract the first image as a thumbnail
			if (
				item.getElementsByTagName("IMG").length > 0 &&
				titleProps.thumbnailPath == null
			) {
				titleProps.thumbnailPath = item
					.getElementsByTagName("IMG")
					.item(0)
					.getAttribute("src");
				continue; // Don't send to either column
			}

			// If we're sending an unordered list to the sidebar, then make it checkable
			if (item.nodeName == "UL" && sendToColumn == sideColumnComponents) {
				sendToColumn.push({
					type: CheckableIngredientList,
					props: { items: item.children },
				});
				continue;
			}

			// If we're sending an ordered list to the main column, then make it selectable
			if (item.nodeName == "OL" && sendToColumn == mainColumnComponents) {
				sendToColumn.push({
					type: SelectableStepList,
					props: { steps: item.children },
				});
				continue;
			}

			// Add current item to current column
			sendToColumn.push({
				type: RecipeLeaf,
				props: { element: item, qtyParseAll: false },
			});
		}
	});
</script>

<div class="container markdown-rendered">
	<div class="column column-side">
		<ScaleSelector bind:scale={qtyScale} />
		{#each sideColumnComponents as c}
			<svelte:component this={c.type} {...c.props} />
		{/each}
	</div>
	<div class="column column-main">
		<RecipeCardTitleBlock {...titleProps} />
		{#each mainColumnComponents as c}
			<svelte:component this={c.type} {...c.props} />
		{/each}
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
		align-items: stretch;
		justify-content: center;
		height: 100%;
		overflow: hidden;
	}

	.column {
		padding: var(--file-margins);
		max-height: 100%;
		overflow: scroll;
	}

	.column:empty {
		display: none;
	}

	.column-side {
		flex-basis: calc(var(--file-line-width) / 2);
		flex-grow: 0;
		flex-shrink: 1;
	}

	.column-main {
		flex-basis: var(--file-line-width);
		flex-grow: 0;
		flex-shrink: 1;
	}

	/* Single-column layout */
	@media (max-width: 600px) {
		.container {
			flex-direction: column-reverse;
			align-items: stretch;
			justify-content: start;
			height: auto;
			overflow: scroll;
		}
		.column {
			max-height: auto;
			overflow: auto;
			flex: 0 1 auto;
		}
	}
</style>
