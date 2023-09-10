<script lang="ts">
	import { CachedMetadata, TFile } from "obsidian";
	import RecipeCardTitleBlock from "./RecipeCardTitleBlock.svelte";

	export let renderedMarkdownNodes: HTMLCollection;
	export let metadata: CachedMetadata | undefined;
	export let file: TFile;

	let sideColumn: HTMLElement;
	let mainColumn: HTMLElement;

	let titleProps = {
		title: "",
		thumbnailPath: null,
		frontmatter: null,
	};

	$: titleProps.title = file.basename;
	$: titleProps.frontmatter = metadata?.frontmatter;

	$: if (sideColumn && mainColumn) {
		let i = 0;
		while (i < renderedMarkdownNodes.length) {
			let item = renderedMarkdownNodes.item(i)!;

			// Extract sections under headers
			if (
				item.nodeName?.startsWith("H") &&
				item.textContent?.match(/Ingredients|Nutrition/i)
			) {
				sideColumn.appendChild(item.cloneNode(true));
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
						sideColumn.appendChild(item.cloneNode(true));
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
				i++;
			}

			// Otherwise, just send it to the main column
			else {
				mainColumn.appendChild(item.cloneNode(true));
				i++;
			}
		}
	}
</script>

<div class="container">
	<div class="column column-side" bind:this={sideColumn} />
	<div class="column column-main" bind:this={mainColumn}>
		<RecipeCardTitleBlock {...titleProps} />
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

	:global(.column-side ul li) {
		margin-top: var(--size-4-2);
		list-style: none;
	}
</style>
