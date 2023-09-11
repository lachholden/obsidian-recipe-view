<script lang="ts">
	export let items: HTMLCollection;

	let checked = [];
	let lis = [];

	$: for (let i = 0; i < items.length; i++) {
		Array.from(items.item(i)?.childNodes).forEach((n) =>
			lis[i]?.appendChild(n)
		);
	}

	function toggleChecked(i) {
		checked[i] = !checked[i];
	}
</script>

<ul>
	{#each items as _, i}
		<li
			class:checked={checked[i]}
			on:click={(e) => toggleChecked(i)}
			bind:this={lis[i]}
		/>
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
