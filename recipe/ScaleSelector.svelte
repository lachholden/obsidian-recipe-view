<script lang="ts">
	import Fraction from "fraction.js";

	export let scaleNum: number = 1.0;
	export let scale = new Fraction(1);
	$: scale = new Fraction(scaleNum || 1);
</script>

<div>
	<label>Scale recipe <input type="number" bind:value={scaleNum} /></label>
</div>

<style>
	div {
		width: 100%;
		text-align: center;
		font-size: var(--font-smaller);
		background-color: var(--background-secondary);
		padding: var(--size-4-2);
		border-radius: var(--radius-s);
		color: var(--text-muted);
	}

	input {
		width: var(--size-4-16);
		border: none;
		background-color: hsla(
			var(--accent-h),
			var(--accent-s),
			var(--accent-l),
			20%
		);
		margin-inline-start: var(--size-4-2);
		text-align: right;
		font-size: var(--font-smaller);
	}

	label {
		margin-right: calc(-1 * var(--size-4-2));
	}

	label::after {
		content: "×";
		position: relative;
		width: var(--size-4-4);
		right: calc(var(--size-4-16) - var(--size-4-2));
		color: var(--text-accent);
	}
</style>
