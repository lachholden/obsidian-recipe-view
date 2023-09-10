<script lang="ts">
	export let renderedMarkdownNodes: NodeListOf<ChildNode>;

	let sideColumn: HTMLElement;
	let mainColumn: HTMLElement;

	$: if (sideColumn && mainColumn) {
		let i = 0;
		while (i < renderedMarkdownNodes.length) {
			let item = renderedMarkdownNodes.item(i);
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
			} else {
				mainColumn.appendChild(item.cloneNode(true));
				i++;
			}
		}
	}
</script>

<div class="container">
	<div class="column column-side" bind:this={sideColumn} />
	<div class="column column-main" bind:this={mainColumn} />
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
