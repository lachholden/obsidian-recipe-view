<script lang="ts">
	import RecipeLeaf from "./RecipeLeaf.svelte";

	export let list: HTMLUListElement;
	export let bullets: boolean;
</script>

<ul class:bullets>
	{#each list.children as _, i}
		<li>
			<label>
				<!-- Persist checkbox state on component re-construction by setting
				data-checked on the underlying LI element from the rendered markdown.
				-->
				<input
					type="checkbox"
					checked={list.children.item(i).getAttr("data-checked") ==
						"true"}
					on:change={(e) =>
						list.children
							.item(i)
							.setAttr(
								"data-checked",
								e.target.checked ? "true" : "false"
							)}
				/>
				<div class="leaf">
					<RecipeLeaf
						childNodesOf={list.children.item(i)}
						asTag="div"
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
