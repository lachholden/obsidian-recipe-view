<script lang="ts">
	import { get } from "svelte/store";
	import RecipeLeaf from "./RecipeLeaf.svelte";
	import { counter } from "./store";

	export let steps: HTMLCollection | Array<HTMLElement>;
	export let kind: string;
	let name = `selectable-steps-${get(counter)}`;
	counter.update((n) => n + 1);
</script>

{#if kind == "ol"}
	<!-- means steps is the children of an OL element -->
	<ol class="recipe-mutex-select">
		{#each steps as _, i}
			<li>
				<label>
					<input type="radio" {name} />
					<div class="leaf">
						<RecipeLeaf
							childNodes={steps.item(i).childNodes}
							qtyParseAll={false}
						/>
					</div>
				</label>
			</li>
		{/each}
		<input type="radio" {name} />
	</ol>
{:else if kind == "p"}
	<!-- means steps is an array of P elements -->
	{#each steps as _, i}
		<p>
			<label>
				<input
					type="radio"
					{name}
					on:focus={(e) => {
						console.log(e);
					}}
				/>
				<div class="leaf">
					<RecipeLeaf
						childNodes={steps[i].childNodes}
						qtyParseAll={false}
					/>
				</div>
			</label>
		</p>
	{/each}
	<input type="radio" {name} />
{/if}

<style>
	ol {
		counter-reset: step;
		list-style-position: outside;
	}

	input[type="radio"] {
		opacity: 0;
		position: absolute;
	}
	label {
		position: relative;
	}

	.leaf {
		border-radius: var(--radius-m);
		padding: var(--size-4-2);
	}

	input[type="radio"]:checked ~ .leaf {
		background-color: hsla(
			var(--accent-h),
			var(--accent-s),
			var(--accent-l),
			var(--selected-step-alpha)
		);
	}

	input[type="radio"]:focus ~ .leaf {
		box-shadow: inset 0px 0px 0px var(--border-width)
			var(--interactive-accent);
	}

	ol > li {
		margin-left: calc(-1 * var(--size-4-2));
		counter-increment: step;
	}

	ol > li::marker {
		color: var(--text-accent);
		content: counter(step) " ";
	}

	:global(ol.recipe-mutex-select p) {
		margin: 0;
	}

	p {
		margin-inline: calc(-1 * var(--size-4-2));
		margin-block: calc(var(--p-spacing) - 2 * var(--size-4-2));
	}
</style>
