<script lang="ts">
	import RecipeLeaf from "./RecipeLeaf.svelte";

	export let steps: HTMLCollection;

	let selected = null;
</script>

<ol class="recipe-mutex-select">
	{#each steps as _, i}
		<li
			class:selected={selected == i}
			on:click={(e) => (selected = selected == i ? null : i)}
		>
			<RecipeLeaf
				childNodes={steps.item(i).childNodes}
				qtyParseAll={false}
			/>
		</li>
	{/each}
</ol>

<style>
	ol {
		counter-reset: step;
		list-style-position: outside;
	}

	ol > li {
		padding: var(--size-4-2);
		margin-left: calc(-1 * var(--size-4-2));
		counter-increment: step;
	}

	ol > li::marker {
		color: var(--text-accent);
		content: counter(step) " ";
	}

	:global(ol.recipe-mutex-select p) {
		margin: 0;
	}

	ol > li.selected {
		background-color: hsla(
			var(--accent-h),
			var(--accent-s),
			var(--accent-l),
			var(--selected-step-alpha)
		);
		border-radius: var(--radius-m);
	}
</style>
