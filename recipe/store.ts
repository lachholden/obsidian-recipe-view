import { writable } from "svelte/store";
import RecipeViewPlugin from "main";

const plugin = writable<RecipeViewPlugin>();
export default { plugin };