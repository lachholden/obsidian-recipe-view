Scaling ingredients
===================

.. image:: /_static/scaling.gif
   :width: 200

Easily scale the ingredient quantities in your recipes using the widget at the top of the recipe card. By default, it will scale detected quantities in :ref:`checkable ingredient lists<Checkable ingredient lists>` only. Numbers will be detected as quantities if either they are alone at the start of a bit of a text (e.g. "**1** egg" or "**2** dashes of brandy"), or if they are with a usual scaled cooking unit anywhere in text (e.g. "plus an extra **50 g** for dusting"). The number can be in any of the following formats:

* 450 g – an integer
* 1/4 tsp – a text fraction
* ½ cup – a unicode fraction
* 3.5 litres – a decimal number
* 2 3/4 sticks – a mixed text number
* 1¾ kg – a mixed unicode number (with or without space in between)
* 1-1/4 oz. – a mixed number separated by a dash (both text and unicode work)

Scaling display
***************

When rescaling, units will be displayed as either a decimal or a fraction based on what was used in the original, or if the original was an integer then a choice is made based on the unit used. All displayed fractions are presented as mixed numbers with the fraction part rounded to the nearest 1/16, and there is a setting to make them nicely rendered in unicode regardless of the input format. There does not need to be a space between the number and the unit, but all quantites will be rendered with a space. Likewise, any dashes in mixed numbers will be rendered as a space.

If the recipe is scaled, any quantities that have been adjusted will have an underline to make it clear what has and has not changed.

Manual control
**************

To scale certain quantities in other sections e.g. in the directions, wrap them like ``<span data-qty-parse>180 grams</span>``. You could also wrap a whole step in the same tags to parse all present quantities. In most recipes, quantities outside the ingredient lists don't need to be scaled, but an example where it is useful using these ``<span>`` tags is shown below.

.. image:: /_static/method_scaling.jpeg

In the markdown, step 3 looks like ``3. Meanwhile, in another small saucepan, scald the remaining <span data-qty-parse>1 cup milk (250 ml)</span>. Whisk the hot milk into the flour mixture.``

To stop a certain quantity from being scaled mistakenly, wrap it like ``<span data-qty-no-parse>30 centimetres</span>``.