<script lang="ts">
	import { onMount } from "svelte";

	export let childNodesOf: HTMLElement;
	export let asTag: string;

	let root: HTMLElement;

	// We just borrow the original node's children, and return them when we're done
	onMount(() => {
		Array.from(childNodesOf.childNodes).forEach((node) => {
			root.appendChild(node);
		});

		for (var dataAttr in childNodesOf.dataset) {
			root.setAttr("data-" + dataAttr, childNodesOf.dataset[dataAttr]!);
		}

		return () => {
			if (root)
				Array.from(root.childNodes).forEach((node) => {
					childNodesOf.appendChild(node);
				});
		};
	});
</script>

<div>
	<svelte:element this={asTag} bind:this={root} class="recipe-leaf" />
</div>
