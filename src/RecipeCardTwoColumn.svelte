<script lang="ts">
	import { ParsedRecipeComponent } from "./parsing";
	export let sideColumnComponents: Array<ParsedRecipeComponent>;
	export let mainColumnSections: Array<Array<ParsedRecipeComponent>>;
</script>

<div class="recipe-card two-column">
	<div class="column column-side">
		<slot name="scaleselector" />
		{#each sideColumnComponents as c}
			<svelte:component this={c.type} {...c.props} />
		{/each}
	</div>
	<div class="column column-main">
		<div class="split-step split-step-title">
			<slot name="titleblock" />
		</div>
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
		right: 0;
		bottom: 0;
	}

	.column {
		padding: var(--file-margins);
		max-height: 100%;
		overflow-y: auto;
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
		padding-block: calc(var(--file-margins) / 2);
	}

	.split-step-title {
		background-color: transparent !important;
	}

	.split-step:nth-child(odd) {
		background-color: var(--background-secondary);
	}

	.split-step.only-step {
		background-color: transparent !important;
	}
</style>
