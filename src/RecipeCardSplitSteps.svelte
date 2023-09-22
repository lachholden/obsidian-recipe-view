<script lang="ts">
	export let sections;
</script>

<div class="recipe-card split-steps">
	<div class="split-step split-step-title">
		<div class="column column-side" />
		<div class="column column-main">
			<slot name="titleblock" />
			<slot name="scaleselector" />
		</div>
	</div>
	{#if sections}
		{#each sections as section}
			<div class="split-step">
				<div class="column column-side">
					<div class="column-content">
						{#each section.sideComponents as c (c)}
							<svelte:component this={c.type} {...c.props} />
						{/each}
					</div>
				</div>
				<div class="column column-main">
					<div class="column-content">
						{#each section.mainComponents as c (c)}
							<svelte:component this={c.type} {...c.props} />
						{/each}
					</div>
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
		align-items: stretch;
	}

	.split-step:nth-child(even) {
		background-color: var(--background-secondary);
	}

	.column {
		padding: calc(var(--file-margins) / 2);
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

	.column-content {
		position: -webkit-sticky;
		position: sticky;
		top: calc(var(--file-margins) / 2);
	}
</style>
