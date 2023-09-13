<script lang="ts">
	import { onMount } from "svelte";
	import ScaledQuantity from "./ScaledQuantity.svelte";
	import { QUANTITY } from "./qty-scale";

	export let element: HTMLElement | undefined;
	export let childNodes: NodeListOf<ChildNode> | undefined;
	export let qtyParseAll: boolean;
	let div: HTMLDivElement;

	let scaleComponents = [];

	function parseForQty(n: Node) {
		if (n.nodeType == Node.ELEMENT_NODE) {
			if (
				(n as HTMLElement).hasAttribute("data-qty") ||
				(n as HTMLElement).hasAttribute("data-qty-no-parse")
			) {
				return;
			}
		}

		if (n.nodeType == Node.TEXT_NODE) {
			let parent = n.parentNode!;
			// n.parentNode!.removeChild(n);
			let currentIndex = 0;
			console.log(n.textContent);
			for (let match of n.textContent!.matchAll(QUANTITY)) {
				console.log(match);
				parent.insertBefore(
					document.createTextNode(
						n.textContent!.slice(currentIndex, match.index)
					),
					n
				);
				let qtyTarget = createEl("span");
				qtyTarget.setAttribute("data-qty", "true");
				parent.insertBefore(qtyTarget, n);
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
			parent.insertBefore(
				document.createTextNode(n.textContent!.slice(currentIndex)),
				n
			);
			parent.removeChild(n);
		}

		if (n.hasChildNodes()) {
			Array.from(n.childNodes).forEach((c) => parseForQty(c));
		}
	}

	onMount(() => {
		// Mount all child nodes in the component

		if (childNodes) {
			Array.from(childNodes).forEach((n) => {
				div.appendChild(n);
			});
		} else if (element) {
			div.appendChild(element);
		}

		// Walk all trees under elements with data-qty-parse to parse quantities
		if (qtyParseAll) parseForQty(div);
		div.querySelectorAll("[data-qty-parse]").forEach((root) => {
			parseForQty(root);
		});
	});
</script>

<div bind:this={div} />
