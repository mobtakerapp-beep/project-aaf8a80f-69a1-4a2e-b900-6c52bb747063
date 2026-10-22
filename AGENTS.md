<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep museum text and attribution in `src/content.ts`, separate from existing Three.js scenes, so content edits cannot change scene geometry or motion.
- Use the shared OptionalImage component for user-supplied ministry and character artwork so absent files collapse without broken-image frames.
- Shuffle quiz options through the pure quiz helper while retaining each original correct-answer index, so presentation order never changes correctness.
