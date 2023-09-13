<script lang="ts">
	export let scale = 1.0;
	export let number: string;
	export let unit: string;
</script>

<span class="scale-number">{number}</span>
{#if unit}<span class="scale-unit">{unit}</span>{/if}

<style>
	.scale-number {
		color: var(--color-orange);
		font-weight: bold;
	}

	.scale-unit {
		color: var(--color-orange);
	}
</style>
