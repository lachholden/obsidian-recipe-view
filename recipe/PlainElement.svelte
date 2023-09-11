<script lang="ts">
	export let element: Element;
	let div: HTMLElement;

	$: div?.appendChild(element.cloneNode(true));
</script>

<div bind:this={div} />
