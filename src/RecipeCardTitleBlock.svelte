<script lang="ts">
	export let thumbnailPath: string | undefined;
	export let title: string;
	export let frontmatter: object;
	export let singleColumn: boolean;

	function formatFrontmatterValue(key: string, value: any) {
		// See if it's a URL
		try {
			let url = new URL(value);
			return createEl("a", {
				href: url.toString(),
				text: url.host,
			}).outerHTML;
		} catch (e) {
			/* empty */
		}

		// See if it's tags
		if (key == "tags") {
			return value
				.map((tag: string) => {
					let a = createEl("a", {
						cls: "tag",
						href: "#" + tag,
						text: "#" + tag,
					});
					a.setAttribute("target", "_blank");
					a.setAttribute("rel", "noopener");
					return a.outerHTML;
				})
				.join(" ");
		}

		if (typeof value === "string" || value instanceof String) {
			return value;
		}

		return undefined;
	}
</script>

<div class="title-block" class:single-column={singleColumn}>
	{#if thumbnailPath}
		<img
			class="thumbnail"
			src={thumbnailPath}
			alt="Thumbnail for {title} recipe"
		/>
	{/if}
	<div class="metadata">
		<div class="inline-title">{title}</div>
		<div class="frontmatter">
			{#if frontmatter}
				{#each Object.entries(frontmatter) as [key, value]}
					{#if formatFrontmatterValue(key, value)}
						<span class="title-block-property">
							<span class="key" data-property-key={key}
								>{key}</span
							>
							<span class="value" data-property-value={value}>
								<!-- eslint-disable -->
								{@html formatFrontmatterValue(key, value)}
							</span>
						</span>
					{/if}
				{/each}
			{/if}
		</div>
	</div>
</div>

<style>
	.title-block {
		display: flex;
		flex-direction: row;
		margin-block-end: var(--size-4-8);
	}
	img.thumbnail {
		height: var(--thumbnail-size);
		width: var(--thumbnail-size);
		object-fit: cover;
		flex: 0 0 var(--thumbnail-size);
		margin-inline-end: var(--size-4-4);
		border-radius: var(--radius-s);
	}
	.frontmatter {
		display: flex;
		flex-direction: flex-row;
		flex-wrap: wrap;
		justify-content: start;
		gap: var(--size-2-1) var(--size-4-4);
	}
	.title-block-property {
		display: inline-block;
		font-size: var(--font-small);
	}
	.key {
		color: var(--text-accent);
		padding-right: var(--size-4-1);
		font-weight: 500;
	}

	/* Single-column layout */
	.single-column.title-block {
		flex-direction: column;
		justify-content: start;
		align-items: start;
	}
	.single-column img.thumbnail {
		margin-bottom: var(--size-4-4);
	}
</style>
