# Distinguishing similar agent names

Catalogue row/grid cards, collection cards/picker, sidebar entries and global search show stable IDs and input-field context for agents with overlapping titles. Full matched names wrap rather than relying on hover. Context comes from existing definitions: no agent names, prompts, providers or IDs change, and no model is called.

The comparison is advisory. Equal normalized titles match; otherwise at least two non-generic title tokens, two thirds of the smaller token set and half the combined set must overlap. Generic words such as “agent” and “AI” are ignored for token overlap; simple plurals are normalized. A title match does not establish duplicate capabilities, semantic similarity or workflow stages. Matches can be missed; inspect descriptions and input definitions before changing the catalogue.

Distinct fields are input definitions absent from every matched agent; otherwise the current input fields are shown. Missing input metadata is labelled explicitly. Compact lists show the first match and an additional-count hint; grid cards show up to three. The maintainer report includes all matches and their original IDs:

```sh
node scripts/report-similar-agent-names.mjs > similar-agent-names.json
```

This report is advisory and exits successfully for legitimate variants. It does not remove or rename entries or gate CI on a fuzzy heuristic. Review pairs manually.
