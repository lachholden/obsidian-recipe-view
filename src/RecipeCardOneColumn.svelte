<script lang="ts">
	import { ParsedRecipeComponent } from "./parsing";

	export let sections: Array<Array<ParsedRecipeComponent>>;
</script>

<div class="recipe-card one-column">
	<div class="split-step split-step-title">
		<div class="column column-main column-title">
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
		padding-block: var(--size-4-4);
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

	.column-main {
		flex-basis: var(--file-line-width);
		flex-grow: 0;
		flex-shrink: 1;
	}
	.column {
		padding-inline: var(--file-margins);
	}
	.column-title {
		padding-bottom: 0;
	}
</style>
