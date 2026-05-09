/**
 * Generate 7 publication-quality .drawio sample diagrams.
 * Uses the DiagramBuilder API exclusively — no raw XML.
 *
 * Each diagram uses semantic node types (llm, agent, database, api, tool, etc.)
 * so node-builder.ts auto-applies distinct accent colors per type.
 * Each diagram uses semantic arrow flow types (primary, control, memoryRead, etc.)
 * for edge colors. Groups use addGroup() for swimlane/layer containers.
 *
 * Usage: npm run build && node -e "import('./dist/scripts/generate-samples.js')"
 */

import { DiagramBuilder } from '../builder/diagram-builder.js';
import { writeFileSync, mkdirSync, existsSync, rmSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const OUT_DIR = resolve(import.meta.dirname, '../../assets/samples');

// ─── 1. Mem0 Memory Architecture — Style 1 Flat Icon ────────────────────────

function buildMem0(): DiagramBuilder {
  const b = new DiagramBuilder({ style: 1, title: 'Mem0 Memory Architecture', width: 1080, height: 640 });

  // Layer groups (swimlanes)
  const inputLayer = b.addGroup({
    id: 'L1', label: 'Input Layer',
    x: 30, y: 55, width: 1020, height: 110,
    styleOverrides: {
      fillColor: '#f0f4ff', strokeColor: '#93b5f8', dashed: '1',
      fontStyle: '1', fontSize: '12', fontColor: '#374151',
      swimlaneLine: '1', arcSize: '6',
    },
  });

  const memMgrLayer = b.addGroup({
    id: 'L2', label: 'Memory Manager (mem0 Core)',
    x: 30, y: 185, width: 1020, height: 120,
    styleOverrides: {
      fillColor: '#fff7ed', strokeColor: '#f5a623', dashed: '1',
      fontStyle: '1', fontSize: '12', fontColor: '#374151',
      swimlaneLine: '1', arcSize: '6',
    },
  });

  const storageLayer = b.addGroup({
    id: 'L3', label: 'Storage Layer',
    x: 30, y: 325, width: 1020, height: 130,
    styleOverrides: {
      fillColor: '#f0fdf4', strokeColor: '#6bcb77', dashed: '1',
      fontStyle: '1', fontSize: '12', fontColor: '#374151',
      swimlaneLine: '1', arcSize: '6',
    },
  });

  const retrievalLayer = b.addGroup({
    id: 'L4', label: 'Output / Retrieval',
    x: 30, y: 475, width: 1020, height: 110,
    styleOverrides: {
      fillColor: '#fdf2f8', strokeColor: '#e086aa', dashed: '1',
      fontStyle: '1', fontSize: '12', fontColor: '#374151',
      swimlaneLine: '1', arcSize: '6',
    },
  });

  // Input Layer nodes
  const user = b.addNode({ type: 'user', label: 'User', x: 50, y: 80, width: 80, height: 60, parent: inputLayer });
  const aiApp = b.addNode({ type: 'process', label: 'AI App / Agent', subLabel: 'APPLICATION', x: 210, y: 82, width: 160, height: 56, parent: inputLayer });
  const llm = b.addNode({ type: 'llm', label: 'LLM', subLabel: 'MODEL', x: 450, y: 82, width: 140, height: 56, parent: inputLayer });
  const mem0Client = b.addNode({ type: 'process', label: 'mem0 Client', subLabel: 'SDK', x: 670, y: 82, width: 150, height: 56, parent: inputLayer });

  // Memory Manager nodes
  const factExt = b.addNode({ type: 'process', label: 'Fact Extractor', subLabel: 'PROCESSOR', x: 50, y: 215, width: 150, height: 56, parent: memMgrLayer });
  const memMgr = b.addNode({ type: 'agent', label: 'Memory Manager', subLabel: 'CORE ENGINE', x: 290, y: 212, width: 200, height: 60, parent: memMgrLayer });
  const conflict = b.addNode({ type: 'process', label: 'Conflict Resolver', subLabel: 'RESOLVER', x: 570, y: 215, width: 160, height: 56, parent: memMgrLayer });
  const graphDb = b.addNode({ type: 'api', label: 'Graph DB', subLabel: 'RELATIONS', x: 800, y: 215, width: 170, height: 56, parent: memMgrLayer });

  // Storage Layer nodes
  const vectorStore = b.addNode({ type: 'vector-store', label: 'Vector Store', subLabel: 'embeddings', x: 60, y: 358, width: 140, height: 72, parent: storageLayer });
  const kvStore = b.addNode({ type: 'database', label: 'Key-Value Store', subLabel: 'metadata', x: 280, y: 358, width: 150, height: 72, parent: storageLayer });
  const historyStore = b.addNode({ type: 'document', label: 'History Store', subLabel: 'EPISODIC', x: 500, y: 358, width: 150, height: 72, parent: storageLayer });
  const ctxBuilder = b.addNode({ type: 'process', label: 'Context Builder', subLabel: 'ASSEMBLER', x: 740, y: 362, width: 170, height: 56, parent: storageLayer });

  // Retrieval nodes
  const ranked = b.addNode({ type: 'process', label: 'Ranked Results', subLabel: 'RERANKER', x: 200, y: 500, width: 160, height: 52, parent: retrievalLayer });
  const response = b.addNode({ type: 'llm', label: 'Personalized Response', subLabel: 'OUTPUT', x: 500, y: 498, width: 200, height: 56, parent: retrievalLayer });

  // Edges — Input flow
  b.addEdge({ source: user, target: aiApp, flowType: 'primary' });
  b.addEdge({ source: aiApp, target: llm, label: 'query', flowType: 'primary' });
  b.addEdge({ source: llm, target: mem0Client, label: 'retrieve()', flowType: 'control' });
  b.addEdge({ source: mem0Client, target: factExt, label: 'extract', flowType: 'control' });
  b.addEdge({ source: factExt, target: memMgr, label: 'facts', flowType: 'control' });
  b.addEdge({ source: mem0Client, target: memMgr, label: 'store()', flowType: 'control' });
  b.addEdge({ source: memMgr, target: conflict, flowType: 'control' });

  // Edges — Memory writes
  b.addEdge({ source: memMgr, target: vectorStore, label: 'write', flowType: 'memoryWrite' });
  b.addEdge({ source: memMgr, target: kvStore, label: 'write', flowType: 'memoryWrite' });
  b.addEdge({ source: memMgr, target: historyStore, label: 'write', flowType: 'memoryWrite' });
  b.addEdge({ source: memMgr, target: graphDb, label: 'write', flowType: 'memoryWrite' });

  // Edges — Memory reads
  b.addEdge({ source: vectorStore, target: ctxBuilder, label: 'read', flowType: 'memoryRead' });
  b.addEdge({ source: kvStore, target: ctxBuilder, label: 'read', flowType: 'memoryRead' });
  b.addEdge({ source: historyStore, target: ctxBuilder, label: 'read', flowType: 'memoryRead' });

  // Edges — Retrieval
  b.addEdge({ source: ctxBuilder, target: ranked, label: 'score', flowType: 'primary' });
  b.addEdge({ source: ranked, target: response, label: 'deliver', flowType: 'primary' });

  return b;
}

// ─── 2. Tool Call Flow — Style 2 Dark Terminal ──────────────────────────────

function buildToolcall(): DiagramBuilder {
  const b = new DiagramBuilder({ style: 2, title: 'Tool Call Flow', width: 1080, height: 640 });

  const requestLayer = b.addGroup({
    id: 'L1', label: 'REQUEST PATH',
    x: 30, y: 55, width: 1020, height: 140,
    styleOverrides: {
      fillColor: '#111827', strokeColor: '#334155', dashed: '1',
      fontStyle: '1', fontSize: '12', fontColor: '#94a3b8',
      swimlaneLine: '1', arcSize: '6',
    },
  });

  const toolingLayer = b.addGroup({
    id: 'L2', label: 'TOOLING FABRIC',
    x: 30, y: 215, width: 1020, height: 180,
    styleOverrides: {
      fillColor: '#111827', strokeColor: '#334155', dashed: '1',
      fontStyle: '1', fontSize: '12', fontColor: '#94a3b8',
      swimlaneLine: '1', arcSize: '6',
    },
  });

  const knowledgeLayer = b.addGroup({
    id: 'L3', label: 'KNOWLEDGE + RESPONSE',
    x: 30, y: 415, width: 1020, height: 180,
    styleOverrides: {
      fillColor: '#111827', strokeColor: '#334155', dashed: '1',
      fontStyle: '1', fontSize: '12', fontColor: '#94a3b8',
      swimlaneLine: '1', arcSize: '6',
    },
  });

  // Request nodes
  const userQuery = b.addNode({ type: 'user', label: 'User query', x: 50, y: 80, width: 100, height: 70, parent: requestLayer });
  const retrieveChunks = b.addNode({ type: 'llm', label: 'Retrieve chunks', subLabel: 'EMBEDDING SEARCH', x: 230, y: 82, width: 170, height: 56, parent: requestLayer });
  const genAnswer = b.addNode({ type: 'process', label: 'Generate answer', subLabel: 'LLM INFERENCE', x: 480, y: 82, width: 170, height: 56, parent: requestLayer });
  const knowledgeBase = b.addNode({ type: 'vector-store', label: 'Knowledge base', subLabel: 'embeddings', x: 750, y: 75, width: 160, height: 72, parent: requestLayer });

  // Tooling nodes
  const agent = b.addNode({ type: 'agent', label: 'Agent', subLabel: 'ORCHESTRATOR', x: 210, y: 250, width: 150, height: 66, parent: toolingLayer });
  const terminal = b.addNode({ type: 'tool', label: 'Terminal', subLabel: 'EXECUTION', x: 490, y: 254, width: 150, height: 56, parent: toolingLayer });
  const sourceDocs = b.addNode({ type: 'document', label: 'Source documents', subLabel: 'CORPUS', x: 750, y: 248, width: 160, height: 68, parent: toolingLayer });

  // Knowledge nodes
  const grounded = b.addNode({ type: 'process', label: 'Grounded answer', subLabel: 'CITED OUTPUT', x: 370, y: 458, width: 170, height: 56, parent: knowledgeLayer });

  // Edges
  b.addEdge({ source: userQuery, target: retrieveChunks, label: 'embed', flowType: 'embedding' });
  b.addEdge({ source: retrieveChunks, target: genAnswer, label: 'context', flowType: 'primary' });
  b.addEdge({ source: retrieveChunks, target: knowledgeBase, label: 'search', flowType: 'control' });
  b.addEdge({ source: knowledgeBase, target: genAnswer, label: 'chunks', flowType: 'control' });
  b.addEdge({ source: userQuery, target: agent, label: 'dispatch', flowType: 'memoryRead' });
  b.addEdge({ source: agent, target: terminal, label: 'invoke', flowType: 'memoryRead' });
  b.addEdge({ source: terminal, target: sourceDocs, label: 'fetch', flowType: 'memoryRead' });
  b.addEdge({ source: sourceDocs, target: knowledgeBase, label: 'embed', flowType: 'embedding', edgeStyle: 'curved' });
  b.addEdge({ source: agent, target: grounded, label: 'respond', flowType: 'primary' });
  b.addEdge({ source: genAnswer, target: grounded, label: 'compose', flowType: 'primary' });
  b.addEdge({ source: terminal, target: agent, label: 'result', flowType: 'control' });

  return b;
}

// ─── 3. Microservices Architecture — Style 3 Blueprint ──────────────────────

function buildMicroservices(): DiagramBuilder {
  const b = new DiagramBuilder({ style: 3, title: 'Microservices Architecture', width: 1080, height: 700 });

  const edgeLayer = b.addGroup({
    id: 'L1', label: '01 // EDGE',
    x: 30, y: 55, width: 1020, height: 130,
    styleOverrides: {
      fillColor: '#0b2040', strokeColor: '#0ea5e9', dashed: '1',
      fontStyle: '1', fontSize: '12', fontColor: '#67e8f9',
      swimlaneLine: '1', arcSize: '6',
    },
  });

  const servicesLayer = b.addGroup({
    id: 'L2', label: '02 // APPLICATION SERVICES',
    x: 30, y: 205, width: 1020, height: 150,
    styleOverrides: {
      fillColor: '#091525', strokeColor: '#0ea5e9', dashed: '1',
      fontStyle: '1', fontSize: '12', fontColor: '#67e8f9',
      swimlaneLine: '1', arcSize: '6',
    },
  });

  const dataLayer = b.addGroup({
    id: 'L3', label: '03 // DATA + EVENT INFRA',
    x: 30, y: 375, width: 1020, height: 150,
    styleOverrides: {
      fillColor: '#0b2040', strokeColor: '#0ea5e9', dashed: '1',
      fontStyle: '1', fontSize: '12', fontColor: '#67e8f9',
      swimlaneLine: '1', arcSize: '6',
    },
  });

  const opsLayer = b.addGroup({
    id: 'L4', label: '04 // OBSERVABILITY',
    x: 30, y: 545, width: 1020, height: 110,
    styleOverrides: {
      fillColor: '#091525', strokeColor: '#0ea5e9', dashed: '1',
      fontStyle: '1', fontSize: '12', fontColor: '#67e8f9',
      swimlaneLine: '1', arcSize: '6',
    },
  });

  // Edge layer
  const clientApps = b.addNode({ type: 'user', label: 'Client Apps', x: 70, y: 80, width: 80, height: 60, parent: edgeLayer });
  const apiGateway = b.addNode({ type: 'api', label: 'API Gateway', subLabel: 'EDGE', x: 270, y: 80, width: 170, height: 56, parent: edgeLayer });
  const authPolicy = b.addNode({ type: 'process', label: 'Auth / Policy', subLabel: 'GUARD', x: 530, y: 82, width: 160, height: 52, parent: edgeLayer });

  // Service layer
  const orderSvc = b.addNode({ type: 'process', label: 'Order Service', subLabel: 'SERVICE', x: 70, y: 242, width: 160, height: 52, parent: servicesLayer });
  const catalogSvc = b.addNode({ type: 'process', label: 'Catalog Service', subLabel: 'SERVICE', x: 290, y: 242, width: 170, height: 52, parent: servicesLayer });
  const billingSvc = b.addNode({ type: 'process', label: 'Billing Service', subLabel: 'SERVICE', x: 520, y: 242, width: 170, height: 52, parent: servicesLayer });
  const eventRouter = b.addNode({ type: 'api', label: 'Event Router', subLabel: 'STREAM', x: 770, y: 236, width: 170, height: 62, parent: servicesLayer });

  // Data layer
  const postgres = b.addNode({ type: 'database', label: 'Postgres', subLabel: 'orders', x: 90, y: 408, width: 140, height: 72, parent: dataLayer });
  const redis = b.addNode({ type: 'memory-short', label: 'Redis Cache', subLabel: 'LOW LATENCY', x: 320, y: 412, width: 150, height: 52, parent: dataLayer });
  const warehouse = b.addNode({ type: 'database', label: 'Warehouse', subLabel: 'analytics', x: 550, y: 408, width: 150, height: 72, parent: dataLayer });

  // Ops layer
  const metrics = b.addNode({ type: 'process', label: 'Metrics / Traces', subLabel: 'OPS', x: 320, y: 570, width: 180, height: 44, parent: opsLayer });

  // Edges — Edge → Services
  b.addEdge({ source: clientApps, target: apiGateway, flowType: 'primary' });
  b.addEdge({ source: apiGateway, target: authPolicy, label: 'validate', flowType: 'control' });
  b.addEdge({ source: apiGateway, target: orderSvc, label: 'route', flowType: 'primary' });
  b.addEdge({ source: apiGateway, target: catalogSvc, label: 'route', flowType: 'primary' });
  b.addEdge({ source: apiGateway, target: billingSvc, label: 'route', flowType: 'primary' });

  // Edges — Services → Data
  b.addEdge({ source: orderSvc, target: postgres, label: 'query', flowType: 'memoryRead' });
  b.addEdge({ source: catalogSvc, target: redis, label: 'cache', flowType: 'memoryRead' });
  b.addEdge({ source: billingSvc, target: warehouse, label: 'ETL', flowType: 'primary' });

  // Edges — Events
  b.addEdge({ source: orderSvc, target: eventRouter, label: 'publish', flowType: 'async' });
  b.addEdge({ source: catalogSvc, target: eventRouter, label: 'publish', flowType: 'async' });
  b.addEdge({ source: billingSvc, target: eventRouter, label: 'publish', flowType: 'async' });

  // Edges — Observability
  b.addEdge({ source: eventRouter, target: metrics, label: 'events', flowType: 'async' });
  b.addEdge({ source: postgres, target: metrics, label: 'telemetry', flowType: 'async' });
  b.addEdge({ source: warehouse, target: metrics, label: 'telemetry', flowType: 'async' });

  return b;
}

// ─── 4. Agent Memory Types — Style 4 Notion Clean ──────────────────────────

function buildMemoryTypes(): DiagramBuilder {
  const b = new DiagramBuilder({ style: 4, title: 'Agent Memory Types', width: 960, height: 660 });

  // Central agent node
  const agentCore = b.addNode({ type: 'agent', label: 'Agent', subLabel: 'CORE CONTROLLER', x: 440, y: 290, width: 170, height: 66 });

  // Radial memory nodes
  const sensory = b.addNode({ type: 'process', label: 'Sensory Memory', subLabel: 'RAW INPUT', x: 420, y: 60, width: 180, height: 52 });
  const working = b.addNode({ type: 'memory-short', label: 'Working Memory', subLabel: 'SCRATCHPAD', x: 730, y: 180, width: 180, height: 52 });
  const episodic = b.addNode({ type: 'memory-long', label: 'Episodic Memory', subLabel: 'EXPERIENCE', x: 730, y: 430, width: 180, height: 52 });
  const semantic = b.addNode({ type: 'vector-store', label: 'Semantic Memory', subLabel: 'KNOWLEDGE', x: 100, y: 430, width: 180, height: 52 });
  const procedural = b.addNode({ type: 'tool', label: 'Procedural Memory', subLabel: 'SKILLS', x: 80, y: 180, width: 190, height: 52 });

  // External nodes
  const input = b.addNode({ type: 'user', label: 'Input', x: 210, y: 60, width: 80, height: 64 });
  const knowledgeBase = b.addNode({ type: 'database', label: 'Knowledge Base', subLabel: 'EXTERNAL STORE', x: 80, y: 580, width: 180, height: 52 });
  const actionOutput = b.addNode({ type: 'process', label: 'Action Output', subLabel: 'EXECUTION', x: 730, y: 580, width: 180, height: 52 });
  const reflection = b.addNode({ type: 'llm', label: 'Reflection', subLabel: 'SELF-EVAL', x: 430, y: 580, width: 170, height: 52 });

  // Agent → memories
  b.addEdge({ source: agentCore, target: sensory, label: 'perceive', flowType: 'primary' });
  b.addEdge({ source: agentCore, target: working, label: 'reason', flowType: 'primary' });
  b.addEdge({ source: agentCore, target: episodic, label: 'record', flowType: 'feedback' });
  b.addEdge({ source: agentCore, target: semantic, label: 'query', flowType: 'memoryRead' });
  b.addEdge({ source: agentCore, target: procedural, label: 'select skill', flowType: 'control' });

  // Memory flow chain
  b.addEdge({ source: input, target: sensory, label: 'observe', flowType: 'primary' });
  b.addEdge({ source: sensory, target: working, label: 'filter', flowType: 'primary' });
  b.addEdge({ source: working, target: episodic, label: 'consolidate', flowType: 'feedback' });
  b.addEdge({ source: episodic, target: semantic, label: 'abstract', flowType: 'primary' });
  b.addEdge({ source: semantic, target: procedural, label: 'ground', flowType: 'memoryRead' });
  b.addEdge({ source: procedural, target: actionOutput, label: 'execute', flowType: 'primary' });
  b.addEdge({ source: procedural, target: agentCore, label: 'apply', flowType: 'feedback' });
  b.addEdge({ source: episodic, target: reflection, label: 'review', flowType: 'memoryRead' });
  b.addEdge({ source: reflection, target: semantic, label: 'insights', flowType: 'feedback' });
  b.addEdge({ source: knowledgeBase, target: semantic, label: 'ingest', flowType: 'memoryRead' });
  b.addEdge({ source: actionOutput, target: reflection, label: 'evaluate', flowType: 'feedback' });

  return b;
}

// ─── 5. Multi-Agent Collaboration — Style 5 Glassmorphism ──────────────────

function buildMultiagent(): DiagramBuilder {
  const b = new DiagramBuilder({ style: 5, title: 'Multi-Agent Collaboration', width: 1080, height: 570 });

  const missionLayer = b.addGroup({
    id: 'L1', label: 'Mission Control',
    x: 30, y: 55, width: 1020, height: 140,
    styleOverrides: {
      fillColor: 'rgba(30,30,58,0.6)', strokeColor: '#7c3aed', dashed: '1',
      fontStyle: '1', fontSize: '12', fontColor: '#a78bfa',
      swimlaneLine: '1', arcSize: '6',
    },
  });

  const specialistLayer = b.addGroup({
    id: 'L2', label: 'Specialist Agents',
    x: 30, y: 215, width: 1020, height: 170,
    styleOverrides: {
      fillColor: 'rgba(26,26,46,0.6)', strokeColor: '#3b82f6', dashed: '1',
      fontStyle: '1', fontSize: '12', fontColor: '#60a5fa',
      swimlaneLine: '1', arcSize: '6',
    },
  });

  const synthesisLayer = b.addGroup({
    id: 'L3', label: 'Synthesis',
    x: 30, y: 405, width: 1020, height: 140,
    styleOverrides: {
      fillColor: 'rgba(13,27,42,0.6)', strokeColor: '#10b981', dashed: '1',
      fontStyle: '1', fontSize: '12', fontColor: '#34d399',
      swimlaneLine: '1', arcSize: '6',
    },
  });

  // Mission Control nodes
  const userBrief = b.addNode({ type: 'user', label: 'User brief', x: 70, y: 82, width: 90, height: 64, parent: missionLayer });
  const coordinator = b.addNode({ type: 'agent', label: 'Coordinator', subLabel: 'ORCHESTRATOR', x: 370, y: 80, width: 170, height: 62, parent: missionLayer });
  const sharedMem = b.addNode({ type: 'memory-short', label: 'Shared Memory', subLabel: 'CONTEXT', x: 710, y: 82, width: 160, height: 52, parent: missionLayer });

  // Specialist nodes
  const researchAgent = b.addNode({ type: 'agent', label: 'Research Agent', subLabel: 'WEB + DOCS', x: 70, y: 250, width: 160, height: 62, parent: specialistLayer });
  const codingAgent = b.addNode({ type: 'agent', label: 'Coding Agent', subLabel: 'IMPLEMENT', x: 320, y: 250, width: 160, height: 62, parent: specialistLayer });
  const reviewAgent = b.addNode({ type: 'agent', label: 'Review Agent', subLabel: 'QUALITY', x: 580, y: 250, width: 160, height: 62, parent: specialistLayer });
  const taskQueue = b.addNode({ type: 'queue', label: 'Task Queue', subLabel: 'JOBS', x: 820, y: 244, width: 140, height: 72, parent: specialistLayer });

  // Synthesis nodes
  const synthesisEngine = b.addNode({ type: 'llm', label: 'Synthesis Engine', subLabel: 'INTEGRATION LLM', x: 250, y: 432, width: 190, height: 52, parent: synthesisLayer });
  const finalResponse = b.addNode({ type: 'process', label: 'Final Response', subLabel: 'DELIVERED', x: 600, y: 432, width: 170, height: 52, parent: synthesisLayer });

  // Edges
  b.addEdge({ source: userBrief, target: coordinator, label: 'assign', flowType: 'primary' });
  b.addEdge({ source: coordinator, target: researchAgent, label: 'delegate', flowType: 'control' });
  b.addEdge({ source: coordinator, target: codingAgent, label: 'delegate', flowType: 'control' });
  b.addEdge({ source: coordinator, target: reviewAgent, label: 'delegate', flowType: 'control' });
  b.addEdge({ source: researchAgent, target: sharedMem, label: 'findings', flowType: 'feedback' });
  b.addEdge({ source: codingAgent, target: sharedMem, label: 'code', flowType: 'feedback' });
  b.addEdge({ source: reviewAgent, target: sharedMem, label: 'review', flowType: 'feedback' });
  b.addEdge({ source: researchAgent, target: codingAgent, label: 'spec', flowType: 'primary' });
  b.addEdge({ source: codingAgent, target: reviewAgent, label: 'PR', flowType: 'primary' });
  b.addEdge({ source: sharedMem, target: synthesisEngine, label: 'aggregate', flowType: 'memoryRead' });
  b.addEdge({ source: synthesisEngine, target: finalResponse, label: 'compose', flowType: 'primary' });
  b.addEdge({ source: finalResponse, target: userBrief, label: 'deliver', flowType: 'feedback' });

  return b;
}

// ─── 6. System Architecture — Style 6 Claude Official ──────────────────────

function buildSystemArch(): DiagramBuilder {
  const b = new DiagramBuilder({ style: 6, title: 'System Architecture', width: 1080, height: 700 });

  // Layer labels (left side)
  b.addNode({ type: 'raw', label: 'Interface Layer', x: 20, y: 72, width: 130, height: 28,
    styleOverrides: { fontStyle: '1', fontSize: '11', fontColor: '#92400e', shadow: '0', fillColor: 'none', strokeColor: 'none' } });
  b.addNode({ type: 'raw', label: 'Core Layer', x: 20, y: 262, width: 130, height: 28,
    styleOverrides: { fontStyle: '1', fontSize: '11', fontColor: '#1e40af', shadow: '0', fillColor: 'none', strokeColor: 'none' } });
  b.addNode({ type: 'raw', label: 'Foundation', x: 20, y: 482, width: 130, height: 28,
    styleOverrides: { fontStyle: '1', fontSize: '11', fontColor: '#166534', shadow: '0', fillColor: 'none', strokeColor: 'none' } });

  // Swimlane containers
  const interfaceGrp = b.addGroup({
    id: 'L1', x: 160, y: 60, width: 890, height: 140,
    styleOverrides: {
      fillColor: '#fef3c7', strokeColor: '#d97706', dashed: '1',
      swimlaneLine: '1', arcSize: '6',
    },
  });

  const coreGrp = b.addGroup({
    id: 'L2', x: 160, y: 220, width: 890, height: 220,
    styleOverrides: {
      fillColor: '#dbeafe', strokeColor: '#2563eb', dashed: '1',
      swimlaneLine: '1', arcSize: '6',
    },
  });

  const foundationGrp = b.addGroup({
    id: 'L3', x: 160, y: 460, width: 890, height: 180,
    styleOverrides: {
      fillColor: '#d1fae5', strokeColor: '#059669', dashed: '1',
      swimlaneLine: '1', arcSize: '6',
    },
  });

  // Interface nodes
  const clientSurface = b.addNode({ type: 'process', label: 'Client Surface', subLabel: 'UI / CLI / API', x: 190, y: 90, width: 160, height: 52, parent: interfaceGrp });
  const gateway = b.addNode({ type: 'api', label: 'Gateway', subLabel: 'ROUTING', x: 450, y: 86, width: 160, height: 56, parent: interfaceGrp });
  const registry = b.addNode({ type: 'process', label: 'Registry', subLabel: 'SERVICE CATALOG', x: 710, y: 90, width: 150, height: 52, parent: interfaceGrp });

  // Core nodes
  const taskPlanner = b.addNode({ type: 'agent', label: 'Task Planner', subLabel: 'DECOMPOSITION', x: 190, y: 244, width: 160, height: 56, parent: coreGrp });
  const modelRuntime = b.addNode({ type: 'llm', label: 'Model Runtime', subLabel: 'INFERENCE', x: 440, y: 248, width: 170, height: 52, parent: coreGrp });
  const policyGuard = b.addNode({ type: 'external', label: 'Policy Guardrails', subLabel: 'SAFETY', x: 710, y: 248, width: 170, height: 52, parent: coreGrp });
  const toolRuntime = b.addNode({ type: 'tool', label: 'Tool Runtime', subLabel: 'EXECUTION', x: 350, y: 330, width: 170, height: 56, parent: coreGrp });

  // Foundation nodes
  const memoryStore = b.addNode({ type: 'vector-store', label: 'Memory Store', subLabel: 'VECTOR + KV', x: 190, y: 490, width: 160, height: 72, parent: foundationGrp });
  const observability = b.addNode({ type: 'process', label: 'Observability', subLabel: 'LOGS + TRACES', x: 490, y: 496, width: 170, height: 52, parent: foundationGrp });

  // Edges
  b.addEdge({ source: clientSurface, target: gateway, flowType: 'primary' });
  b.addEdge({ source: gateway, target: registry, label: 'discover', flowType: 'control' });
  b.addEdge({ source: gateway, target: taskPlanner, label: 'route', flowType: 'primary' });
  b.addEdge({ source: taskPlanner, target: modelRuntime, label: 'plan', flowType: 'primary' });
  b.addEdge({ source: modelRuntime, target: policyGuard, label: 'check', flowType: 'control' });
  b.addEdge({ source: taskPlanner, target: toolRuntime, label: 'invoke', flowType: 'primary' });
  b.addEdge({ source: modelRuntime, target: memoryStore, label: 'recall', flowType: 'memoryRead' });
  b.addEdge({ source: toolRuntime, target: memoryStore, label: 'persist', flowType: 'memoryWrite' });
  b.addEdge({ source: modelRuntime, target: observability, label: 'log', flowType: 'async' });
  b.addEdge({ source: toolRuntime, target: observability, label: 'trace', flowType: 'async' });
  b.addEdge({ source: policyGuard, target: toolRuntime, label: 'guard', flowType: 'feedback' });
  b.addEdge({ source: memoryStore, target: taskPlanner, label: 'context', flowType: 'feedback' });

  return b;
}

// ─── 7. API Integration Flow — Style 7 OpenAI Official ─────────────────────

function buildApiFlow(): DiagramBuilder {
  const b = new DiagramBuilder({ style: 7, title: 'API Integration Flow', width: 1080, height: 600 });

  const entryLayer = b.addGroup({
    id: 'L1', label: 'Entry',
    x: 30, y: 55, width: 1020, height: 130,
    styleOverrides: {
      fillColor: '#eff6ff', strokeColor: '#3b82f6', dashed: '1',
      fontStyle: '1', fontSize: '12', fontColor: '#1e40af',
      swimlaneLine: '1', arcSize: '6',
    },
  });

  const modelToolsLayer = b.addGroup({
    id: 'L2', label: 'Model + Tools',
    x: 30, y: 205, width: 1020, height: 200,
    styleOverrides: {
      fillColor: '#f0fdf4', strokeColor: '#16a34a', dashed: '1',
      fontStyle: '1', fontSize: '12', fontColor: '#166534',
      swimlaneLine: '1', arcSize: '6',
    },
  });

  const deliveryLayer = b.addGroup({
    id: 'L3', label: 'Delivery',
    x: 30, y: 425, width: 1020, height: 130,
    styleOverrides: {
      fillColor: '#fff7ed', strokeColor: '#ea580c', dashed: '1',
      fontStyle: '1', fontSize: '12', fontColor: '#9a3412',
      swimlaneLine: '1', arcSize: '6',
    },
  });

  // Entry nodes
  const application = b.addNode({ type: 'process', label: 'Application', subLabel: 'CLIENT', x: 70, y: 88, width: 160, height: 52, parent: entryLayer });
  const sdkLayer = b.addNode({ type: 'api', label: 'OpenAI SDK Layer', subLabel: 'PYTHON / NODE', x: 370, y: 86, width: 190, height: 52, parent: entryLayer });
  const promptBuilder = b.addNode({ type: 'process', label: 'Prompt Builder', subLabel: 'TEMPLATE', x: 740, y: 88, width: 170, height: 52, parent: entryLayer });

  // Model + Tools nodes
  const modelRuntime = b.addNode({ type: 'llm', label: 'Model Runtime', subLabel: 'GPT-4 / o1', x: 70, y: 242, width: 170, height: 52, parent: modelToolsLayer });
  const toolCalls = b.addNode({ type: 'tool', label: 'Tool Calls', subLabel: 'FUNCTION API', x: 330, y: 236, width: 170, height: 62, parent: modelToolsLayer });
  const observability = b.addNode({ type: 'process', label: 'Observability', subLabel: 'LOGGING', x: 590, y: 242, width: 170, height: 52, parent: modelToolsLayer });
  const responseFmt = b.addNode({ type: 'process', label: 'Response Formatter', subLabel: 'STREAM + PARSE', x: 800, y: 242, width: 180, height: 52, parent: modelToolsLayer });

  // Delivery nodes
  const releaseCtrl = b.addNode({ type: 'process', label: 'Release Control', subLabel: 'FEATURE FLAG', x: 370, y: 458, width: 180, height: 52, parent: deliveryLayer });
  const endUser = b.addNode({ type: 'user', label: 'End User', x: 740, y: 448, width: 80, height: 64, parent: deliveryLayer });

  // Edges
  b.addEdge({ source: application, target: sdkLayer, label: 'API call', flowType: 'primary' });
  b.addEdge({ source: sdkLayer, target: promptBuilder, label: 'build', flowType: 'control' });
  b.addEdge({ source: promptBuilder, target: modelRuntime, label: 'prompt', flowType: 'primary' });
  b.addEdge({ source: modelRuntime, target: toolCalls, label: 'invoke', flowType: 'control' });
  b.addEdge({ source: toolCalls, target: modelRuntime, label: 'tool result', flowType: 'feedback' });
  b.addEdge({ source: modelRuntime, target: observability, label: 'log', flowType: 'async' });
  b.addEdge({ source: toolCalls, target: observability, label: 'trace', flowType: 'async' });
  b.addEdge({ source: modelRuntime, target: responseFmt, label: 'raw output', flowType: 'primary' });
  b.addEdge({ source: responseFmt, target: releaseCtrl, label: 'format', flowType: 'primary' });
  b.addEdge({ source: releaseCtrl, target: endUser, label: 'deliver', flowType: 'primary' });
  b.addEdge({ source: releaseCtrl, target: sdkLayer, label: 'config', flowType: 'feedback' });

  return b;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function generateAll() {
  if (existsSync(OUT_DIR)) {
    for (const f of readdirSync(OUT_DIR)) rmSync(resolve(OUT_DIR, f), { force: true });
  }
  mkdirSync(OUT_DIR, { recursive: true });

  console.log('Generating 7 sample diagrams via DiagramBuilder API...\n');

  const diagrams: [string, () => DiagramBuilder][] = [
    ['mem0-style1', buildMem0],
    ['toolcall-style2', buildToolcall],
    ['microservices-style3', buildMicroservices],
    ['memory-types-style4', buildMemoryTypes],
    ['multiagent-style5', buildMultiagent],
    ['system-arch-style6', buildSystemArch],
    ['api-flow-style7', buildApiFlow],
  ];

  for (const [name, buildFn] of diagrams) {
    const builder = buildFn();
    const outPath = resolve(OUT_DIR, `${name}.drawio`);
    await builder.toFile(outPath);
    console.log(`  ✓ ${name}.drawio`);
  }

  console.log('\n✅ Done! All 7 diagrams generated using DiagramBuilder API.');
}

generateAll().catch((err) => {
  console.error('Generation failed:', err);
  process.exit(1);
});
