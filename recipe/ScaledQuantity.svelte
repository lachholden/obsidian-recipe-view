<script lang="ts">
	import { Writable } from "svelte/store";

	export let number: string;
	export let unit: string;
	export let qtyScaleScore;

	export let scale: number = 1.0;
	qtyScaleScore.subscribe((s) => (scale = s));
</script>

<span class:scaled={scale != 1.0}
	><span class="scale-number">{scale}x {number}</span>{#if unit}
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
