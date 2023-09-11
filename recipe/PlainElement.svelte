<script lang="ts">
	export let element: Element;
	let div: HTMLElement;

	$: div?.appendChild(element);
</script>

<div bind:this={div} />
