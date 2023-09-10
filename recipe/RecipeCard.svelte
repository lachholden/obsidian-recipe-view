<script lang="ts">
	import { CachedMetadata, TFile } from "obsidian";
	import RecipeCardTitleBlock from "./RecipeCardTitleBlock.svelte";
	import PlainElement from "./PlainElement.svelte";
	import CheckableIngredientList from "./CheckableIngredientList.svelte";

	export let renderedMarkdownNodes: HTMLCollection;
	export let metadata: CachedMetadata | undefined;
	export let file: TFile;

	// let sideColumn: HTMLElement;
	// let mainColumn: HTMLElement;
	let sideColumnComponents = [];
	let mainColumnComponents = [];

	let titleProps = {
		title: "",
		thumbnailPath: null,
		frontmatter: null,
	};

	$: titleProps.title = file.basename;
	$: titleProps.frontmatter = metadata?.frontmatter;

	$: {
		let sendToColumn = mainColumnComponents;
		let sendToSideUntilLevel = 7;
		let currentHeader = null;
		for (let i = 0; i < renderedMarkdownNodes.length; i++) {
			let item = renderedMarkdownNodes.item(i)!;

			// Headers can change which column to send items to
			if (item.nodeName.startsWith("H")) {
				let headerLevel = parseInt(item.nodeName.at(1)!);
				if (
					sendToColumn == mainColumnComponents &&
					item.textContent?.match(/Ingredients|Nutrition/i)
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
				console.log(item);
				sendToColumn.push({
					type: CheckableIngredientList,
					props: { ul: item },
				});
				continue;
			}

			// Add current item to current column
			sendToColumn.push({
				type: PlainElement,
				props: { element: item },
			});
		}
	}
</script>

<div class="container">
	<div class="column column-side">
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

	:global(.column-main ol) {
		padding-inline-start: 20px;
		counter-reset: step;
	}

	:global(.column-main ol > li) {
		margin-top: var(--size-4-2);
		vertical-align: top;
		counter-increment: step;
		padding-inline-start: 20px;
	}

	:global(.column-main ol > li::marker) {
		color: var(--text-accent);
		content: counter(step) " ";
	}
</style>
