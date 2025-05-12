from datetime import date

project = "zhwdailysummarizer"
copyright = f"{date.today().year}, Zapier"  #  pylint: disable=redefined-builtin
author = "Zapier"

extensions = ["recommonmark", "sphinx_markdown_tables"]
exclude_patterns = ["_build", "Thumbs.db", ".DS_Store"]

html_theme = "sphinx_rtd_theme"
html_context = {
    "display_gitlab": True,
    "gitlab_user": "zapier",
    "gitlab_repo": "zhwdailysummarizer",
    "gitlab_version": "main/docs/",
}
