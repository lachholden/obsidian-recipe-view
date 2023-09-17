<script lang="ts">
	import RecipeLeaf from "./RecipeLeaf.svelte";

	export let items: HTMLCollection;
	export let bullets: boolean;
</script>

<ul class:bullets>
	{#each items as _, i}
		<li>
			<label>
				<input type="checkbox" />
				<div class="leaf">
					<RecipeLeaf
						childNodes={items.item(i).childNodes}
						qtyParseAll={true}
					/>
				</div>
			</label>
		</li>
	{/each}
</ul>

<style>
	ul {
		padding-inline-start: 0;
	}

	input[type="checkbox"] {
		opacity: 0;
		position: absolute;
	}

	label {
		position: relative;
	}

	input[type="checkbox"]:checked ~ .leaf {
		color: var(--text-muted);
		text-decoration: line-through;
	}

	input[type="checkbox"]:focus ~ .leaf {
		/* background-color: var(--color-base-30) !important; */
		color: var(--text-accent-hover);
	}

	ul > li {
		margin-top: var(--size-4-2);
		list-style-type: none;
	}

	ul.bullets {
		padding-inline-start: var(--list-indent);
	}

	ul.bullets > li {
		list-style-type: square;
		list-style-position: outside;
		padding-inline: var(--size-4-2);
		margin-left: calc(-1 * var(--size-4-2));
	}
</style>
