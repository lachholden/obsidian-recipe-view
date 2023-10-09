<script lang="ts">
	import { ParsedRecipeComponent } from "./parsing";
	export let sideColumnComponents: Array<ParsedRecipeComponent>;
	export let mainColumnSections: Array<Array<ParsedRecipeComponent>>;
</script>

<div class="recipe-card two-column">
	{#if sideColumnComponents.length > 0}
		<div class="column column-side">
			<slot name="scaleselector" />
			{#each sideColumnComponents as c}
				<svelte:component this={c.type} {...c.props} />
			{/each}
		</div>
	{/if}
	<div class="column column-main">
		<slot name="titleblock" />
		{#if sideColumnComponents?.length == 0}
			<slot name="scaleselector" />
		{/if}
		{#each mainColumnSections as mainColumnComponents}
			<div
				class="split-step"
				class:only-step={mainColumnSections.length == 1}
			>
				{#each mainColumnComponents as c}
					<svelte:component this={c.type} {...c.props} />
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	.recipe-card {
		display: flex;
		flex-direction: row;
		align-items: stretch;
		justify-content: center;
		height: 100%;
		overflow: clip;
		position: relative;
		top: 0;
		left: 0;
	}

	.column {
		padding: var(--file-margins);
		max-height: 100%;
		overflow: scroll;
	}

	.column:empty {
		display: none;
	}

	.column-side {
		flex-basis: calc(var(--file-line-width) / 2);
		flex-grow: 0;
		flex-shrink: 1;
	}

	.column-main {
		flex-basis: var(--file-line-width);
		flex-grow: 0;
		flex-shrink: 1;
	}

	.split-step {
		padding-inline: var(--file-margins);
		margin-inline: calc(-1 * var(--file-margins));
	}

	.split-step:nth-child(odd) {
		background-color: var(--background-secondary);
	}

	.split-step.only-step {
		background-color: transparent !important;
	}
</style>
