<script lang="ts">
	import { onMount, onDestroy, getContext } from "svelte";

	export let childNodesOf: HTMLElement;
	export let asTag: string;

	let root: HTMLElement;

	// We just borrow the original node's children, and return them when we're done
	onMount(() => {
		Array.from(childNodesOf.childNodes).forEach((node) => {
			root.appendChild(node);
		});

		return () => {
			console.log("Returning children of ", childNodesOf);
			if (root)
				Array.from(root.childNodes).forEach((node) => {
					childNodesOf.appendChild(node);
				});
		};
	});
</script>

<svelte:element this={asTag} bind:this={root} />
