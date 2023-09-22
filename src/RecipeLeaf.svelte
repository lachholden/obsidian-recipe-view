<script lang="ts">
	import { onMount, onDestroy, getContext } from "svelte";
	import ScaledQuantity from "./ScaledQuantity.svelte";
	import { deUnicodeFractions, matchQuantities } from "./quantities";

	export let element: HTMLElement | undefined;
	export let childrenOf: HTMLElement | undefined;
	export let qtyParseAll: boolean;
	let div: HTMLDivElement;
	let elementParent;

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
			n.textContent = deUnicodeFractions(n.textContent!);
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
							value: match.value.value,
							format: match.value.format,
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

	$: if (div) {
		div.childNodes.forEach((n) => div.removeChild(n));
		if (childrenOf) {
			Array.from(childrenOf.childNodes).forEach((n) => {
				div.appendChild(n.cloneNode(true));
			});
		} else if (element) {
			div.appendChild(element.cloneNode(true));
		}
	}
</script>

<div bind:this={div} />
