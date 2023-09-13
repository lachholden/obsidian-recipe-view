<script lang="ts">
	export let number: string;
	export let unit: string;
</script>

<span class:scaled={scale != 1.0}
	><span class="scale-number">{number}</span>{#if unit}
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
