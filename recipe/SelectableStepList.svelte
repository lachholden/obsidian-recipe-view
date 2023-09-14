<script lang="ts">
	import RecipeLeaf from "./RecipeLeaf.svelte";

	export let steps: HTMLCollection | Array<HTMLElement>;
	export let kind: string;

	let selected = null;
</script>

{#if kind == "ol"}
	<!-- means steps is the children of an OL element -->
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
{:else if kind == "p"}
	<!-- means steps is an array of P elements -->
	{#each steps as _, i}
		<p
			class:selected={selected == i}
			on:click={(e) => (selected = selected == i ? null : i)}
		>
			<RecipeLeaf childNodes={steps[i].childNodes} qtyParseAll={false} />
		</p>
	{/each}
{/if}

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

	p {
		padding: var(--size-4-2);
		margin-inline: calc(-1 * var(--size-4-2));
		margin-block: calc(var(--p-spacing) - 2 * var(--size-4-2));
	}

	ol > li.selected,
	p.selected {
		background-color: hsla(
			var(--accent-h),
			var(--accent-s),
			var(--accent-l),
			var(--selected-step-alpha)
		);
		border-radius: var(--radius-m);
	}
</style>
