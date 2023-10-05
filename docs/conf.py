# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = "Obsidian Recipe View"
copyright = "2023, Lachlan Holden"
author = "Lachlan Holden"

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = ["sphinx.ext.autosectionlabel"]

templates_path = ["_templates"]
exclude_patterns = []


# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = "alabaster"
html_static_path = ["_static"]
html_theme_options = {
    "description": "Bring Obsidian with you into the kitchen.",
    "fixed_sidebar": "true",
    "github_user": "lachholden",
    "github_repo": "obsidian-recipe-view",
    "github_button": "true",
    "github_type": "star",
    "show_related": "true",
    "show_relbars": "true",
}
