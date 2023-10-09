<script lang="ts">
	import { CachedMetadata, TFile } from "obsidian";
	import RecipeCardTitleBlock from "./RecipeCardTitleBlock.svelte";
	import RecipeViewPlugin from "./main";
	import store from "./store";
	import ScaleSelector from "./ScaleSelector.svelte";
	import Fraction from "fraction.js";
	import RecipeCardTwoColumn from "./RecipeCardTwoColumn.svelte";
	import RecipeCardSplitSteps from "./RecipeCardSplitSteps.svelte";
	import RecipeCardOneColumn from "./RecipeCardOneColumn.svelte";
	import { ParsedRecipe, ParsedRecipeComponent } from "./parsing";

	let plugin: RecipeViewPlugin;
	store.plugin.subscribe((p) => (plugin = p));

	// Props to be passed in
	export let parsedRecipe: ParsedRecipe;
	export let metadata: CachedMetadata | undefined;
	export let file: TFile;

	// Recipe scaling - create store here to pass to all children via ctx
	let scaleNum = 1;
	let qtyScale: Fraction;
	$: parsedRecipe?.qtyScaleStore.set(qtyScale);

	// Determining the recipe format
	let containerWidth: number;
	$: isBelowSingleColumnWidth =
		containerWidth < plugin.settings.singleColumnMaxWidth;
	$: twoColumnSideComponents =
		parsedRecipe?.sections.flatMap(
			({ sideComponents }) => sideComponents
		) || [];
	$: twoColumnMainComponents =
		parsedRecipe?.sections.flatMap(
			({ mainComponents }) => mainComponents
		) || [];
	$: singleColumnSections = parsedRecipe?.sections.map((s) =>
		s.sideComponents
			.concat(s.mainComponents)
			.sort(
				(a: ParsedRecipeComponent, b: ParsedRecipeComponent) =>
					a.origIndex - b.origIndex
			)
	);

	// Titleblock variables
	$: title = parsedRecipe.title ? parsedRecipe.title : file.basename;
	$: frontmatter = metadata?.frontmatter || {};

	// DOM searching and manipulating keyboard shortcuts
	let container: HTMLDivElement;

	function checkNext(focusOnly: boolean) {
		const nextUnchecked = container.querySelector(
			"input[type=checkbox]:not(:checked)"
		) as HTMLInputElement;
		if (nextUnchecked) {
			if (!focusOnly) nextUnchecked.checked = true;
			nextUnchecked.focus();
		}
	}

	function uncheckPrevious() {
		const checked = container.querySelectorAll(
			"input[type=checkbox]:checked"
		) as NodeListOf<HTMLInputElement>;
		if (checked.length > 0) {
			const lastChecked = checked.item(checked.length - 1);
			lastChecked.checked = false;
			lastChecked.focus();
		}
	}

	function advanceStep(focusOnly: boolean) {
		const steps = container.querySelectorAll(
			"input[type=radio]"
		) as NodeListOf<HTMLInputElement>;
		for (let i = 0; i < steps.length; i++) {
			if (steps.item(i).checked) {
				if (!focusOnly && steps.item(i + 1))
					steps.item(i + 1).checked = true;
				if (focusOnly || steps.item(i + 1))
					steps.item(focusOnly ? i : i + 1).focus();
				return;
			}
		}
		if (!focusOnly) steps.item(0).checked = true;
		steps.item(0).focus();
	}

	function retreatStep() {
		const steps = container.querySelectorAll(
			"input[type=radio]"
		) as NodeListOf<HTMLInputElement>;
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
		} else if (e.key == "[") {
			if (scaleNum) {
				scaleNum -= 0.25;
			} else {
				scaleNum = 0.75;
			}
		} else if (e.key == "]") {
			if (scaleNum) {
				scaleNum += 0.25;
			} else {
				scaleNum = 1.25;
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
	on:keypress={handleKeypress}
	role="document"
>
	{#if isBelowSingleColumnWidth != false || twoColumnSideComponents.length == 0 || twoColumnMainComponents.length == 0}
		<RecipeCardOneColumn sections={singleColumnSections}>
			<ScaleSelector
				slot="scaleselector"
				bind:scale={qtyScale}
				bind:scaleNum
			/>

			<RecipeCardTitleBlock
				slot="titleblock"
				{title}
				{frontmatter}
				thumbnailPath={parsedRecipe?.thumbnailPath}
				singleColumn={true}
			/>
		</RecipeCardOneColumn>
	{:else if parsedRecipe?.sections.length <= 3}
		<RecipeCardTwoColumn
			sideColumnComponents={twoColumnSideComponents}
			mainColumnComponents={twoColumnMainComponents}
		>
			<ScaleSelector
				slot="scaleselector"
				bind:scale={qtyScale}
				bind:scaleNum
			/>

			<RecipeCardTitleBlock
				slot="titleblock"
				{title}
				{frontmatter}
				thumbnailPath={parsedRecipe?.thumbnailPath}
				singleColumn={false}
			/>
		</RecipeCardTwoColumn>
	{:else}
		<RecipeCardSplitSteps sections={parsedRecipe?.sections}>
			<ScaleSelector
				slot="scaleselector"
				bind:scale={qtyScale}
				bind:scaleNum
			/>

			<RecipeCardTitleBlock
				slot="titleblock"
				{title}
				{frontmatter}
				thumbnailPath={parsedRecipe?.thumbnailPath}
				singleColumn={false}
			/>
		</RecipeCardSplitSteps>
	{/if}
</div>

<style>
	.container {
		position: relative;
		top: 0;
		left: 0;
		right: 0;
		height: 100%;
		width: 100%;
		display: block;
	}

	/* Hide strange mobile frontmatter stuff */
	:global(.recipe-card div:has(> .frontmatter-section)) {
		display: none;
	}
</style>
