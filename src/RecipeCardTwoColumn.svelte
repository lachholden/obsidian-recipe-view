<script lang="ts">
	import { ParsedRecipeComponent } from "./parsing";
	export let sideColumnComponents: Array<ParsedRecipeComponent>;
	export let mainColumnComponents: Array<ParsedRecipeComponent>;
</script>

<div class="recipe-card two-column">
	{#if sideColumnComponents.length > 0}
		<div class="column column-side">
			<slot name="scaleselector" />
			{#each sideColumnComponents as c (c)}
				<svelte:component this={c.type} {...c.props} />
			{/each}
		</div>
	{/if}
	<div class="column column-main">
		<slot name="titleblock" />
		{#if sideColumnComponents?.length == 0}
			<slot name="scaleselector" />
		{/if}
		{#each mainColumnComponents as c (c)}
			<svelte:component this={c.type} {...c.props} />
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
</style>
