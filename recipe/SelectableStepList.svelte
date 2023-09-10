<script lang="ts">
	import PlainElement from "./PlainElement.svelte";

	export let ol: HTMLElement;

	let steps = [];
	let selected = null;

	for (let i = 0; i < ol.children.length; i++) {
		// Can't convert element to string, or SVG like in callout icons
		// gets magicked away. Instead, add a class to the "inner" li so
		// that we can hide the duplicate number. Pretty hacky, but I couldn't
		// find a way to e.g. change the <li> to <div> but keep the contents
		// the same without stringifying, and JS is a nightmare :)
		steps.push(ol.children.item(i));
		steps[i]?.addClass("inner-li");
	}
</script>

<ol class="recipe-mutex-select">
	{#each steps as step, i}
		<li
			class:selected={selected == i}
			on:click={(e) => (selected = selected == i ? null : i)}
		>
			<PlainElement element={steps[i]} />
		</li>
	{/each}
</ol>

<style>
	ol {
		padding-inline: 0;
		counter-reset: step;
		list-style-position: outside;
	}

	ol > li {
		padding: var(--size-4-2);
		vertical-align: top;
		counter-increment: step;
	}

	ol > li::marker {
		color: var(--text-accent);
		content: counter(step) " ";
	}

	:global(ol.recipe-mutex-select p) {
		margin: 0;
	}

	:global(ol.recipe-mutex-select li.inner-li) {
		list-style-type: none;
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

	li li::marker {
		content: "";
	}
</style>
