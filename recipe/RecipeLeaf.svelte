<script lang="ts">
	import { onMount, getContext } from "svelte";
	import ScaledQuantity from "./ScaledQuantity.svelte";
	import { matchQuantities } from "./quantities";

	export let element: HTMLElement | undefined;
	export let childNodes: NodeListOf<ChildNode> | undefined;
	export let qtyParseAll: boolean;
	let div: HTMLDivElement;

	let scaleComponents = [];

	let qtyScaleStore = getContext("qtyScaleStore");

	function parseForQty(n: Node, qtyScaleStore) {
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
			for (let match of matchQuantities(n.textContent!)) {
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
							numberValue: match.numberValue,
							unit: match.unit,
							qtyScaleStore: qtyScaleStore,
						},
					})
				);
				currentIndex = match.index + match.length;
			}
			parent.insertBefore(
				document.createTextNode(n.textContent!.slice(currentIndex)),
				n
			);
			parent.removeChild(n);
		}

		if (n.hasChildNodes()) {
			Array.from(n.childNodes).forEach((c) =>
				parseForQty(c, qtyScaleStore)
			);
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
		if (qtyParseAll) parseForQty(div, qtyScaleStore);
		div.querySelectorAll("[data-qty-parse]").forEach((root) => {
			parseForQty(root, qtyScaleStore);
		});
	});
</script>

<div bind:this={div} />
