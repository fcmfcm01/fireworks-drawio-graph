# Learnings

## 2026-05-09 Session Start
- Stencil system fully built: types.ts, registry.ts, style-resolver.ts, index.ts, stencil-node.ts
- 8 catalogs: aws4 (~150 shapes), azure (~95), gcp (~75), alibaba (~60), kubernetes (36), cisco (43), uml (15), bpmn (30)
- Style templates use placeholders: {PREFIX}, {SHAPE}, {COLOR}, {STROKE}
- AWS4 groups referenced WITHOUT "group_" prefix — template adds it automatically
- Builder has addStencilNode() and addStencilGroup() methods
- Cloud architecture templates: createAwsArchitectureDiagram(), etc.
- Build passes, 50/50 tests pass, smoke test verified
- drawio-libs format: <mxlibrary>[{JSON}]</mxlibrary> with base64+deflate compressed xml entries
- Decompression: Buffer.from(xml, 'base64') → zlib.inflateSync() → UTF-8
- CLI uses Commander.js in src/scripts/generate-diagram.ts
- Exports in src/index.ts follow section-comment pattern with // headers

## 2026-05-09 Wave 1 Task 1 — external-loader.ts
- Created src/stencils/external-loader.ts: full external library loader module
- Exports: ExternalLibEntry, ExternalLibrary interfaces; POPULAR_LIBRARIES constant
- 11 functions: decompressXml, parseMxLibrary, fetchLibrary, loadLibraryFromFile, getDefaultCacheDir, loadCachedLibrary, listCachedLibraries, downloadLibrary, listExternalShapes, findEntryByTitle, buildExternalShapeXml
- Style extraction from decompressed XML uses regex to find first non-root mxCell's style attribute
- XML generation follows array-push pattern from stencil-node.ts
- Uses only Node built-ins: node:zlib, node:fs/promises, node:path, node:os + global fetch
- All imports use .js extension (ESM); tsc --noEmit passes with zero errors
- Cache dir: ~/.fireworks-drawio-graph/libs
