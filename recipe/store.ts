import { writable } from "svelte/store";
import RecipeViewPlugin from "main";

export const plugin = writable<RecipeViewPlugin>();
export const counter = writable(0);

export default { plugin, counter };