import RecipeViewPlugin from "./main";
import RecipeLeaf from "./RecipeLeaf.svelte";
import CheckableIngredientList from "./CheckableIngredientList.svelte";
import SelectableStepList from "./SelectableStepList.svelte";

export function parseMarkdownDiv(plugin: RecipeViewPlugin, renderedMarkdownDiv: HTMLDivElement, radioName: string) {
    const result = {
        title: null,
        thumbnailPath: null,
        sections: [{
            containsHeader: false,
            sideComponents: [],
            mainComponents: [],
        }]
    };

    const sideColumnRegex = RegExp(plugin.settings.sideColumnRegex, "i");

    let currentSection = 0;
    let currentColumn = "mainComponents";

    let sendToSideUntilLevel = 7;
    for (let i = 0; i < renderedMarkdownDiv.children.length; i++) {
        const item = renderedMarkdownDiv.children.item(i)!;

        // Horizontal rules will create a new section
        if (item.nodeName == "HR") {
            result.sections.push({
                containsHeader: false,
                sideComponents: [],
                mainComponents: [],
            });
            currentSection++;
            continue; // Don't include the HR to be rendered
        }

        // Headers can change which column to send items to
        if (item.nodeName.match(/H[1-6]/)) {
            const headerLevel = parseInt(item.nodeName.at(1)!);
            if (
                plugin.settings.treatH1AsFilename &&
                headerLevel == 1 &&
                result.sections[currentSection].containsHeader == false
            ) {
                result.title = item?.textContent;
                continue;
            } else {
                result.sections[currentSection].containsHeader = true;
            }
            if (
                currentColumn == "mainComponents" &&
                item.textContent?.match(sideColumnRegex)
            ) {
                currentColumn = "sideComponents";
                sendToSideUntilLevel = headerLevel;
            } else if (
                currentColumn == "sideComponents" &&
                headerLevel <= sendToSideUntilLevel
            ) {
                currentColumn = "mainComponents";
                sendToSideUntilLevel = 7;
            }
        }

        // To stop margins from not collapsing below the title block,
        // get rid of the display: none frontmatter
        if (item.matches("pre.frontmatter")) {
            continue;
        }

        // Extract the first image as a thumbnail
        if (
            item.getElementsByTagName("IMG").length > 0 &&
            currentSection == 0 &&
            result.thumbnailPath == null &&
            !result.sections[0].containsHeader
        ) {
            result.thumbnailPath = item
                .getElementsByTagName("IMG")
                .item(0)
                .getAttribute("src");
            continue; // Don't send to either column
        }

        // If it's an unordered list, make it checkable if either:
        // 1. it's going to the sidebar, or
        // 2. we haven't seen a header yet
        if (
            item.nodeName == "UL" &&
            (currentColumn == "sideComponents" || !result.sections[currentSection].containsHeader)
        ) {
            result.sections[currentSection][currentColumn].push({
                type: CheckableIngredientList,
                props: { items: item.children, bullets: !result.sections[currentSection].containsHeader },
                origIndex: i,
            });
            continue;
        }

        // If we're sending an ordered list to the main column, then make it selectable
        if (item.nodeName == "OL" && currentColumn == "mainComponents") {
            result.sections[currentSection][currentColumn].push({
                type: SelectableStepList,
                props: {
                    steps: item.children,
                    radioName: radioName,
                    kind: "ol",
                },
                origIndex: i,
            });
            continue;
        }

        // If we're sending a paragraph to the main column, then make it selectable
        if (item.nodeName == "P" && currentColumn == "mainComponents") {
            let prev = result.sections[currentSection][currentColumn][result.sections[currentSection][currentColumn].length - 1];
            if (
                prev &&
                prev.type == SelectableStepList &&
                prev.props.kind == "p"
            ) {
                prev.props.steps.push(item);
            } else {
                result.sections[currentSection][currentColumn].push({
                    type: SelectableStepList,
                    props: {
                        steps: [item],
                        radioName: radioName,
                        kind: "p",
                    },
                    origIndex: i,
                });
            }
            continue;
        }

        // Add current item to current column
        result.sections[currentSection][currentColumn].push({
            type: RecipeLeaf,
            props: { element: item, qtyParseAll: false },
            origIndex: i,
        });
    }

    return result;
}