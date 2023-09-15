<script lang="ts">
	import RecipeLeaf from "./RecipeLeaf.svelte";

	export let items: HTMLCollection;
	export let bullets: boolean;

	let checked: boolean[] = [];
</script>

<ul class:bullets>
	{#each items as _, i}
		<li
			class:checked={checked[i]}
			on:click={(e) => (checked[i] = !checked[i])}
		>
			<RecipeLeaf
				childNodes={items.item(i).childNodes}
				qtyParseAll={true}
			/>
		</li>
	{/each}
</ul>

<style>
	ul {
		padding-inline-start: 0;
	}

	ul > li {
		margin-top: var(--size-4-2);
		list-style-type: none;
	}

	ul.bullets {
		padding-inline-start: var(--list-indent);
	}

	ul.bullets > li {
		list-style-type: square;
		list-style-position: outside;
		padding-inline: var(--size-4-2);
		margin-left: calc(-1 * var(--size-4-2));
	}

	ul > li.checked {
		color: var(--text-muted);
		text-decoration: line-through;
	}
</style>
