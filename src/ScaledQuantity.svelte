<script lang="ts">
	import { QtyFormatType, formatQuantity } from "./quantities";
	import Fraction from "fraction.js";
	import store from "./store";
	import RecipeViewPlugin from "./main";

	export let value: Fraction;
	export let format: QtyFormatType;
	export let unit: string;
	export let qtyScaleStore;

	export let scale: Fraction = new Fraction(1);
	qtyScaleStore.subscribe((s) => (scale = s));

	let plugin: RecipeViewPlugin;
	store.plugin.subscribe((p) => (plugin = p));
</script>

<span class:scaled={!scale?.equals(1) || false}
	><span class="scale-number"
		>{formatQuantity(
			value,
			format,
			scale,
			plugin.settings.renderUnicodeFractions
		)}</span
	>{#if unit}
		<span class="scale-unit">&nbsp;{unit}</span>{/if}</span
>

<style>
	.scaled {
		text-decoration-line: underline;
		text-decoration-thickness: 1px;
		text-decoration-color: var(--text-accent);
		text-underline-offset: 4px;
	}
</style>
