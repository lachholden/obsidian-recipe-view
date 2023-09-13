<script lang="ts">
	import { onMount } from "svelte";
	import ScaledQuantity from "./ScaledQuantity.svelte";
	import { QUANTITY } from "./qty-scale";

	export let parent: HTMLElement;
	export let qtyParseAll: boolean;
	let div: HTMLDivElement;

	let scaleComponents = [];

	function parseForQty(n: Node) {
		if (n.nodeType == Node.ELEMENT_NODE) {
			if ((n as HTMLElement).hasAttribute("data-qty")) {
				return;
			}
		}

		if (n.nodeType == Node.TEXT_NODE) {
			let parent = n.parentNode!;
			n.parentNode!.removeChild(n);
			let currentIndex = 0;
			for (let match of n.textContent!.matchAll(QUANTITY)) {
				console.log(match);
				parent.appendText(
					n.textContent!.slice(currentIndex, match.index)
				);
				let qtyTarget = createEl("span");
				qtyTarget.setAttribute("data-qty", "true");
				parent.appendChild(qtyTarget);
				scaleComponents.push(
					new ScaledQuantity({
						target: qtyTarget,
						props: {
							number:
								match.groups?.number ||
								match.groups?.startnumber,
							unit: match.groups!.unit,
						},
					})
				);
				currentIndex = match.index + match[0].length;
			}
			parent.appendText(n.textContent!.slice(currentIndex));
		}

		if (n.hasChildNodes()) {
			Array.from(n.childNodes).forEach((c) => parseForQty(c));
		}
	}

	onMount(() => {
		// Mount all child nodes in the component
		Array.from(parent.childNodes).forEach((n) => {
			div.appendChild(n);
		});

		// Walk all trees under elements with data-qty-parse to parse quantities
		if (div.matches("[data-qty-parse]")) parseForQty(div);
		div.querySelectorAll("[data-qty-parse]").forEach((root) => {
			parseForQty(root);
		});
	});
</script>

<div bind:this={div} data-qty-parse={qtyParseAll} />
