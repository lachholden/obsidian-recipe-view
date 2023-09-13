<script lang="ts">
	import RecipeLeaf from "./RecipeLeaf.svelte";

	export let items: HTMLCollection;

	let checked: boolean[] = [];
</script>

<ul>
	{#each items as _, i}
		<li
			class:checked={checked[i]}
			on:click={(e) => (checked[i] = !checked[i])}
		>
			<RecipeLeaf parent={items.item(i)} qtyParseAll={true} />
		</li>
	{/each}
</ul>

<style>
	ul {
		padding-inline-start: 0;
	}

	ul > li {
		margin-top: var(--size-4-2);
		list-style: none;
	}

	ul > li.checked {
		color: var(--text-muted);
		text-decoration: line-through;
	}
</style>
