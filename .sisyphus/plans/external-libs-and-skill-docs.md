# Enhance Stencil System + External Library Loader

## TL;DR

> **Quick Summary**: Add external drawio-libs support (download, parse, use community shape libraries) and update SKILL.md to document the full stencil system (8 built-in libraries + external libs workflow).
> 
> **Deliverables**:
> - External library loader module (`src/stencils/external-loader.ts`)
> - CLI `download-libs` command
> - Updated `SKILL.md` with full stencil/external lib docs
> - Updated exports in `src/index.ts` and `src/stencils/index.ts`
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Task 1 → Task 2, Task 3 (parallel) → Task 4

---

## Context

### Original Request
User wants to:
1. Enhance the SKILL.md to document the 8 built-in stencil shape libraries (AWS, Azure, GCP, Alibaba, K8s, Cisco, UML, BPMN)
2. Support importing external shape libraries from https://github.com/jgraph/drawio-libs
3. Either auto-download missing libraries or let users download via CLI

### What's Already Built
The stencil system is fully implemented with:
- `src/stencils/types.ts` - Type definitions
- `src/stencils/registry.ts` - Central registry
- `src/stencils/style-resolver.ts` - Style resolution
- `src/stencils/index.ts` - Barrel exports + auto-registration
- `src/builder/stencil-node.ts` - XML generation for stencil nodes
- `src/builder/diagram-builder.ts` - Extended with `addStencilNode()` and `addStencilGroup()`
- `src/templates/cloud-architecture.ts` - Cloud architecture templates
- 8 catalogs in `src/stencils/catalogs/` (aws4, azure, gcp, alibaba, kubernetes, cisco, uml, bpmn)
- All exports in `src/index.ts`
- Build passes, 50 tests pass, smoke test verified all 8 libraries

### What's Missing
1. External library loader for drawio-libs format (XML with compressed shapes)
2. CLI command to download popular libraries
3. SKILL.md documentation of stencil libraries and external lib workflow
4. Exports for the external loader functions

---

## Work Objectives

### Core Objective
Complete the stencil system by adding external library support and comprehensive documentation.

### Concrete Deliverables
- `src/stencils/external-loader.ts` — Download, parse, cache, and insert shapes from drawio-libs
- Updated `src/scripts/generate-diagram.ts` — New `download-libs` CLI command
- Updated `SKILL.md` — Full stencil + external lib documentation
- Updated `src/index.ts` + `src/stencils/index.ts` — Export external loader

### Definition of Done
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] All 50 existing tests pass
- [ ] External loader can download a library from drawio-libs GitHub
- [ ] External loader can decompress compressed XML entries
- [ ] `download-libs` CLI command works
- [ ] SKILL.md documents all 8 stencil libraries with usage examples
- [ ] SKILL.md documents external library workflow

### Must Have
- Decompression of drawio-libs compressed XML (base64 → zlib inflate → UTF-8)
- Popular library registry with URLs for easy download
- CLI `download-libs` with `--all` and `--name <lib>` options
- Ability to insert external shapes into DiagramBuilder

### Must NOT Have (Guardrails)
- Do NOT add npm dependencies — use Node.js built-in `zlib` and `fetch`
- Do NOT modify existing stencil catalogs
- Do NOT break existing API or tests
- Do NOT auto-download at import time (lazy/explicit only)

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: YES (vitest)
- **Automated tests**: Tests-after (add a basic test for external loader)
- **Framework**: vitest
- **Agent-Executed QA**: ALWAYS (mandatory)

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately - external loader + CLI):
├── Task 1: Create external-loader.ts [deep]
└── Task 2: Add download-libs CLI command [quick]

Wave 2 (After Wave 1 - docs + exports):
├── Task 3: Update SKILL.md with full stencil docs [writing]
└── Task 4: Update exports (index.ts, stencils/index.ts) [quick]

Wave FINAL (After ALL tasks — verification):
└── Task F1: Build + test + smoke test [unspecified-high]
```

### Dependency Matrix
- **1**: → 3, 4
- **2**: → 3
- **3**: → F1
- **4**: → F1

### Agent Dispatch Summary
- **Wave 1**: **2** — T1 → `deep`, T2 → `quick`
- **Wave 2**: **2** — T3 → `writing`, T4 → `quick`
- **FINAL**: **1** — F1 → `unspecified-high`

---

## TODOs

- [x] 1. Create External Library Loader

  **What to do**:
  - Create `src/stencils/external-loader.ts` with:
    - Type definitions: `ExternalLibEntry`, `ExternalLibrary`
    - `decompressXml(compressed)` — base64 decode → zlib inflate → UTF-8 string
    - `parseMxLibrary(xml, name, source)` — Extract JSON from `<mxlibrary>` tag, parse entries
    - `fetchLibrary(url, name?)` — Download and parse a library from URL (using Node.js built-in `fetch`)
    - `loadLibraryFromFile(filePath, name?)` — Load from local file
    - `loadCachedLibrary(name, cacheDir?)` — Load from cache dir (`~/.fireworks-drawio-graph/libs/`)
    - `listCachedLibraries(cacheDir?)` — List cached library names
    - `downloadLibrary(url, name?, cacheDir?)` — Download + save to cache
    - `listExternalShapes(lib)` — List available shapes with titles/dimensions
    - `buildExternalShapeXml(lib, entryIndex, x, y, overrides?)` — Generate mxCell XML from a library entry
    - `findEntryByTitle(lib, title)` — Find entry by title (case-insensitive)
    - `POPULAR_LIBRARIES` — Record of known drawio-libs with URLs and descriptions
  - Use Node.js built-in: `zlib.inflateSync`, `fetch`, `fs/promises`, `path`, `os`
  - Default cache dir: `~/.fireworks-drawio-graph/libs/`
  - Popular libraries map should include at minimum: templates, digitalocean, material-design-icons, font-awesome, flat-color-icons, arista, osa-icons

  **Must NOT do**:
  - Do NOT add npm dependencies
  - Do NOT auto-download on import

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Tasks 3, 4
  - **Blocked By**: None

  **References**:

  **Pattern References** (existing code to follow):
  - `src/stencils/registry.ts` — Registry pattern (register, get, list)
  - `src/stencils/types.ts` — Type definition style
  - `src/builder/stencil-node.ts` — XML generation pattern (array-push, escapeAttrValue)
  - `src/utils/id-generator.ts` — nextId() for generating cell IDs

  **API/Type References**:
  - Node.js `zlib.inflateSync(buffer)` — for decompressing drawio-libs XML
  - Node.js `fetch()` — for downloading library files (available in Node 18+)
  - Node.js `fs/promises` — for file I/O
  - Node.js `os.homedir()` — for default cache directory

  **External References**:
  - drawio-libs format: `<mxlibrary>[{JSON array of entries}]</mxlibrary>`
  - Each entry: `{ "title": "...", "xml": "base64+deflate compressed mxGraphModel", "w": 295, "h": 300 }`
  - Decompression: `Buffer.from(compressed, 'base64')` → `inflateSync()` → `.toString('utf-8')`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Decompress a known drawio-libs entry
    Tool: Bash (node -e)
    Preconditions: External loader module built
    Steps:
      1. Import decompressXml from the module
      2. Pass a known compressed string from templates.xml
      3. Assert result contains "<mxGraphModel>" or "<mxCell"
    Expected Result: Decompressed string is valid XML
    Failure Indicators: Throws error, result is garbled
    Evidence: .sisyphus/evidence/task-1-decompress.txt

  Scenario: Parse a complete mxlibrary file
    Tool: Bash (node -e)
    Preconditions: Fetch templates.xml from drawio-libs repo
    Steps:
      1. Use fetchLibrary with the templates URL
      2. Assert entries.length > 0
      3. Assert first entry has title, xml, w, h properties
    Expected Result: Library parsed with multiple entries
    Failure Indicators: Empty entries, missing properties
    Evidence: .sisyphus/evidence/task-1-parse.txt
  ```

  **Commit**: YES (groups with Task 2)
  - Message: `feat(stencils): add external library loader for drawio-libs support`
  - Files: `src/stencils/external-loader.ts`
  - Pre-commit: `npx tsc --noEmit`

- [x] 2. Add `addExternalShape()` to DiagramBuilder + download-libs CLI

  **CRITICAL**: This is the integration layer that connects downloaded libraries to the diagram builder.
  Without this, downloaded libraries sit on disk unused.

  **What to do**:

  ### Part A: Add `addExternalShape()` to DiagramBuilder (`src/builder/diagram-builder.ts`)

  Add a new method and input type:

  ```typescript
  // New input type (add near StencilNodeInput imports)
  export interface ExternalShapeInput {
    /** Cached library name (e.g., "digitalocean", "vmware") */
    library: string;
    /** Shape title to find (case-insensitive) or entry index */
    title?: string;
    /** Alternative to title: direct entry index */
    entryIndex?: number;
    /** Display label */
    label?: string;
    /** X position */
    x: number;
    /** Y position */
    y: number;
    /** Override width */
    width?: number;
    /** Override height */
    height?: number;
    /** Parent cell ID (default "1") */
    parent?: string;
    /** Additional style overrides */
    styleOverrides?: Record<string, string>;
  }
  ```

  Add method to `DiagramBuilder`:
  ```typescript
  async addExternalShape(def: ExternalShapeInput): Promise<string> {
    // 1. Load cached library by name
    const { loadCachedLibrary, findEntryByTitle, buildExternalShapeXml } = await import('../stencils/external-loader.js');
    const lib = await loadCachedLibrary(def.library);

    // 2. Find entry
    let idx = def.entryIndex ?? -1;
    if (def.title && idx === -1) {
      idx = findEntryByTitle(lib, def.title);
      if (idx === -1) throw new Error(`Shape "${def.title}" not found in library "${def.library}"`);
    }
    if (idx === -1) throw new Error('Either title or entryIndex must be provided');

    // 3. Build XML
    const id = nextId();
    const x = this.config.gridSnap ? applyGridSnap(def.x) : def.x;
    const y = this.config.gridSnap ? applyGridSnap(def.y) : def.y;
    const xml = buildExternalShapeXml(id, lib, idx, x, y, {
      w: def.width,
      h: def.height,
      label: def.label,
      parent: def.parent,
    });
    this.lines.push(xml);
    return id;
  }
  ```

  Also add `listExternalLibraries()` static/instance method for discovery:
  ```typescript
  static async listExternalLibraries(): Promise<string[]> {
    const { listCachedLibraries } = await import('../stencils/external-loader.js');
    return listCachedLibraries();
  }

  static async listExternalShapes(libraryName: string): Promise<Array<{ index: number; title: string; w: number; h: number }>> {
    const { loadCachedLibrary, listExternalShapes: listShapes } = await import('../stencils/external-loader.js');
    const lib = await loadCachedLibrary(libraryName);
    return listShapes(lib);
  }
  ```

  ### Part B: Add download-libs CLI command (`src/scripts/generate-diagram.ts`)

  Add `download-libs` subcommand with options:
  - No options → list popular libraries
  - `--all` → download all popular libraries
  - `--name <lib>` → download specific popular library
  - `--url <url>` → download from custom URL
  - `--list` → list cached libraries
  - `--shapes <lib>` → list shapes in a cached library

  Import from `../stencils/external-loader.js`.

  **Must NOT do**:
  - Do NOT modify existing CLI commands (generate, styles, types)
  - Do NOT break existing argument parsing
  - Do NOT add npm dependencies

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 1 external-loader.ts which is complete)
  - **Blocks**: Tasks 3, 4
  - **Blocked By**: Task 1 (complete)

  **References**:
  - `src/builder/diagram-builder.ts` — Add method to this class
  - `src/scripts/generate-diagram.ts` — Add CLI command to this file
  - `src/stencils/external-loader.ts` — Import from here (already created)
  - `src/builder/stencil-node.ts` — Pattern for `buildStencilCellXml` (reference for `addExternalShape`)

  **Acceptance Criteria**:
  - [ ] `DiagramBuilder.addExternalShape()` works with cached libraries
  - [ ] `DiagramBuilder.listExternalLibraries()` returns cached library names
  - [ ] `DiagramBuilder.listExternalShapes(name)` returns shape list
  - [ ] `download-libs` CLI command lists, downloads, and shows shapes
  - [ ] `npx tsc --noEmit` passes

  **Commit**: YES
  - Message: `feat(stencils): integrate external libs with DiagramBuilder + CLI`
  - Files: `src/builder/diagram-builder.ts`, `src/scripts/generate-diagram.ts`
  - Pre-commit: `npx tsc --noEmit`

- [x] 3. Update SKILL.md with Full Stencil + External Lib Documentation

  **What to do**:
  - Update `SKILL.md` to add these sections (after the existing "Shape Vocabulary" section):

    **Section: "Cloud & Infrastructure Shape Libraries"**
    - Document that 8 built-in stencil libraries are available
    - Table: Library ID | Name | Shape Count | Best For
      - aws4: AWS 2021+ | ~150 shapes + 16 groups | AWS architecture diagrams
      - azure: Azure | ~95 shapes + 3 groups | Azure architecture diagrams
      - gcp2: Google Cloud | ~75 shapes + 5 groups | GCP architecture diagrams
      - alibaba: Alibaba Cloud | ~60 shapes + 5 groups | Alibaba architecture diagrams
      - kubernetes: Kubernetes | 36 shapes + 2 groups | K8s cluster diagrams
      - cisco: Cisco | 43 shapes + 3 groups | Network topology diagrams
      - uml: UML | 15 built-in shapes | UML diagrams
      - bpmn: BPMN | 30 shapes + 2 groups | Business process diagrams

    **Section: "Using Stencil Shapes"**
    - Code example showing `addStencilNode()` and `addStencilGroup()`:
      ```typescript
      const builder = new DiagramBuilder({ style: 1, title: 'AWS Serverless' });
      
      // Add VPC group
      const vpc = builder.addStencilGroup({
        library: 'aws4', group: 'vpc', label: 'VPC',
        x: 50, y: 50, width: 800, height: 400,
      });
      
      // Add service icons
      const s3 = builder.addStencilNode({ library: 'aws4', shape: 's3', label: 'S3', x: 100, y: 150 });
      const lambda = builder.addStencilNode({ library: 'aws4', shape: 'lambda', label: 'Lambda', x: 300, y: 150 });
      ```

    **Section: "Available Shapes by Library"**
    - For each library, list key shape names organized by category
    - AWS4: Compute (ec2, lambda, fargate, ecs, eks, batch), Storage (s3, ebs, efs, glacier), Database (rds, dynamodb, aurora, redshift, elasticache), Networking (vpc, cloudfront, route_53, api_gateway, load_balancer), Security (iam, kms, guardduty, waf, cognito), ML/AI (sagemaker, bedrock, comprehend, rekognition)
    - Azure: compute (virtual_machines, app_services, functions, aks), storage (storage_accounts, blob_storage), database (sql_database, cosmos_db, redis_cache), networking (virtual_network, load_balancer, firewall)
    - GCP: compute (compute_engine, cloud_functions, cloud_run, gke), storage (cloud_storage), database (cloud_sql, firestore, bigquery, bigtable), AI (vertex_ai, auto_ml)
    - Alibaba: compute (ecs, ack, function_compute), storage (oss, nas), database (rds, polar_db, redis)
    - Kubernetes: pod, deployment, service, ingress, configmap, secret, namespace, pv, pvc
    - Cisco: router, switch_layer_3, firewall, wireless_access_point, workstation, cloud
    - UML: actor, lifeline, state, frame, component, start_state, end_state
    - BPMN: start_event, end_event, user_task, service_task, exclusive_gateway, parallel_gateway

    **Section: "Cloud Architecture Templates"**
    - Document `createAwsArchitectureDiagram()`, `createAzureArchitectureDiagram()`, etc.
    - Show the `CloudArchInput` interface structure

    **Section: "External Shape Libraries (drawio-libs)"**
    - Explain the drawio-libs community library system
    - **Discovery flow for AI agents**:
      1. `DiagramBuilder.listExternalLibraries()` → see what's cached
      2. `DiagramBuilder.listExternalShapes('digitalocean')` → see available shapes
      3. `builder.addExternalShape({ library: 'digitalocean', title: 'Droplet', x: 100, y: 100 })` → add to diagram
    - CLI usage:
      ```bash
      npx fireworks-drawio-graph download-libs              # List available
      npx fireworks-drawio-graph download-libs --all         # Download all
      npx fireworks-drawio-graph download-libs --name templates  # Specific lib
      npx fireworks-drawio-graph download-libs --url <custom-url>  # Custom URL
      npx fireworks-drawio-graph download-libs --shapes digitalocean  # List shapes in lib
      ```
    - API usage:
      ```typescript
      import { DiagramBuilder } from 'fireworks-drawio-graph';
      
      const builder = new DiagramBuilder({ style: 1, title: 'DigitalOcean Infra' });
      
      // Add external shape from cached library
      const droplet = await builder.addExternalShape({
        library: 'digitalocean',
        title: 'Droplet',
        label: 'Web Server',
        x: 100, y: 100,
      });
      ```

    **Section: "When to Use Stencils vs Basic Shapes vs External Libs"**
    - Use basic shapes (process, database, etc.) for generic tech diagrams
    - Use stencil shapes (`addStencilNode`) for built-in cloud providers (AWS, Azure, GCP, Alibaba, K8s)
    - Use external shapes (`addExternalShape`) for downloaded libraries (DigitalOcean, VMware, Arista, etc.)

    **Update Workflow Section**:
    - Add step after "Map nodes to shapes":
      - 5.5. **Check stencil libraries** — for cloud/infra diagrams, use `addStencilNode()` with provider-specific shapes
      - 5.6. **Check external libraries** — for custom icons, download from drawio-libs

  **Must NOT do**:
  - Do NOT remove existing SKILL.md content
  - Do NOT add excessive inline comments in code examples

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 4)
  - **Blocks**: F1
  - **Blocked By**: Tasks 1, 2

  **References**:

  **Pattern References**:
  - `SKILL.md` — Existing document structure and style
  - `src/stencils/catalogs/aws4.ts` — AWS4 shape names and categories (read to extract shape lists)
  - `src/stencils/catalogs/azure.ts` — Azure shape names
  - `src/stencils/catalogs/gcp.ts` — GCP shape names
  - `src/stencils/catalogs/alibaba.ts` — Alibaba shape names
  - `src/stencils/catalogs/kubernetes.ts` — K8s shape names
  - `src/stencils/catalogs/cisco.ts` — Cisco shape names
  - `src/stencils/catalogs/uml.ts` — UML shape names
  - `src/stencils/catalogs/bpmn.ts` — BPMN shape names
  - `src/stencils/external-loader.ts` — External loader API (Task 1 output)
  - `src/templates/cloud-architecture.ts` — Cloud architecture templates API

  **Acceptance Criteria**:
  - [ ] SKILL.md has new "Cloud & Infrastructure Shape Libraries" section
  - [ ] SKILL.md has "Using Stencil Shapes" with code examples
  - [ ] SKILL.md has "Available Shapes by Library" with key shapes per library
  - [ ] SKILL.md has "Cloud Architecture Templates" section
  - [ ] SKILL.md has "External Shape Libraries" section with CLI + API usage
  - [ ] SKILL.md has "When to Use Stencils vs Basic Shapes" guidance
  - [ ] Workflow section updated with stencil/external lib steps

  **Commit**: YES
  - Message: `docs: add stencil library and external libs documentation to SKILL.md`
  - Files: `SKILL.md`

- [x] 4. Update Exports for External Loader

  **What to do**:
  - Update `src/index.ts` to add exports for external loader:
    ```typescript
    // External library loader — drawio-libs community shapes
    export {
      fetchLibrary,
      loadLibraryFromFile,
      loadCachedLibrary,
      listCachedLibraries,
      downloadLibrary,
      listExternalShapes,
      buildExternalShapeXml,
      findEntryByTitle,
      decompressXml,
      parseMxLibrary,
      getDefaultCacheDir,
      POPULAR_LIBRARIES,
    } from './stencils/external-loader.js';
    export type {
      ExternalLibEntry,
      ExternalLibrary,
    } from './stencils/external-loader.js';
    ```
  - Also export `ExternalShapeInput` from diagram-builder.ts (if not already exported)
  - Follow existing export section pattern in the file

  **Must NOT do**:
  - Do NOT remove existing exports
  - Do NOT modify any other files

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 3)
  - **Blocks**: F1
  - **Blocked By**: Task 1

  **References**:
  - `src/index.ts` — Current exports (follow the section pattern with `// Comment` headers)

  **Acceptance Criteria**:
  - [ ] `npx tsc --noEmit` passes
  - [ ] External loader types and functions exported

  **Commit**: YES (groups with Task 3)
  - Message: `feat(stencils): export external library loader API`
  - Files: `src/index.ts`

---

## Final Verification Wave

- [x] F1. **Build + Test + Smoke Test** — `unspecified-high`
   Run full verification:
   1. `npx tsc --noEmit` — zero errors
   2. `npm test` — all tests pass
   3. `npm run build` — clean build
   4. Smoke test built-in stencils (8 libraries)
   5. Smoke test external loader: download templates.xml, parse, list shapes
   6. Smoke test DiagramBuilder.addExternalShape() with cached library
   7. Smoke test CLI `download-libs` command
   8. Verify full flow: download → list shapes → addExternalShape → generate XML
   Output: `Build [PASS/FAIL] | Tests [N/N] | Stencils [8/8] | External [PASS/FAIL] | Builder [PASS/FAIL] | CLI [PASS/FAIL]`

---

## Commit Strategy

- **Commit 1**: `feat(stencils): add external library loader for drawio-libs support` — Task 1 (already done)
- **Commit 2**: `feat(stencils): integrate external libs with DiagramBuilder + CLI` — Task 2
- **Commit 3**: `docs: add stencil library and external libs documentation to SKILL.md` — Tasks 3 + 4

---

## Success Criteria

### Verification Commands
```bash
npx tsc --noEmit           # Expected: zero errors
npm test                    # Expected: 50+ tests pass
npm run build               # Expected: clean build
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] All tests pass
- [ ] External loader can download and parse drawio-libs
- [ ] CLI download-libs command works
- [ ] SKILL.md fully documents stencil + external lib system
