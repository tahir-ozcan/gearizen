# Gearizen Tool Audit Plan

This document outlines the steps used to audit and refactor every tool.

1. **Catalogue existing tools** – Review the `app/tools` directory and list each tool page/client pair.
2. **Check metadata** – Verify every `page.tsx` exports a complete `metadata` object with Open Graph fields.
3. **Inspect UI components** – Ensure each tool uses shared `Button`, `Input` and `Textarea` components from `components/` for consistency.
4. **Evaluate functionality** – Manually read through each client component to confirm it works without network or runtime errors.
5. **Mobile & accessibility** – Check that layouts use semantic HTML, headings, labels and responsive Tailwind classes for `sm`, `md`, `lg`, and `xl` breakpoints.
6. **Identify issues** – Note bugs such as the broken Code Minifier dropdown, stale Unit Converter output, API errors in Currency Converter, PDF/Word conversion worker failures, HTML→PDF runtime errors, missing OG preview images, etc.
7. **Refactor & fix** – Update client components to resolve the issues, simplify the UI and enhance error handling. Remove broken code if a tool cannot run entirely client‑side.
8. **Add tests where practical** – Extend existing Jest tests to cover edge cases like trailing spaces in the text counter utilities.
9. **Run `npm test` and `npm run build`** – Verify the codebase compiles and unit tests pass.
10. **Update documentation** – Record the verification checklist in `CHECKLIST.md` and summarise fixes in the PR description.
