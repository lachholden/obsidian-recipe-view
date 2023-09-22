<script lang="ts">
	import { onMount, onDestroy, getContext } from "svelte";
	import ScaledQuantity from "./ScaledQuantity.svelte";
	import { deUnicodeFractions, matchQuantities } from "./quantities";

	export let childNodesOf: HTMLElement;
	export let asTag: string;
	export let qtyParseAll: boolean = false;

	let root: HTMLElement;

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
				new ScaledQuantity({
					target: qtyTarget,
					props: {
						value: match.value.value,
						format: match.value.format,
						unit: match.unit,
						qtyScaleStore: qtyScaleStore,
					},
				});
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

	// We just borrow the original node's children, and return them when we're done
	onMount(() => {
		Array.from(childNodesOf.childNodes).forEach((node) => {
			root.appendChild(node);
		});
		if (qtyParseAll) {
			parseForQty(root, qtyScaleStore);
		} else {
			Array.from(root.querySelectorAll("[data-qty-parse]")).forEach(
				(node) => {
					parseForQty(node, qtyScaleStore);
				}
			);
		}
	});

	onDestroy(() => {
		if (root)
			Array.from(root.childNodes).forEach((node) => {
				childNodesOf.appendChild(node);
			});
	});
</script>

<svelte:element this={asTag} bind:this={root} />
