# Project Checklist

- Updated GitHub link in footer to https://github.com/tahir-ozcan/gearizen
- Generated simple SVG placeholders for favicon and Open Graph images
- Added new tools with pages and metadata:
  - ISO Date Converter
  - Image to Base64 Encoder
  - Markdown Previewer
  - UUID Generator
  - Lorem Ipsum Generator
  - URL Encoder/Decoder
- Fixed ESLint warning in currency converter and ensured lint/type-check/test pass
- High-resolution custom graphics remain out of scope

## Audit Verification
- [ ] Code Minifier works without language dropdown
- [ ] Unit Converter recalculates on any change
- [ ] Currency Converter fetches rates without API errors (requires reachable endpoint)
- [ ] PDF → Word exports DOC files without worker error
- [ ] HTML → PDF produces PDF instantly
- [ ] Open Graph Preview shows image and metadata
- [ ] Word & Character Counter counts spaces correctly
- [ ] UUID Generator has Generate button
- [ ] Lorem Ipsum Generator, URL Encoder/Decoder and Markdown Previewer share consistent styling
