<script lang="ts">
	import RecipeLeaf from "./RecipeLeaf.svelte";

	export let list: HTMLUListElement;
	export let bullets: boolean;

	function isChecked(index: number): boolean {
		return (
			list.children.item(index)?.getAttr("data-checked") == "true" ||
			false
		);
	}

	function changeChecked(index: number, e: Event) {
		list.children
			.item(index)
			?.setAttr(
				"data-checked",
				(e.target as HTMLInputElement).checked ? "true" : "false"
			);
	}

	function itemAt(index: number): HTMLElement {
		return (list.children.item(index) as HTMLLIElement)!;
	}
</script>

<div>
	<ul class:bullets>
		{#each list.children as _, i}
			<li>
				<label>
					<!-- Persist checkbox state on component re-construction by setting
				data-checked on the underlying LI element from the rendered markdown.
				-->
					<input
						type="checkbox"
						checked={isChecked(i)}
						on:change={(e) => changeChecked(i, e)}
					/>
					<div class="leaf">
						<RecipeLeaf childNodesOf={itemAt(i)} asTag="div" />
					</div>
				</label>
			</li>
		{/each}
	</ul>
</div>

<style>
	ul {
		padding-inline-start: 0;
	}

	input[type="checkbox"] {
		opacity: 0;
		position: absolute;
		margin: 0;
		padding: 0;
	}

	label {
		position: relative;
	}

	input[type="checkbox"]:checked ~ .leaf {
		color: var(--text-muted);
		text-decoration: line-through;
	}

	input[type="checkbox"]:focus ~ .leaf {
		color: var(--text-accent-hover);
	}

	ul > li {
		list-style-type: none;
		margin-block: var(--list-spacing);
	}

	ul.bullets > li {
		list-style-type: square;
		margin-inline-start: var(--list-indent);
	}
</style>
