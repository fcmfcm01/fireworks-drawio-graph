# Decisions

## 2026-05-09 Session Start
- Use Node.js built-in zlib and fetch — no new npm dependencies
- Default cache dir: ~/.fireworks-drawio-graph/libs/
- External loader is lazy/explicit — no auto-download on import
- Popular libraries map: templates, digitalocean, material-design-icons, font-awesome, flat-color-icons, arista, osa-icons
- CLI command: download-libs with --all, --name, --url, --list options
- Two commits: 1) external loader + CLI, 2) SKILL.md + exports
