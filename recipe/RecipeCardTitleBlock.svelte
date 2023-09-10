<script lang="ts">
	export let thumbnailPath: string | undefined;
	export let title: string;
	export let frontmatter: object;

	function formatFrontmatterValue(key: string, value: any) {
		// See if it's a URL
		try {
			let url = new URL(value);
			return createEl("a", {
				href: url.toString(),
				text: url.host,
			}).outerHTML;
		} catch (e) {}

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
		return value;
	}
</script>

<div class="title-block">
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
					<span class="frontmatter-entry">
						<span class="key">{key}</span>
						<span class="value">
							{@html formatFrontmatterValue(key, value)}
						</span>
					</span>
				{/each}
			{/if}
		</div>
	</div>
</div>

<style>
	.title-block {
		display: flex;
		flex-direction: row;
	}
	h1 {
		margin-top: 0;
		display: inline-block;
		word-wrap: break-word;
	}
	img.thumbnail {
		height: 100px;
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
	.frontmatter-entry {
		display: inline-block;
		font-size: var(--font-small);
	}
	.key {
		color: var(--text-accent);
		padding-right: var(--size-4-1);
		font-weight: 500;
	}

	@media (max-width: 600px) {
		.title-block {
			flex-direction: column;
			justify-content: start;
			align-items: start;
		}
		img.thumbnail {
			margin-bottom: var(--size-4-4);
		}
	}
</style>
