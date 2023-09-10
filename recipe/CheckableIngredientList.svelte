<script lang="ts">
	import PlainElement from "./PlainElement.svelte";

	export let ul: HTMLElement;
	let items = [];
	let checked = [];

	for (let i = 0; i < ul.children.length; i++) {
		items.push(ul.children.item(i)?.innerHTML);
		checked.push(false);
	}

	function toggleChecked(i) {
		checked[i] = !checked[i];
	}
</script>

<ul>
	{#each items as item, i}
		<li class:checked={checked[i]} on:click={(e) => toggleChecked(i)}>
			{@html items[i]}
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
