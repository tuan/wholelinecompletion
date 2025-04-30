# Whole Line Completion

This extension shows lines that match the current word. The lines are sourced from visited files in the session.

## Extension Settings

You can bind a keyboard shortcut to this `wholelinecompletion.triggerSuggest`.

## Known Issues

When you close a file, you might still get suggestions from that file after a while until VSCode actually closes this file. Not exactly sure what's the logic that VSCode uses, but the event that is triggered when a document is closed is not fired immediately.
