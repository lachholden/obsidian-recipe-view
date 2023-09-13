<script lang="ts">
	import { QtyFormatType, formatQuantity } from "./quantities";
	import Fraction from "fraction.js";

	export let value: Fraction;
	export let format: QtyFormatType;
	export let unit: string;
	export let qtyScaleStore;

	export let scale: Fraction = new Fraction(1);
	qtyScaleStore.subscribe((s) => (scale = s));
</script>

<span class:scaled={!scale.equals(1)}
	><span class="scale-number">{formatQuantity(value, format, scale)}</span
	>{#if unit}
		<span class="scale-unit">&nbsp;{unit}</span>{/if}</span
>

<style>
	.scaled {
		text-decoration: underline var(--text-accent) 1px;
		text-underline-offset: 4px;
	}
</style>
