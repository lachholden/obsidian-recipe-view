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
	import { writable, get } from "svelte/store";
	import Fraction from "fraction.js";

	let plugin: RecipeViewPlugin;
	store.plugin.subscribe((p) => (plugin = p));

	export let renderedMarkdownDiv: HTMLDivElement;
	export let metadata: CachedMetadata | undefined;
	export let file: TFile;

	let scaleNum;
	let qtyScale: Fraction;
	let qtyScaleStore = writable(new Fraction(1));
	setContext("qtyScaleStore", qtyScaleStore);
	$: qtyScaleStore.set(qtyScale);

	let containerWidth: number;
	$: singleColumn = containerWidth < plugin.settings.singleColumnMaxWidth;

	let sideColumnComponents = [];
	let mainColumnComponents = [];

	let radioName = `selectable-steps-${get(store.counter)}`;
	store.counter.update((n) => n + 1);

	let titleProps = {
		title: "",
		thumbnailPath: null,
		frontmatter: null,
	};

	onMount(() => {
		titleProps.title = file.basename;
		titleProps.frontmatter = metadata?.frontmatter;

		// We essentially want to create all our subcomponents that pick off
		// the nodes we want from the tree under renderedMarkdownDiv using
		// appendChild. As this process destructs renderedMarkdownDiv and leaves
		// just the bones, this process is only run once in onMount.
		// TODO figure out how to refresh if the document changes
		sideColumnComponents = [];
		mainColumnComponents = [];
		let sideColumnRegex = RegExp(plugin.settings.sideColumnRegex, "i");

		let seenHeader = false;
		let sendToColumn = mainColumnComponents;
		let sendToSideUntilLevel = 7;
		for (let i = 0; i < renderedMarkdownDiv.children.length; i++) {
			let item = renderedMarkdownDiv.children.item(i)!;

			// Headers can change which column to send items to
			if (item.nodeName.startsWith("H")) {
				let headerLevel = parseInt(item.nodeName.at(1)!);
				if (
					plugin.settings!.treatH1AsFilename &&
					headerLevel == 1 &&
					seenHeader == false
				) {
					titleProps.title = item?.textContent!;
					continue;
				} else {
					seenHeader = true;
				}
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
			}

			// To stop margins from not collapsing below the title block,
			// get rid of the display: none frontmatter
			if (item.matches("pre.frontmatter")) {
				continue;
			}

			// Extract the first image as a thumbnail
			if (
				item.getElementsByTagName("IMG").length > 0 &&
				titleProps.thumbnailPath == null &&
				!seenHeader
			) {
				titleProps.thumbnailPath = item
					.getElementsByTagName("IMG")
					.item(0)
					.getAttribute("src");
				continue; // Don't send to either column
			}

			// If it's an unordered list, make it checkable if either:
			// 1. it's going to the sidebar, or
			// 2. we haven't seen a header yet
			if (
				item.nodeName == "UL" &&
				(sendToColumn == sideColumnComponents || !seenHeader)
			) {
				sendToColumn.push({
					type: CheckableIngredientList,
					props: { items: item.children, bullets: !seenHeader },
				});
				continue;
			}

			// If we're sending an ordered list to the main column, then make it selectable
			if (item.nodeName == "OL" && sendToColumn == mainColumnComponents) {
				sendToColumn.push({
					type: SelectableStepList,
					props: {
						steps: item.children,
						radioName: radioName,
						kind: "ol",
					},
				});
				continue;
			}

			// If we're sending a paragraph to the main column, then make it selectable
			if (item.nodeName == "P" && sendToColumn == mainColumnComponents) {
				let prev = sendToColumn[sendToColumn.length - 1];
				if (
					prev &&
					prev.type == SelectableStepList &&
					prev.props.kind == "p"
				) {
					prev.props.steps.push(item);
				} else {
					sendToColumn.push({
						type: SelectableStepList,
						props: {
							steps: [item],
							radioName: radioName,
							kind: "p",
						},
					});
				}
				continue;
			}

			// Add current item to current column
			sendToColumn.push({
				type: RecipeLeaf,
				props: { element: item, qtyParseAll: false },
			});
		}
	});

	let container: HTMLDivElement;
	let scaler: ScaleSelector;

	function checkNext(focusOnly: boolean) {
		const nextUnchecked = container.querySelector(
			"input[type=checkbox]:not(:checked)"
		);
		if (nextUnchecked) {
			if (!focusOnly) nextUnchecked.checked = true;
			nextUnchecked.focus();
		}
	}

	function uncheckPrevious() {
		const checked = container.querySelectorAll(
			"input[type=checkbox]:checked"
		);
		if (checked.length > 0) {
			const lastChecked = checked.item(checked.length - 1);
			lastChecked.checked = false;
			lastChecked.focus();
		}
	}

	function advanceStep(focusOnly: boolean) {
		const steps = container.querySelectorAll("input[type=radio]");
		for (let i = 0; i < steps.length - 1; i++) {
			if (steps.item(i).checked) {
				if (!focusOnly) steps.item(i + 1).checked = true;
				steps.item(focusOnly ? i : i + 1).focus();
				return;
			}
		}
		if (!focusOnly) steps.item(0).checked = true;
		steps.item(0).focus();
	}

	function retreatStep() {
		const steps = container.querySelectorAll("input[type=radio]");
		for (let i = 1; i < steps.length; i++) {
			if (steps.item(i).checked) {
				steps.item(i - 1).checked = true;
				steps.item(i - 1).focus();
				return;
			}
		}
	}

	function handleKeypress(e: KeyboardEvent) {
		if (e.key == "n") {
			checkNext(false);
		} else if (e.key == "p") {
			uncheckPrevious();
		} else if (e.key == "j") {
			advanceStep(false);
		} else if (e.key == "k") {
			retreatStep();
		} else if (e.key == ",") {
			if (scaleNum) {
				scaleNum -= 0.25;
			}
		} else if (e.key == ".") {
			if (scaleNum) {
				scaleNum += 0.25;
			}
		} else if (e.key == "h") {
			checkNext(true);
		} else if (e.key == "l") {
			advanceStep(true);
		}
	}
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
	class="container markdown-rendered"
	bind:clientWidth={containerWidth}
	bind:this={container}
	class:single-column={singleColumn}
	on:keypress={handleKeypress}
	role="document"
>
	{#if sideColumnComponents.length > 0}
		<div class="column column-side">
			<ScaleSelector bind:scale={qtyScale} bind:scaleNum />
			{#each sideColumnComponents as c}
				<svelte:component this={c.type} {...c.props} />
			{/each}
		</div>
	{/if}
	<div class="column column-main">
		<RecipeCardTitleBlock {...titleProps} {singleColumn} />
		{#if sideColumnComponents.length == 0}
			<ScaleSelector bind:scale={qtyScale} bind:scaleNum />
		{/if}
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
		overflow: clip;
		position: relative;
		top: 0;
		left: 0;
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
	.single-column.container {
		flex-direction: column-reverse;
		align-items: stretch;
		justify-content: start;
		height: auto;
		overflow: scroll;
	}
	.single-column .column {
		max-height: auto;
		overflow: auto;
		flex: 0 1 auto;
	}
</style>
