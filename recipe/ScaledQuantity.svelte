<script lang="ts">
	import { Writable } from "svelte/store";

	export let numberValue: number;
	export let unit: string;
	export let qtyScaleStore;

	export let scale: number = 1.0;
	qtyScaleStore.subscribe((s) => (scale = s));
</script>

<span class:scaled={scale != 1.0}
	><span class="scale-number">{scale * numberValue}</span>{#if unit}
		<span class="scale-unit">&nbsp;{unit}</span>{/if}</span
>

<style>
	.scaled {
		background-color: hsla(
			var(--accent-h),
			var(--accent-s),
			var(--accent-l),
			20%
		);
		border-radius: var(--radius-s);
	}
</style>
