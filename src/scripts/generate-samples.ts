/**
 * Generate 7 publication-quality .drawio sample diagrams.
 * Writes raw mxGraphModel XML directly (not through DiagramBuilder)
 * to achieve professional visual quality matching fireworks-tech-graph.
 *
 * Usage: npx tsx src/scripts/generate-samples.ts
 */

import { writeFileSync, mkdirSync, existsSync, rmSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const OUT_DIR = resolve(import.meta.dirname, '../../assets/samples');

function wrapXml(inner: string, w = 1080, h = 760): string {
  return `<mxfile host="fireworks-drawio-graph" version="1.0.0" type="device">
  <diagram id="d1" name="Page-1">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="${w}" pageHeight="${h}" math="0" shadow="0">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
${inner}
  </root>
</mxGraphModel>
  </diagram>
</mxfile>`;
}

// ─── helpers ────────────────────────────────────────────────────────────────

const swim = (id: string, label: string, x: number, y: number, w: number, h: number, fill: string, stroke: string, fc = '#374151') =>
  `<mxCell id="${id}" value="${label}" style="swimlane;startSize=28;fillColor=${fill};strokeColor=${stroke};html=1;fontStyle=1;fontSize=12;fontColor=${fc};rounded=1;arcSize=6;swimlaneLine=1;whiteSpace=wrap;" vertex="1" parent="1"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell>`;

const node = (id: string, label: string, type: string, x: number, y: number, w: number, h: number, fill: string, stroke: string, parent = '1', extra = '') =>
  `<mxCell id="${id}" value="&lt;b style='font-size:13px'&gt;${label}&lt;/b&gt;&lt;br&gt;&lt;font style='font-size:9px' color='#6b7280'&gt;${type}&lt;/font&gt;" style="rounded=1;whiteSpace=wrap;html=1;arcSize=14;fillColor=${fill};strokeColor=${stroke};shadow=1;${extra}" vertex="1" parent="${parent}"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell>`;

const cyl = (id: string, label: string, sub: string, x: number, y: number, w: number, h: number, fill: string, stroke: string, parent = '1') =>
  `<mxCell id="${id}" value="&lt;b style='font-size:13px'&gt;${label}&lt;/b&gt;&lt;br&gt;&lt;font style='font-size:9px' color='#6b7280'&gt;${sub}&lt;/font&gt;" style="shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=12;fillColor=${fill};strokeColor=${stroke};shadow=1;" vertex="1" parent="${parent}"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell>`;

const hex = (id: string, label: string, type: string, x: number, y: number, w: number, h: number, fill: string, stroke: string, parent = '1') =>
  `<mxCell id="${id}" value="&lt;b style='font-size:13px'&gt;${label}&lt;/b&gt;&lt;br&gt;&lt;font style='font-size:9px' color='#6b7280'&gt;${type}&lt;/font&gt;" style="shape=hexagon;perimeter=hexagonPerimeterSize;whiteSpace=wrap;html=1;fixedSize=1;size=18;fillColor=${fill};strokeColor=${stroke};shadow=1;" vertex="1" parent="${parent}"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell>`;

const usr = (id: string, label: string, x: number, y: number, w: number, h: number, fill: string, stroke: string, parent = '1') =>
  `<mxCell id="${id}" value="&lt;b&gt;${label}&lt;/b&gt;" style="ellipse;whiteSpace=wrap;html=1;fillColor=${fill};strokeColor=${stroke};shadow=1;fontSize=13;" vertex="1" parent="${parent}"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell>`;

const doc = (id: string, label: string, type: string, x: number, y: number, w: number, h: number, fill: string, stroke: string, parent = '1') =>
  `<mxCell id="${id}" value="&lt;b style='font-size:13px'&gt;${label}&lt;/b&gt;&lt;br&gt;&lt;font style='font-size:9px' color='#6b7280'&gt;${type}&lt;/font&gt;" style="shape=document;whiteSpace=wrap;html=1;boundedLbl=1;size=0.15;fillColor=${fill};strokeColor=${stroke};shadow=1;" vertex="1" parent="${parent}"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell>`;

const edge = (id: string, src: string, tgt: string, color: string, w = '2', dash = '', label = '', parent = '1') =>
  `<mxCell id="${id}" ${label ? `value="${label}" ` : ''}style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=classic;endFill=1;strokeColor=${color};strokeWidth=${w};${dash}fontSize=10;fontColor=#6b7280;labelBackgroundColor=#ffffff;" edge="1" source="${src}" target="${tgt}" parent="${parent}"><mxGeometry relative="1" as="geometry"/></mxCell>`;

const title = (id: string, text: string, x: number, y: number, color = '#111827') =>
  `<mxCell id="${id}" value="${text}" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=18;fontStyle=1;fontColor=${color};" vertex="1" parent="1"><mxGeometry x="${x}" y="${y}" width="300" height="30" as="geometry"/></mxCell>`;

const bg = (id: string, color: string, w: number, h: number) =>
  `<mxCell id="${id}" value="" style="shape=rectangle;fillColor=${color};strokeColor=none;opacity=100;" vertex="1" parent="1"><mxGeometry x="0" y="0" width="${w}" height="${h}" as="geometry"/></mxCell>`;

const legend = (id: string, text: string, x: number, y: number, color = '#6b7280') =>
  `<mxCell id="${id}" value="${text}" style="text;html=1;align=left;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=10;fontColor=${color};" vertex="1" parent="1"><mxGeometry x="${x}" y="${y}" width="400" height="20" as="geometry"/></mxCell>`;

// ─── 1. Mem0 Memory Architecture — Style 1 ─────────────────────────────────

function genMem0(): string {
  return wrapXml(`
    ${title('t1', 'Mem0 Memory Architecture', 390, 10)}
    ${swim('L1', 'Input Layer', 30, 50, 1020, 110, '#f0f4ff', '#93b5f8')}
    ${swim('L2', 'Memory Manager (mem0 Core)', 30, 180, 1020, 120, '#fff7ed', '#f5a623')}
    ${swim('L3', 'Storage Layer', 30, 320, 1020, 130, '#f0fdf4', '#6bcb77')}
    ${swim('L4', 'Output / Retrieval', 30, 470, 1020, 110, '#fdf2f8', '#e086aa')}
    ${usr('n1', 'User', 40, 30, 80, 70, '#dbeafe', '#2563eb', 'L1')}
    ${node('n2', 'AI App / Agent', 'APPLICATION', 200, 30, 160, 60, '#eff6ff', '#3b82f6', 'L1')}
    ${node('n3', 'LLM', 'MODEL', 440, 30, 140, 60, '#f5f3ff', '#8b5cf6', 'L1', 'strokeWidth=2;')}
    ${node('n4', 'mem0 Client', 'SDK', 660, 30, 150, 60, '#eef2ff', '#6366f1', 'L1')}
    ${node('n5', 'Fact Extractor', 'PROCESSOR', 40, 36, 150, 60, '#ffffff', '#d1d5db', 'L2')}
    ${node('n6', 'Memory Manager', 'CORE ENGINE', 280, 36, 200, 64, '#f5f3ff', '#8b5cf6', 'L2', 'strokeWidth=2;')}
    ${node('n7', 'Conflict Resolver', 'RESOLVER', 560, 36, 160, 60, '#ffffff', '#d1d5db', 'L2')}
    ${node('n8', 'Graph DB', 'RELATIONS', 790, 36, 170, 60, '#dbeafe', '#3b82f6', 'L2')}
    ${cyl('n9', 'Vector Store', 'embeddings', 50, 30, 140, 80, '#ecfdf5', '#10b981', 'L3')}
    ${cyl('n10', 'Key-Value Store', 'metadata', 270, 30, 150, 80, '#fff7ed', '#f97316', 'L3')}
    ${doc('n11', 'History Store', 'EPISODIC', 490, 30, 150, 80, '#faf5ff', '#8b5cf6', 'L3')}
    ${node('n12', 'Context Builder', 'ASSEMBLER', 730, 30, 170, 60, '#ffffff', '#d1d5db', 'L3')}
    ${node('n13', 'Ranked Results', 'RERANKER', 190, 36, 160, 55, '#ffffff', '#d1d5db', 'L4')}
    ${node('n14', 'Personalized Response', 'OUTPUT', 490, 36, 200, 55, '#f5f3ff', '#8b5cf6', 'L4', 'strokeWidth=2;')}
    ${edge('e1', 'n1', 'n2', '#2563eb', '2')}
    ${edge('e2', 'n2', 'n3', '#2563eb', '2', '', 'query')}
    ${edge('e3', 'n3', 'n4', '#f97316', '1.5', 'dashed=1;dashPattern=5 3;', 'retrieve()')}
    ${edge('e4', 'n4', 'n5', '#f97316', '1.5', 'dashed=1;dashPattern=5 3;', 'extract')}
    ${edge('e5', 'n5', 'n6', '#f97316', '1.5', 'dashed=1;dashPattern=5 3;', 'facts')}
    ${edge('e6', 'n4', 'n6', '#f97316', '1.5', 'dashed=1;dashPattern=5 3;', 'store()')}
    ${edge('e7', 'n6', 'n7', '#f97316', '1.5', 'dashed=1;dashPattern=5 3;')}
    ${edge('e8', 'n6', 'n9', '#10b981', '1.5', 'dashed=1;dashPattern=5 3;', 'write')}
    ${edge('e9', 'n6', 'n10', '#10b981', '1.5', 'dashed=1;dashPattern=5 3;', 'write')}
    ${edge('e10', 'n6', 'n11', '#10b981', '1.5', 'dashed=1;dashPattern=5 3;', 'write')}
    ${edge('e11', 'n6', 'n8', '#10b981', '1.5', 'dashed=1;dashPattern=5 3;', 'write')}
    ${edge('e12', 'n9', 'n12', '#10b981', '1.5', '', 'read')}
    ${edge('e13', 'n10', 'n12', '#10b981', '1.5', '', 'read')}
    ${edge('e14', 'n11', 'n12', '#10b981', '1.5', '', 'read')}
    ${edge('e15', 'n12', 'n13', '#2563eb', '2', '', 'score')}
    ${edge('e16', 'n13', 'n14', '#2563eb', '2', '', 'deliver')}
    ${legend('lg1', '── Primary &#160;&#160; - - Control &#160;&#160; ── Memory read &#160;&#160; - - Memory write', 30, 595)}
  `, 1080, 630);
}

// ─── 2. Tool Call Flow — Style 2 ────────────────────────────────────────────

function genToolcall(): string {
  return wrapXml(`
    ${bg('bg1', '#0f0f1a', 1080, 720)}
    ${title('t2', 'Tool Call Flow', 390, 8, '#e2e8f0')}
    ${swim('L1', 'REQUEST PATH', 30, 48, 1020, 140, '#111827', '#334155', '#94a3b8')}
    ${swim('L2', 'TOOLING FABRIC', 30, 210, 1020, 180, '#111827', '#334155', '#94a3b8')}
    ${swim('L3', 'KNOWLEDGE + RESPONSE', 30, 410, 1020, 180, '#111827', '#334155', '#94a3b8')}
    ${usr('n1', 'User query', 40, 30, 100, 70, '#0f172a', '#38bdf8', 'L1')}
    ${node('n2', 'Retrieve chunks', 'EMBEDDING SEARCH', 220, 30, 170, 60, '#111827', '#a855f7', 'L1', 'strokeWidth=2;')}
    ${node('n3', 'Generate answer', 'LLM INFERENCE', 470, 30, 170, 60, '#111827', '#f97316', 'L1')}
    ${cyl('n4', 'Knowledge base', 'embeddings', 740, 20, 160, 80, '#0f172a', '#38bdf8', 'L1')}
    ${hex('n5', 'Agent', 'ORCHESTRATOR', 200, 36, 150, 70, '#111827', '#34d399', 'L2')}
    ${node('n6', 'Terminal', 'EXECUTION', 480, 36, 150, 60, '#111827', '#475569', 'L2')}
    ${doc('n7', 'Source documents', 'CORPUS', 740, 36, 160, 70, '#1c1304', '#f59e0b', 'L2')}
    ${node('n8', 'Grounded answer', 'CITED OUTPUT', 360, 40, 170, 60, '#0f172a', '#34d399', 'L3')}
    ${edge('e1', 'n1', 'n2', '#a855f7', '2', '', 'embed')}
    ${edge('e2', 'n2', 'n3', '#f97316', '2', '', 'context')}
    ${edge('e3', 'n2', 'n4', '#38bdf8', '1.5', 'dashed=1;dashPattern=5 3;', 'search')}
    ${edge('e4', 'n4', 'n3', '#38bdf8', '1.5', 'dashed=1;dashPattern=5 3;', 'chunks')}
    ${edge('e5', 'n1', 'n5', '#34d399', '1.5', '', 'dispatch')}
    ${edge('e6', 'n5', 'n6', '#34d399', '1.5', '', 'invoke')}
    ${edge('e7', 'n6', 'n7', '#34d399', '1.5', '', 'fetch')}
    ${edge('e8', 'n7', 'n4', '#8b5cf6', '1.5', 'curved=1;', 'embed')}
    ${edge('e9', 'n5', 'n8', '#34d399', '2', '', 'respond')}
    ${edge('e10', 'n3', 'n8', '#f97316', '2', '', 'compose')}
    ${edge('e11', 'n6', 'n5', '#f97316', '1.5', 'dashed=1;dashPattern=5 3;', 'result')}
    ${legend('lg2', '── Agent path &#160;&#160; - - Control &#160;&#160; ~~ Feedback &#160;&#160; ── Retrieval', 30, 600, '#94a3b8')}
  `, 1080, 630);
}

// ─── 3. Microservices Architecture — Style 3 ───────────────────────────────

function genMicroservices(): string {
  return wrapXml(`
    ${bg('bg1', '#0a1628', 1080, 760)}
    ${title('t3', 'Microservices Architecture', 380, 8, '#caf0f8')}
    ${swim('L1', '01 // EDGE', 30, 48, 1020, 130, '#0b2040', '#0ea5e9', '#67e8f9')}
    ${swim('L2', '02 // APPLICATION SERVICES', 30, 198, 1020, 150, '#091525', '#0ea5e9', '#67e8f9')}
    ${swim('L3', '03 // DATA + EVENT INFRA', 30, 368, 1020, 150, '#0b2040', '#0ea5e9', '#67e8f9')}
    ${swim('L4', '04 // OBSERVABILITY', 30, 538, 1020, 110, '#091525', '#0ea5e9', '#67e8f9')}
    ${usr('n1', 'Client Apps', 60, 30, 80, 70, '#0b3b5e', '#67e8f9', 'L1')}
    ${hex('n2', 'API Gateway', 'EDGE', 260, 30, 170, 60, '#0b3b5e', '#67e8f9', 'L2')}
    ${node('n3', 'Auth / Policy', 'GUARD', 520, 36, 160, 55, '#0b3b5e', '#67e8f9', 'L1')}
    ${node('n4', 'Order Service', 'SERVICE', 60, 36, 160, 55, '#0b3b5e', '#67e8f9', 'L2')}
    ${node('n5', 'Catalog Service', 'SERVICE', 280, 36, 170, 55, '#0b3b5e', '#67e8f9', 'L2')}
    ${node('n6', 'Billing Service', 'SERVICE', 510, 36, 170, 55, '#0b3b5e', '#67e8f9', 'L2')}
    ${hex('n7', 'Event Router', 'STREAM', 760, 30, 170, 65, '#0b3b5e', '#fde047', 'L2')}
    ${cyl('n8', 'Postgres', 'orders', 80, 30, 140, 80, '#0b3b5e', '#67e8f9', 'L3')}
    ${node('n9', 'Redis Cache', 'LOW LATENCY', 310, 36, 150, 55, '#0b3b5e', '#67e8f9', 'L3')}
    ${cyl('n10', 'Warehouse', 'analytics', 540, 30, 150, 80, '#0b3b5e', '#67e8f9', 'L3')}
    ${node('n11', 'Metrics / Traces', 'OPS', 310, 36, 180, 44, '#0b3b5e', '#67e8f9', 'L4')}
    ${edge('e1', 'n1', 'n2', '#67e8f9', '2')}
    ${edge('e2', 'n2', 'n3', '#67e8f9', '1.5', 'dashed=1;dashPattern=5 3;', 'validate')}
    ${edge('e3', 'n2', 'n4', '#67e8f9', '2', '', 'route')}
    ${edge('e4', 'n2', 'n5', '#67e8f9', '2', '', 'route')}
    ${edge('e5', 'n2', 'n6', '#67e8f9', '2', '', 'route')}
    ${edge('e6', 'n4', 'n8', '#10b981', '1.5', '', 'query')}
    ${edge('e7', 'n5', 'n9', '#10b981', '1.5', '', 'cache')}
    ${edge('e8', 'n6', 'n10', '#f97316', '1.5', '', 'ETL')}
    ${edge('e9', 'n4', 'n7', '#fde047', '1.5', 'dashed=1;dashPattern=5 3;', 'publish')}
    ${edge('e10', 'n5', 'n7', '#fde047', '1.5', 'dashed=1;dashPattern=5 3;', 'publish')}
    ${edge('e11', 'n6', 'n7', '#fde047', '1.5', 'dashed=1;dashPattern=5 3;', 'publish')}
    ${edge('e12', 'n7', 'n11', '#67e8f9', '1.5', 'dashed=1;dashPattern=5 3;', 'events')}
    ${edge('e13', 'n8', 'n11', '#67e8f9', '1.5', 'dashed=1;dashPattern=5 3;', 'telemetry')}
    ${edge('e14', 'n10', 'n11', '#67e8f9', '1.5', 'dashed=1;dashPattern=5 3;', 'telemetry')}
    ${legend('lg3', '── Primary flow &#160;&#160; - - Control/Event &#160;&#160; ── Data read &#160;&#160; ── Data write', 30, 660, '#67e8f9')}
  `, 1080, 690);
}

// ─── 4. Agent Memory Types — Style 4 ────────────────────────────────────────

function genMemoryTypes(): string {
  return wrapXml(`
    ${title('t4', 'Agent Memory Types', 390, 10)}
    ${hex('c1', 'Agent', 'CORE CONTROLLER', 440, 280, 170, 70, '#ffffff', '#3b82f6')}
    ${node('n1', 'Sensory Memory', 'RAW INPUT', 420, 50, 180, 55, '#eff6ff', '#3b82f6')}
    ${node('n2', 'Working Memory', 'SCRATCHPAD', 730, 170, 180, 55, '#eff6ff', '#3b82f6')}
    ${node('n3', 'Episodic Memory', 'EXPERIENCE', 730, 420, 180, 55, '#eff6ff', '#3b82f6')}
    ${node('n4', 'Semantic Memory', 'KNOWLEDGE', 100, 420, 180, 55, '#eff6ff', '#3b82f6')}
    ${node('n5', 'Procedural Memory', 'SKILLS', 80, 170, 190, 55, '#eff6ff', '#3b82f6')}
    ${usr('n6', 'Input', 200, 50, 80, 70, '#dbeafe', '#3b82f6')}
    ${node('n7', 'Knowledge Base', 'EXTERNAL STORE', 80, 570, 180, 55, '#f0fdf4', '#10b981')}
    ${node('n8', 'Action Output', 'EXECUTION', 730, 570, 180, 55, '#fff7ed', '#f97316')}
    ${node('n9', 'Reflection', 'SELF-EVAL', 430, 570, 170, 55, '#f5f3ff', '#8b5cf6')}
    ${edge('e1', 'c1', 'n1', '#3b82f6', '2', '', 'perceive')}
    ${edge('e2', 'c1', 'n2', '#3b82f6', '2', '', 'reason')}
    ${edge('e3', 'c1', 'n3', '#8b5cf6', '1.5', 'dashed=1;dashPattern=5 3;', 'record')}
    ${edge('e4', 'c1', 'n4', '#10b981', '1.5', '', 'query')}
    ${edge('e5', 'c1', 'n5', '#f97316', '1.5', '', 'select skill')}
    ${edge('e6', 'n6', 'n1', '#3b82f6', '2', '', 'observe')}
    ${edge('e7', 'n1', 'n2', '#3b82f6', '1.5', '', 'filter')}
    ${edge('e8', 'n2', 'n3', '#8b5cf6', '1.5', 'dashed=1;dashPattern=5 3;', 'consolidate')}
    ${edge('e9', 'n3', 'n4', '#3b82f6', '1.5', '', 'abstract')}
    ${edge('e10', 'n4', 'n5', '#10b981', '1.5', '', 'ground')}
    ${edge('e11', 'n5', 'n8', '#f97316', '2', '', 'execute')}
    ${edge('e12', 'n5', 'c1', '#8b5cf6', '1.5', 'curved=1;', 'apply')}
    ${edge('e13', 'n3', 'n9', '#10b981', '1.5', '', 'review')}
    ${edge('e14', 'n9', 'n4', '#8b5cf6', '1.5', 'dashed=1;dashPattern=5 3;', 'insights')}
    ${edge('e15', 'n7', 'n4', '#10b981', '1.5', '', 'ingest')}
    ${edge('e16', 'n8', 'n9', '#8b5cf6', '1.5', 'curved=1;', 'evaluate')}
  `, 960, 650);
}

// ─── 5. Multi-Agent Collaboration — Style 5 ─────────────────────────────────

function genMultiagent(): string {
  return wrapXml(`
    ${bg('bg1', '#0d1117', 1080, 720)}
    ${title('t5', 'Multi-Agent Collaboration', 380, 8, '#e2e8f0')}
    ${swim('L1', 'Mission Control', 30, 48, 1020, 140, 'rgba(30,30,58,0.6)', '#7c3aed', '#a78bfa')}
    ${swim('L2', 'Specialist Agents', 30, 208, 1020, 170, 'rgba(26,26,46,0.6)', '#3b82f6', '#60a5fa')}
    ${swim('L3', 'Synthesis', 30, 398, 1020, 140, 'rgba(13,27,42,0.6)', '#10b981', '#34d399')}
    ${usr('n1', 'User brief', 60, 30, 90, 70, 'rgba(15,23,42,0.8)', '#a78bfa', 'L1')}
    ${hex('n2', 'Coordinator', 'ORCHESTRATOR', 360, 30, 170, 65, 'rgba(15,23,42,0.8)', '#7c3aed', 'L1')}
    ${node('n3', 'Shared Memory', 'CONTEXT', 700, 36, 160, 55, 'rgba(15,23,42,0.8)', '#8b5cf6', 'L1')}
    ${hex('n4', 'Research Agent', 'WEB + DOCS', 60, 30, 160, 65, 'rgba(15,23,42,0.8)', '#3b82f6', 'L2')}
    ${hex('n5', 'Coding Agent', 'IMPLEMENT', 310, 30, 160, 65, 'rgba(15,23,42,0.8)', '#3b82f6', 'L2')}
    ${hex('n6', 'Review Agent', 'QUALITY', 570, 30, 160, 65, 'rgba(15,23,42,0.8)', '#3b82f6', 'L2')}
    ${cyl('n7', 'Task Queue', 'JOBS', 810, 20, 140, 80, 'rgba(15,23,42,0.8)', '#6366f1', 'L2')}
    ${node('n8', 'Synthesis Engine', 'INTEGRATION LLM', 240, 36, 190, 55, 'rgba(15,23,42,0.8)', '#10b981', 'L3')}
    ${node('n9', 'Final Response', 'DELIVERED', 590, 36, 170, 55, 'rgba(15,23,42,0.8)', '#34d399', 'L3')}
    ${edge('e1', 'n1', 'n2', '#a78bfa', '2', '', 'assign')}
    ${edge('e2', 'n2', 'n4', '#3b82f6', '1.5', 'dashed=1;dashPattern=5 3;', 'delegate')}
    ${edge('e3', 'n2', 'n5', '#3b82f6', '1.5', 'dashed=1;dashPattern=5 3;', 'delegate')}
    ${edge('e4', 'n2', 'n6', '#3b82f6', '1.5', 'dashed=1;dashPattern=5 3;', 'delegate')}
    ${edge('e5', 'n4', 'n3', '#8b5cf6', '1.5', 'dashed=1;dashPattern=5 3;', 'findings')}
    ${edge('e6', 'n5', 'n3', '#8b5cf6', '1.5', 'dashed=1;dashPattern=5 3;', 'code')}
    ${edge('e7', 'n6', 'n3', '#8b5cf6', '1.5', 'dashed=1;dashPattern=5 3;', 'review')}
    ${edge('e8', 'n4', 'n5', '#3b82f6', '1.5', '', 'spec')}
    ${edge('e9', 'n5', 'n6', '#3b82f6', '2', '', 'PR')}
    ${edge('e10', 'n3', 'n8', '#10b981', '1.5', '', 'aggregate')}
    ${edge('e11', 'n8', 'n9', '#34d399', '2', '', 'compose')}
    ${edge('e12', 'n9', 'n1', '#8b5cf6', '1.5', 'curved=1;', 'deliver')}
  `, 1080, 560);
}

// ─── 6. System Architecture — Style 6 ───────────────────────────────────────

function genSystemArch(): string {
  return wrapXml(`
    ${bg('bg1', '#f8f6f3', 1080, 740)}
    ${title('t6', 'System Architecture', 390, 8, '#44403c')}
    ${node('lbl1', 'Interface Layer', 'LABEL', 20, 60, 130, 30, 'none', 'none', '1', 'fontStyle=1;fontSize=11;fontColor=#92400e;shadow=0;')}
    ${node('lbl2', 'Core Layer', 'LABEL', 20, 250, 130, 30, 'none', 'none', '1', 'fontStyle=1;fontSize=11;fontColor=#1e40af;shadow=0;')}
    ${node('lbl3', 'Foundation', 'LABEL', 20, 470, 130, 30, 'none', 'none', '1', 'fontStyle=1;fontSize=11;fontColor=#166534;shadow=0;')}
    ${swim('L1', '', 160, 50, 890, 140, '#fef3c7', '#d97706')}
    ${swim('L2', '', 160, 210, 890, 220, '#dbeafe', '#2563eb')}
    ${swim('L3', '', 160, 450, 890, 180, '#d1fae5', '#059669')}
    ${node('n1', 'Client Surface', 'UI / CLI / API', 190, 36, 160, 55, '#ffffff', '#d97706', 'L1')}
    ${hex('n2', 'Gateway', 'ROUTING', 450, 32, 160, 60, '#ffffff', '#d97706', 'L1')}
    ${node('n3', 'Registry', 'SERVICE CATALOG', 710, 36, 150, 55, '#ffffff', '#d97706', 'L1')}
    ${hex('n4', 'Task Planner', 'DECOMPOSITION', 190, 30, 160, 60, '#ffffff', '#2563eb', 'L2')}
    ${node('n5', 'Model Runtime', 'INFERENCE', 440, 36, 170, 55, '#f5f3ff', '#7c3aed', 'L2', 'strokeWidth=2;')}
    ${node('n6', 'Policy Guardrails', 'SAFETY', 710, 36, 170, 55, '#ffffff', '#dc2626', 'L2')}
    ${hex('n7', 'Tool Runtime', 'EXECUTION', 350, 120, 170, 60, '#ffffff', '#2563eb', 'L2')}
    ${cyl('n8', 'Memory Store', 'VECTOR + KV', 190, 36, 160, 80, '#ecfdf5', '#059669', 'L3')}
    ${node('n9', 'Observability', 'LOGS + TRACES', 490, 42, 170, 55, '#ffffff', '#059669', 'L3')}
    ${edge('e1', 'n1', 'n2', '#d97706', '2')}
    ${edge('e2', 'n2', 'n3', '#d97706', '1.5', 'dashed=1;dashPattern=5 3;', 'discover')}
    ${edge('e3', 'n2', 'n4', '#2563eb', '2', '', 'route')}
    ${edge('e4', 'n4', 'n5', '#7c3aed', '2', '', 'plan')}
    ${edge('e5', 'n5', 'n6', '#dc2626', '1.5', 'dashed=1;dashPattern=5 3;', 'check')}
    ${edge('e6', 'n4', 'n7', '#2563eb', '1.5', '', 'invoke')}
    ${edge('e7', 'n5', 'n8', '#059669', '1.5', '', 'recall')}
    ${edge('e8', 'n7', 'n8', '#059669', '1.5', 'dashed=1;dashPattern=5 3;', 'persist')}
    ${edge('e9', 'n5', 'n9', '#059669', '1.5', 'dashed=1;dashPattern=5 3;', 'log')}
    ${edge('e10', 'n7', 'n9', '#059669', '1.5', 'dashed=1;dashPattern=5 3;', 'trace')}
    ${edge('e11', 'n6', 'n7', '#dc2626', '1.5', 'curved=1;', 'guard')}
    ${edge('e12', 'n8', 'n4', '#059669', '1.5', 'curved=1;', 'context')}
    ${legend('lg4', '── Primary flow &#160;&#160; - - Control &#160;&#160; ── Data read &#160;&#160; - - Data write &#160;&#160; ~~ Feedback', 160, 645, '#78716c')}
  `, 1080, 680);
}

// ─── 7. API Integration Flow — Style 7 ──────────────────────────────────────

function genApiFlow(): string {
  return wrapXml(`
    ${title('t7', 'API Integration Flow', 390, 10)}
    ${swim('L1', 'Entry', 30, 50, 1020, 130, '#eff6ff', '#3b82f6')}
    ${swim('L2', 'Model + Tools', 30, 200, 1020, 200, '#f0fdf4', '#16a34a')}
    ${swim('L3', 'Delivery', 30, 420, 1020, 130, '#fff7ed', '#ea580c')}
    ${node('n1', 'Application', 'CLIENT', 60, 36, 160, 55, '#ffffff', '#3b82f6', 'L1')}
    ${node('n2', 'OpenAI SDK Layer', 'PYTHON / NODE', 360, 36, 190, 55, '#ffffff', '#3b82f6', 'L1')}
    ${node('n3', 'Prompt Builder', 'TEMPLATE', 730, 36, 170, 55, '#ffffff', '#3b82f6', 'L1')}
    ${node('n4', 'Model Runtime', 'GPT-4 / o1', 60, 36, 170, 55, '#f0fdf4', '#16a34a', 'L2', 'strokeWidth=2;')}
    ${hex('n5', 'Tool Calls', 'FUNCTION API', 320, 30, 170, 65, '#ffffff', '#16a34a', 'L2')}
    ${node('n6', 'Observability', 'LOGGING', 580, 36, 170, 55, '#ffffff', '#16a34a', 'L2')}
    ${node('n7', 'Response Formatter', 'STREAM + PARSE', 790, 36, 180, 55, '#ffffff', '#16a34a', 'L2')}
    ${node('n8', 'Release Control', 'FEATURE FLAG', 360, 36, 180, 55, '#ffffff', '#ea580c', 'L3')}
    ${usr('n9', 'End User', 730, 26, 80, 70, '#fff7ed', '#ea580c', 'L3')}
    ${edge('e1', 'n1', 'n2', '#3b82f6', '2', '', 'API call')}
    ${edge('e2', 'n2', 'n3', '#3b82f6', '1.5', 'dashed=1;dashPattern=5 3;', 'build')}
    ${edge('e3', 'n3', 'n4', '#16a34a', '2', '', 'prompt')}
    ${edge('e4', 'n4', 'n5', '#16a34a', '1.5', 'dashed=1;dashPattern=5 3;', 'invoke')}
    ${edge('e5', 'n5', 'n4', '#ea580c', '1.5', 'curved=1;', 'tool result')}
    ${edge('e6', 'n4', 'n6', '#16a34a', '1.5', 'dashed=1;dashPattern=5 3;', 'log')}
    ${edge('e7', 'n5', 'n6', '#16a34a', '1.5', 'dashed=1;dashPattern=5 3;', 'trace')}
    ${edge('e8', 'n4', 'n7', '#16a34a', '2', '', 'raw output')}
    ${edge('e9', 'n7', 'n8', '#ea580c', '2', '', 'format')}
    ${edge('e10', 'n8', 'n9', '#ea580c', '2', '', 'deliver')}
    ${edge('e11', 'n8', 'n2', '#8b5cf6', '1.5', 'curved=1;', 'config')}
    ${legend('lg5', '── Primary flow &#160;&#160; - - Control &#160;&#160; ~~ Feedback', 30, 565, '#6b7280')}
  `, 1080, 590);
}

// ─── Main ────────────────────────────────────────────────────────────────────

function generateAll() {
  if (existsSync(OUT_DIR)) {
    for (const f of readdirSync(OUT_DIR)) rmSync(resolve(OUT_DIR, f), { force: true });
  }
  mkdirSync(OUT_DIR, { recursive: true });

  console.log('Generating 7 sample diagrams...\n');

  const diagrams: [string, () => string][] = [
    ['mem0-style1', genMem0],
    ['toolcall-style2', genToolcall],
    ['microservices-style3', genMicroservices],
    ['memory-types-style4', genMemoryTypes],
    ['multiagent-style5', genMultiagent],
    ['system-arch-style6', genSystemArch],
    ['api-flow-style7', genApiFlow],
  ];

  for (const [name, fn] of diagrams) {
    writeFileSync(resolve(OUT_DIR, `${name}.drawio`), fn(), 'utf-8');
    console.log(`  ✓ ${name}.drawio`);
  }

  console.log('\n✅ Done!');
}

generateAll();
