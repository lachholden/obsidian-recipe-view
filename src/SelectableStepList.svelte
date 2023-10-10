<script lang="ts">
	import RecipeLeaf from "./RecipeLeaf.svelte";

	export let list: HTMLOListElement | Array<HTMLElement>;
	export let kind: string;
	export let radioName: string;

	function olChildren() {
		return (list as HTMLOListElement).children;
	}

	function olChild(index: number) {
		return olChildren().item(index)! as HTMLElement;
	}

	function pList() {
		return list as Array<HTMLElement>;
	}
</script>

{#if kind == "ol"}
	<!-- means steps is the children of an OL element -->
	<div>
		<ol class="recipe-mutex-select">
			{#each olChildren() as _, i}
				<li>
					<label>
						<input type="radio" name={radioName} />
						<div class="leaf">
							<RecipeLeaf childNodesOf={olChild(i)} asTag="div" />
						</div>
					</label>
				</li>
			{/each}
		</ol>
	</div>
{:else if kind == "p"}
	<!-- means steps is an array of P elements -->
	{#each pList() as p}
		<div>
			<p>
				<label>
					<input type="radio" name={radioName} />
					<div class="leaf">
						<RecipeLeaf childNodesOf={p} asTag="div" />
					</div>
				</label>
			</p>
		</div>
	{/each}
{/if}

<style>
	li {
		margin-block: var(--p-spacing);
	}

	input[type="radio"] {
		opacity: 0;
		position: absolute;
		height: 100%;
		width: 100%;
		margin: 0;
		padding: 0;
	}

	label {
		position: relative;
	}

	.leaf {
		border-radius: var(--radius-m);
		padding: var(--size-4-2);
		margin: calc(-1 * var(--size-4-2));
	}

	li .leaf {
		padding-inline-start: var(--list-indent);
		margin-inline-start: calc(-1 * var(--list-indent));
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
</style>
