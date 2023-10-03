<script lang="ts">
	import { ParsedRecipeComponent } from "./parsing";

	export let sections: Array<Array<ParsedRecipeComponent>>;
</script>

<div class="recipe-card one-column">
	<div class="split-step split-step-title">
		<div class="column column-main">
			<slot name="titleblock" />
			<slot name="scaleselector" />
		</div>
	</div>
	{#if sections}
		{#each sections as section}
			<div class="split-step" class:only-step={sections.length == 1}>
				<div class="column column-main">
					{#each section as c (c)}
						<svelte:component
							this={c.type}
							{...c.props}
							bullets={true}
						/>
					{/each}
				</div>
			</div>
		{/each}
	{/if}
</div>

<style>
	.split-step {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.column {
		padding: var(--file-margins);
		max-height: 100%;
		overflow: scroll;
	}

	.split-step:nth-child(even) {
		background-color: var(--background-secondary);
	}
	.split-step.only-step {
		background-color: var(--background-primary) !important;
	}

	.column-main {
		flex-basis: var(--file-line-width);
		flex-grow: 0;
		flex-shrink: 1;
	}
</style>
