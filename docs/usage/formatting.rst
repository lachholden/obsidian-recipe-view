Formatting your recipes
=======================

The plugin is designed to not enforce any kind of strict format on your recipe notes, and should handle lots of different methods gracefully. That said, a suggested standard format to work best with this plugin is:

.. code-block:: markdown

  ![[thumbnail.jpg]]

  Any preamble can go here.

  ## Ingredients
  **Section 1**
  - bulleted lists
  - quantities at the start, e.g.:
  - 180 grams butter
  - 3 eggs

  **Another section**
  - Feel free to split your ingredients up
  - and add notes underneath
  - You don't need any bold headings if you don't want
  - 15 of [[Another recipe]], pre-made

  ## Directions
  1. Numbered lists
  2. Feel free to include any markdown you like in your steps
  3. You can also split these up in sections, with bold or level 3+ headings

  ## Notes
  Anything else you want can go here.

  ## Nutrition
  Common when recipes are downloaded from the web


Feel free to adapt the suggested format however you like though – and if there's a certain style you prefer that does not work well with the plugin currently, create an issue with an example recipe.


Formatting rules applied
************************

* Configure in the plugin settings which sections you want to be pulled into the side column, based on their headings – the default is `Ingredients|Nutrition`.
* Any bulleted lists in the side column *or* that appear before any heading will be converted into checkable ingredient lists – just click items to cross them out.
    * After focusing an ingredient (e.g. by clicking, tabbing) you can also use Tab and Shift+Tab to change the highlighted ingredient and Space to toggle crossing it out.
    * Click or tab elsewhere to stop highlighting the last-changed ingredient.
* Any numbered lists or sequences of paragraphs in the main column will let you click on a step to highlight it. Click a different step to move the highlight.
    * After focusing a group of steps (e.g. by clicking, tabbing) you can also use the arrow keys to move the selected step.
* The first image in your note that is not under a heading is pulled out as a thumbnail. All properties/front matter fields in your note are displayed under the title.