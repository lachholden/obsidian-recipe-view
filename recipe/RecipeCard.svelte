<script lang="ts">
	import { CachedMetadata, TFile } from "obsidian";
	import RecipeCardTitleBlock from "./RecipeCardTitleBlock.svelte";
	import PlainElement from "./PlainElement.svelte";

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
		let i = 0;
		while (i < renderedMarkdownNodes.length) {
			let item = renderedMarkdownNodes.item(i)!;

			// Extract sections under headers
			if (
				item.nodeName?.startsWith("H") &&
				item.textContent?.match(/Ingredients|Nutrition/i)
			) {
				sideColumnComponents.push({
					type: PlainElement,
					props: { element: item },
				});
				const heading_level = parseInt(item.nodeName.at(1)!);
				while (true) {
					item = renderedMarkdownNodes.item(++i);
					if (!item) {
						break;
					}
					let nextHeadingLevel = item.nodeName?.startsWith("H")
						? parseInt(item.nodeName.at(1)!)
						: 7;
					if (nextHeadingLevel <= heading_level) {
						break;
					} else {
						sideColumnComponents.push({
							type: PlainElement,
							props: { element: item },
						});
					}
				}
			}

			// Extract the first image (not under a header) as the thumbnail
			else if (
				item.getElementsByTagName("IMG").length > 0 &&
				titleProps.thumbnailPath == null
			) {
				titleProps.thumbnailPath = item
					.getElementsByTagName("IMG")
					.item(0)
					.getAttribute("src");
				i++; // don't include this item in either column
			}

			// Otherwise, just send it to the main column
			else {
				mainColumnComponents.push({
					type: PlainElement,
					props: { element: item },
				});
				i++;
			}
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

	:global(.column-side ul) {
		padding-inline-start: 0;
	}

	:global(.column-side ul > li) {
		margin-top: var(--size-4-2);
		list-style: none;
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
