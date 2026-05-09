/**
 * Generate 7 high-quality sample .drawio diagram files matching
 * the fireworks-tech-graph showcase.
 *
 * Each diagram uses a different style (1-7) and a different diagram type:
 *   1. Mem0 Memory Architecture       (style 1 - Flat Icon)
 *   2. Tool Call Flow                  (style 2 - Dark Terminal)
 *   3. Microservices Architecture      (style 3 - Blueprint)
 *   4. Agent Memory Types              (style 4 - Notion Clean)
 *   5. Multi-Agent Collaboration       (style 5 - Glassmorphism)
 *   6. System Architecture             (style 6 - Claude Official)
 *   7. API Integration Flow            (style 7 - OpenAI Official)
 *
 * Usage: npx tsx src/scripts/generate-samples.ts
 */

import { writeFileSync, mkdirSync, existsSync, rmSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { DiagramBuilder } from '../builder/diagram-builder.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '../../assets/samples');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function cleanDir(dir: string) {
  if (existsSync(dir)) {
    for (const f of readdirSync(dir)) {
      rmSync(resolve(dir, f), { force: true });
    }
  }
  ensureDir(dir);
}

function saveDrawio(name: string, builder: DiagramBuilder) {
  const path = resolve(OUT_DIR, `${name}.drawio`);
  writeFileSync(path, builder.toDrawioFile(), 'utf-8');
  console.log(`  ✓ ${name}.drawio`);
  return path;
}

// ---------------------------------------------------------------------------
// 1. Mem0 Memory Architecture — Style 1 (Flat Icon)
// ---------------------------------------------------------------------------

function generateMem0Style1(): DiagramBuilder {
  const b = new DiagramBuilder({ style: 1, title: 'Mem0 Memory Architecture', width: 1080, height: 760 });

  // ── Swimlane groups ──────────────────────────────────────────────────
  const gInput = b.addGroup({
    label: 'Input Layer',
    x: 20, y: 50, width: 1040, height: 130,
    styleOverrides: { fillColor: '#F0F4FF', strokeColor: '#93B5F8', dashed: '1', fontSize: '13', fontStyle: '1' },
  });
  const gCore = b.addGroup({
    label: 'Memory Manager (mem0 Core)',
    x: 20, y: 200, width: 1040, height: 150,
    styleOverrides: { fillColor: '#FFF7ED', strokeColor: '#F5A623', dashed: '1', fontSize: '13', fontStyle: '1' },
  });
  const gStorage = b.addGroup({
    label: 'Storage Layer',
    x: 20, y: 370, width: 1040, height: 150,
    styleOverrides: { fillColor: '#F0FDF4', strokeColor: '#6BCB77', dashed: '1', fontSize: '13', fontStyle: '1' },
  });
  const gOutput = b.addGroup({
    label: 'Output / Retrieval',
    x: 20, y: 540, width: 1040, height: 150,
    styleOverrides: { fillColor: '#FDF2F8', strokeColor: '#E086AA', dashed: '1', fontSize: '13', fontStyle: '1' },
  });

  // ── Input Layer nodes ────────────────────────────────────────────────
  const nUser = b.addNode({ type: 'user', label: 'User', x: 200, y: 80, width: 130, height: 50, subLabel: 'End User', parent: gInput });
  const nAiApp = b.addNode({ type: 'agent', label: 'AI App / Agent', x: 500, y: 80, width: 160, height: 50, subLabel: 'Application', parent: gInput });

  // ── Memory Manager nodes ─────────────────────────────────────────────
  const nLlm = b.addNode({ type: 'llm', label: 'LLM', x: 40, y: 235, width: 130, height: 50, subLabel: 'Language Model', parent: gCore });
  const nMem0Client = b.addNode({ type: 'api', label: 'mem0 Client', x: 220, y: 235, width: 150, height: 50, subLabel: 'SDK', parent: gCore });
  const nFactExt = b.addNode({ type: 'process', label: 'Fact Extractor', x: 420, y: 235, width: 150, height: 50, subLabel: 'NLP Pipeline', parent: gCore });
  const nMemMgr = b.addNode({ type: 'agent', label: 'Memory Manager', x: 620, y: 235, width: 160, height: 50, subLabel: 'Core Engine', parent: gCore });
  const nConflict = b.addNode({ type: 'process', label: 'Conflict Resolver', x: 830, y: 235, width: 160, height: 50, subLabel: 'Dedup Engine', parent: gCore });

  // ── Storage Layer nodes ──────────────────────────────────────────────
  const nVec = b.addNode({ type: 'database', label: 'Vector Store', x: 50, y: 405, width: 150, height: 60, subLabel: 'Embeddings', parent: gStorage });
  const nGraph = b.addNode({ type: 'database', label: 'Graph DB', x: 260, y: 405, width: 150, height: 60, subLabel: 'Relations', parent: gStorage });
  const nKv = b.addNode({ type: 'database', label: 'Key-Value Store', x: 470, y: 405, width: 160, height: 60, subLabel: 'Metadata', parent: gStorage });
  const nHist = b.addNode({ type: 'database', label: 'History Store', x: 690, y: 405, width: 160, height: 60, subLabel: 'Timeline', parent: gStorage });

  // ── Output nodes ─────────────────────────────────────────────────────
  const nCtxBuilder = b.addNode({ type: 'process', label: 'Context Builder', x: 200, y: 575, width: 160, height: 50, subLabel: 'Retrieval', parent: gOutput });
  const nRanked = b.addNode({ type: 'process', label: 'Ranked Results', x: 480, y: 575, width: 160, height: 50, subLabel: 'Scoring', parent: gOutput });
  const nResponse = b.addNode({ type: 'user', label: 'Personalized Response', x: 750, y: 575, width: 190, height: 50, subLabel: 'Output', parent: gOutput });

  // ── Edges ────────────────────────────────────────────────────────────
  b.addEdge({ source: nUser, target: nAiApp, label: 'query', flowType: 'primary' });
  b.addEdge({ source: nAiApp, target: nMem0Client, label: 'API call', flowType: 'primary' });
  b.addEdge({ source: nMem0Client, target: nFactExt, label: 'extract', flowType: 'control' });
  b.addEdge({ source: nFactExt, target: nLlm, label: 'parse', flowType: 'control' });
  b.addEdge({ source: nMem0Client, target: nMemMgr, label: 'manage', flowType: 'control' });
  b.addEdge({ source: nMemMgr, target: nConflict, label: 'dedup', flowType: 'control' });
  b.addEdge({ source: nMemMgr, target: nVec, label: 'embed', flowType: 'memoryWrite' });
  b.addEdge({ source: nMemMgr, target: nGraph, label: 'relations', flowType: 'memoryWrite' });
  b.addEdge({ source: nMemMgr, target: nKv, label: 'meta', flowType: 'memoryWrite' });
  b.addEdge({ source: nMemMgr, target: nHist, label: 'log', flowType: 'memoryWrite' });
  b.addEdge({ source: nVec, target: nCtxBuilder, label: 'retrieve', flowType: 'memoryRead' });
  b.addEdge({ source: nGraph, target: nCtxBuilder, label: 'graph', flowType: 'memoryRead' });
  b.addEdge({ source: nCtxBuilder, target: nRanked, label: 'score', flowType: 'embedding' });
  b.addEdge({ source: nRanked, target: nResponse, label: 'deliver', flowType: 'primary' });
  b.addEdge({ source: nResponse, target: nAiApp, label: 'feedback', flowType: 'feedback' });

  return b;
}

// ---------------------------------------------------------------------------
// 2. Tool Call Flow — Style 2 (Dark Terminal)
// ---------------------------------------------------------------------------

function generateToolcallStyle2(): DiagramBuilder {
  const b = new DiagramBuilder({ style: 2, title: 'Tool Call Flow', width: 1080, height: 760 });

  // ── Swimlane groups ──────────────────────────────────────────────────
  const gRequest = b.addGroup({
    label: 'REQUEST PATH',
    x: 20, y: 50, width: 1040, height: 200,
    styleOverrides: { fillColor: '#1a1a2e', strokeColor: '#4a90d9', dashed: '1', fontSize: '13', fontStyle: '1' },
  });
  const gTooling = b.addGroup({
    label: 'TOOLING FABRIC',
    x: 20, y: 270, width: 1040, height: 200,
    styleOverrides: { fillColor: '#16213e', strokeColor: '#e94560', dashed: '1', fontSize: '13', fontStyle: '1' },
  });
  const gKnowledge = b.addGroup({
    label: 'KNOWLEDGE + RESPONSE',
    x: 20, y: 490, width: 1040, height: 200,
    styleOverrides: { fillColor: '#0f3460', strokeColor: '#53d769', dashed: '1', fontSize: '13', fontStyle: '1' },
  });

  // ── REQUEST PATH nodes ───────────────────────────────────────────────
  const nUserQuery = b.addNode({ type: 'user', label: 'User query', x: 80, y: 90, width: 150, height: 55, subLabel: 'Input', parent: gRequest });
  const nRetrieve = b.addNode({ type: 'process', label: 'Retrieve chunks', x: 380, y: 90, width: 160, height: 55, subLabel: 'Embedding Search', parent: gRequest });
  const nGenerate = b.addNode({ type: 'llm', label: 'Generate answer', x: 680, y: 90, width: 160, height: 55, subLabel: 'LLM Inference', parent: gRequest });

  // ── TOOLING FABRIC nodes ─────────────────────────────────────────────
  const nAgent = b.addNode({ type: 'agent', label: 'Agent', x: 300, y: 315, width: 150, height: 55, subLabel: 'ReAct Loop', parent: gTooling });
  const nToolCall = b.addNode({ type: 'tool', label: 'Tool Calls', x: 580, y: 315, width: 150, height: 55, subLabel: 'Function Router', parent: gTooling });

  // ── KNOWLEDGE + RESPONSE nodes ───────────────────────────────────────
  const nKb = b.addNode({ type: 'database', label: 'Knowledge base', x: 80, y: 535, width: 160, height: 60, subLabel: 'Vector Index', parent: gKnowledge });
  const nTerminal = b.addNode({ type: 'process', label: 'Terminal', x: 350, y: 535, width: 140, height: 55, subLabel: 'Execution', parent: gKnowledge });
  const nSourceDocs = b.addNode({ type: 'document', label: 'Source documents', x: 570, y: 535, width: 170, height: 55, subLabel: 'Corpus', parent: gKnowledge });
  const nGrounded = b.addNode({ type: 'process', label: 'Grounded answer', x: 820, y: 535, width: 170, height: 55, subLabel: 'Cited Output', parent: gKnowledge });

  // ── Edges ────────────────────────────────────────────────────────────
  b.addEdge({ source: nUserQuery, target: nRetrieve, label: 'embed', flowType: 'embedding' });
  b.addEdge({ source: nRetrieve, target: nGenerate, label: 'context', flowType: 'primary' });
  b.addEdge({ source: nUserQuery, target: nAgent, label: 'dispatch', flowType: 'control' });
  b.addEdge({ source: nAgent, target: nToolCall, label: 'invoke', flowType: 'control' });
  b.addEdge({ source: nRetrieve, target: nKb, label: 'search', flowType: 'memoryRead' });
  b.addEdge({ source: nToolCall, target: nTerminal, label: 'execute', flowType: 'async' });
  b.addEdge({ source: nTerminal, target: nSourceDocs, label: 'fetch', flowType: 'memoryRead' });
  b.addEdge({ source: nToolCall, target: nSourceDocs, label: 'lookup', flowType: 'memoryRead' });
  b.addEdge({ source: nSourceDocs, target: nGrounded, label: 'cite', flowType: 'embedding' });
  b.addEdge({ source: nGenerate, target: nGrounded, label: 'compose', flowType: 'primary' });
  b.addEdge({ source: nGrounded, target: nUserQuery, label: 'response', flowType: 'feedback' });

  return b;
}

// ---------------------------------------------------------------------------
// 3. Microservices Architecture — Style 3 (Blueprint)
// ---------------------------------------------------------------------------

function generateMicroservicesStyle3(): DiagramBuilder {
  const b = new DiagramBuilder({ style: 3, title: 'Microservices Architecture', width: 1080, height: 760 });

  // ── Swimlane groups ──────────────────────────────────────────────────
  const gEdge = b.addGroup({
    label: 'EDGE',
    x: 20, y: 50, width: 1040, height: 160,
    styleOverrides: { fillColor: '#0d1f3c', strokeColor: '#3b82f6', dashed: '1', fontSize: '13', fontStyle: '1' },
  });
  const gApp = b.addGroup({
    label: 'APPLICATION SERVICES',
    x: 20, y: 230, width: 1040, height: 160,
    styleOverrides: { fillColor: '#0a1929', strokeColor: '#f59e0b', dashed: '1', fontSize: '13', fontStyle: '1' },
  });
  const gData = b.addGroup({
    label: 'DATA + EVENT INFRA',
    x: 20, y: 410, width: 1040, height: 160,
    styleOverrides: { fillColor: '#0d1f3c', strokeColor: '#10b981', dashed: '1', fontSize: '13', fontStyle: '1' },
  });
  const gObs = b.addGroup({
    label: 'OBSERVABILITY',
    x: 20, y: 590, width: 1040, height: 130,
    styleOverrides: { fillColor: '#0a1929', strokeColor: '#a78bfa', dashed: '1', fontSize: '13', fontStyle: '1' },
  });

  // ── EDGE nodes ───────────────────────────────────────────────────────
  const nClients = b.addNode({ type: 'user', label: 'Client Apps', x: 120, y: 85, width: 150, height: 55, subLabel: 'Web / Mobile', parent: gEdge });
  const nGateway = b.addNode({ type: 'api', label: 'API Gateway', x: 420, y: 85, width: 160, height: 55, subLabel: 'Kong / Nginx', parent: gEdge });
  const nAuth = b.addNode({ type: 'process', label: 'Auth / Policy', x: 720, y: 85, width: 160, height: 55, subLabel: 'OAuth2 / RBAC', parent: gEdge });

  // ── APPLICATION SERVICES nodes ───────────────────────────────────────
  const nOrder = b.addNode({ type: 'process', label: 'Order Service', x: 60, y: 268, width: 160, height: 55, subLabel: 'Domain Logic', parent: gApp });
  const nCatalog = b.addNode({ type: 'process', label: 'Catalog Service', x: 300, y: 268, width: 170, height: 55, subLabel: 'Product Catalog', parent: gApp });
  const nBilling = b.addNode({ type: 'process', label: 'Billing Service', x: 550, y: 268, width: 170, height: 55, subLabel: 'Payments', parent: gApp });
  const nNotif = b.addNode({ type: 'process', label: 'Notification Svc', x: 800, y: 268, width: 170, height: 55, subLabel: 'Email / SMS', parent: gApp });

  // ── DATA + EVENT INFRA nodes ─────────────────────────────────────────
  const nEventRouter = b.addNode({ type: 'queue', label: 'Event Router', x: 60, y: 448, width: 160, height: 55, subLabel: 'Kafka', parent: gData });
  const nPostgres = b.addNode({ type: 'database', label: 'Postgres', x: 300, y: 448, width: 150, height: 60, subLabel: 'Primary DB', parent: gData });
  const nRedis = b.addNode({ type: 'database', label: 'Redis Cache', x: 530, y: 448, width: 150, height: 60, subLabel: 'Cache Layer', parent: gData });
  const nWarehouse = b.addNode({ type: 'database', label: 'Warehouse', x: 760, y: 448, width: 160, height: 60, subLabel: 'Analytics', parent: gData });

  // ── OBSERVABILITY nodes ──────────────────────────────────────────────
  const nMetrics = b.addNode({ type: 'process', label: 'Metrics / Traces', x: 380, y: 620, width: 180, height: 55, subLabel: 'Prometheus + Jaeger', parent: gObs });

  // ── Edges ────────────────────────────────────────────────────────────
  b.addEdge({ source: nClients, target: nGateway, label: 'HTTPS', flowType: 'primary' });
  b.addEdge({ source: nGateway, target: nAuth, label: 'validate', flowType: 'control' });
  b.addEdge({ source: nGateway, target: nOrder, label: 'route', flowType: 'control' });
  b.addEdge({ source: nGateway, target: nCatalog, label: 'route', flowType: 'control' });
  b.addEdge({ source: nGateway, target: nBilling, label: 'route', flowType: 'control' });
  b.addEdge({ source: nOrder, target: nPostgres, label: 'query', flowType: 'memoryRead' });
  b.addEdge({ source: nOrder, target: nEventRouter, label: 'publish', flowType: 'async' });
  b.addEdge({ source: nCatalog, target: nRedis, label: 'cache', flowType: 'memoryRead' });
  b.addEdge({ source: nBilling, target: nPostgres, label: 'tx', flowType: 'memoryWrite' });
  b.addEdge({ source: nEventRouter, target: nNotif, label: 'notify', flowType: 'async' });
  b.addEdge({ source: nEventRouter, target: nWarehouse, label: 'stream', flowType: 'async' });
  b.addEdge({ source: nPostgres, target: nMetrics, label: 'telemetry', flowType: 'async' });
  b.addEdge({ source: nRedis, target: nMetrics, label: 'telemetry', flowType: 'async' });
  b.addEdge({ source: nOrder, target: nWarehouse, label: 'ETL', flowType: 'memoryWrite' });

  return b;
}

// ---------------------------------------------------------------------------
// 4. Agent Memory Types — Style 4 (Notion Clean)
// ---------------------------------------------------------------------------

function generateMemoryTypesStyle4(): DiagramBuilder {
  const b = new DiagramBuilder({ style: 4, title: 'Agent Memory Types', width: 1080, height: 760 });

  // ── Central node ─────────────────────────────────────────────────────
  const nAgent = b.addNode({ type: 'agent', label: 'Agent', x: 440, y: 330, width: 170, height: 70, subLabel: 'Core Controller' });

  // ── Surrounding memory type nodes (radial layout) ────────────────────
  const nSensory = b.addNode({ type: 'memory-short', label: 'Sensory Memory', x: 410, y: 60, width: 180, height: 55, subLabel: 'Raw Input Buffer' });
  const nWorking = b.addNode({ type: 'memory-short', label: 'Working Memory', x: 740, y: 170, width: 180, height: 55, subLabel: 'Scratchpad / Context' });
  const nEpisodic = b.addNode({ type: 'memory-long', label: 'Episodic Memory', x: 780, y: 440, width: 180, height: 60, subLabel: 'Experience Log' });
  const nSemantic = b.addNode({ type: 'memory-long', label: 'Semantic Memory', x: 90, y: 440, width: 180, height: 60, subLabel: 'Knowledge Graph' });
  const nProcedural = b.addNode({ type: 'process', label: 'Procedural Memory', x: 70, y: 170, width: 190, height: 55, subLabel: 'Skill Library' });

  // ── Supporting nodes ─────────────────────────────────────────────────
  const nInput = b.addNode({ type: 'user', label: 'Input Stream', x: 130, y: 60, width: 160, height: 50, subLabel: 'Environment' });
  const nKb = b.addNode({ type: 'database', label: 'Knowledge Base', x: 60, y: 600, width: 170, height: 60, subLabel: 'External Store' });
  const nAction = b.addNode({ type: 'process', label: 'Action Output', x: 780, y: 600, width: 170, height: 55, subLabel: 'Task Execution' });
  const nReflection = b.addNode({ type: 'llm', label: 'Reflection Engine', x: 440, y: 600, width: 180, height: 55, subLabel: 'Self-Evaluation' });

  // ── Edges from Agent to each memory type ──────────────────────────────
  b.addEdge({ source: nAgent, target: nSensory, label: 'perceive', flowType: 'primary' });
  b.addEdge({ source: nAgent, target: nWorking, label: 'reason', flowType: 'control' });
  b.addEdge({ source: nAgent, target: nEpisodic, label: 'record', flowType: 'memoryWrite' });
  b.addEdge({ source: nAgent, target: nSemantic, label: 'query facts', flowType: 'memoryRead' });
  b.addEdge({ source: nAgent, target: nProcedural, label: 'select skill', flowType: 'control' });

  // ── Inter-memory edges ────────────────────────────────────────────────
  b.addEdge({ source: nInput, target: nSensory, label: 'observe', flowType: 'primary' });
  b.addEdge({ source: nSensory, target: nWorking, label: 'filter', flowType: 'embedding' });
  b.addEdge({ source: nWorking, target: nEpisodic, label: 'consolidate', flowType: 'memoryWrite' });
  b.addEdge({ source: nEpisodic, target: nSemantic, label: 'abstract', flowType: 'embedding' });
  b.addEdge({ source: nSemantic, target: nProcedural, label: 'ground', flowType: 'memoryRead' });
  b.addEdge({ source: nProcedural, target: nAction, label: 'execute', flowType: 'primary' });
  b.addEdge({ source: nProcedural, target: nAgent, label: 'apply', flowType: 'feedback' });
  b.addEdge({ source: nEpisodic, target: nReflection, label: 'review', flowType: 'memoryRead' });
  b.addEdge({ source: nReflection, target: nSemantic, label: 'insights', flowType: 'memoryWrite' });
  b.addEdge({ source: nKb, target: nSemantic, label: 'ingest', flowType: 'memoryRead' });
  b.addEdge({ source: nAction, target: nReflection, label: 'evaluate', flowType: 'feedback' });

  return b;
}

// ---------------------------------------------------------------------------
// 5. Multi-Agent Collaboration — Style 5 (Glassmorphism)
// ---------------------------------------------------------------------------

function generateMultiagentStyle5(): DiagramBuilder {
  const b = new DiagramBuilder({ style: 5, title: 'Multi-Agent Collaboration', width: 1080, height: 760 });

  // ── Swimlane groups ──────────────────────────────────────────────────
  const gMission = b.addGroup({
    label: 'Mission Control',
    x: 20, y: 50, width: 1040, height: 170,
    styleOverrides: { fillColor: '#1e1e3a', strokeColor: '#7c3aed', dashed: '1', fontSize: '13', fontStyle: '1' },
  });
  const gSpecialist = b.addGroup({
    label: 'Specialist Agents',
    x: 20, y: 240, width: 1040, height: 200,
    styleOverrides: { fillColor: '#1a1a2e', strokeColor: '#3b82f6', dashed: '1', fontSize: '13', fontStyle: '1' },
  });
  const gSynth = b.addGroup({
    label: 'Synthesis',
    x: 20, y: 460, width: 1040, height: 170,
    styleOverrides: { fillColor: '#0d1b2a', strokeColor: '#10b981', dashed: '1', fontSize: '13', fontStyle: '1' },
  });

  // ── Mission Control nodes ────────────────────────────────────────────
  const nBrief = b.addNode({ type: 'user', label: 'User brief', x: 150, y: 85, width: 150, height: 55, subLabel: 'Task Request', parent: gMission });
  const nCoord = b.addNode({ type: 'agent', label: 'Coordinator Agent', x: 500, y: 85, width: 180, height: 55, subLabel: 'Orchestrator', parent: gMission });

  // ── Specialist Agents nodes ──────────────────────────────────────────
  const nResearch = b.addNode({ type: 'agent', label: 'Research Agent', x: 60, y: 290, width: 170, height: 55, subLabel: 'Web + Docs', parent: gSpecialist });
  const nCoding = b.addNode({ type: 'agent', label: 'Coding Agent', x: 320, y: 290, width: 170, height: 55, subLabel: 'Implementation', parent: gSpecialist });
  const nReview = b.addNode({ type: 'agent', label: 'Review Agent', x: 580, y: 290, width: 170, height: 55, subLabel: 'Quality Gate', parent: gSpecialist });
  const nShared = b.addNode({ type: 'database', label: 'Shared Memory', x: 830, y: 290, width: 160, height: 60, subLabel: 'Context Store', parent: gSpecialist });

  // ── Synthesis nodes ──────────────────────────────────────────────────
  const nSynthEngine = b.addNode({ type: 'llm', label: 'Synthesis Engine', x: 300, y: 500, width: 180, height: 55, subLabel: 'Integration LLM', parent: gSynth });
  const nFinal = b.addNode({ type: 'user', label: 'Final Response', x: 650, y: 500, width: 170, height: 55, subLabel: 'Delivered Output', parent: gSynth });

  // ── Edges ────────────────────────────────────────────────────────────
  b.addEdge({ source: nBrief, target: nCoord, label: 'assign', flowType: 'primary' });
  b.addEdge({ source: nCoord, target: nResearch, label: 'delegate', flowType: 'control' });
  b.addEdge({ source: nCoord, target: nCoding, label: 'delegate', flowType: 'control' });
  b.addEdge({ source: nCoord, target: nReview, label: 'delegate', flowType: 'control' });
  b.addEdge({ source: nResearch, target: nShared, label: 'write findings', flowType: 'memoryWrite' });
  b.addEdge({ source: nCoding, target: nShared, label: 'write code', flowType: 'memoryWrite' });
  b.addEdge({ source: nReview, target: nShared, label: 'write review', flowType: 'memoryWrite' });
  b.addEdge({ source: nResearch, target: nCoding, label: 'spec', flowType: 'embedding' });
  b.addEdge({ source: nCoding, target: nReview, label: 'PR', flowType: 'primary' });
  b.addEdge({ source: nShared, target: nSynthEngine, label: 'aggregate', flowType: 'memoryRead' });
  b.addEdge({ source: nSynthEngine, target: nFinal, label: 'compose', flowType: 'primary' });
  b.addEdge({ source: nFinal, target: nBrief, label: 'deliver', flowType: 'feedback' });

  return b;
}

// ---------------------------------------------------------------------------
// 6. System Architecture — Style 6 (Claude Official)
// ---------------------------------------------------------------------------

function generateSystemArchStyle6(): DiagramBuilder {
  const b = new DiagramBuilder({ style: 6, title: 'System Architecture', width: 1080, height: 760 });

  // ── Layer groups with left-side labels ───────────────────────────────
  const gInterface = b.addGroup({
    label: 'Interface Layer',
    x: 160, y: 50, width: 900, height: 170,
    styleOverrides: { fillColor: '#FEF3C7', strokeColor: '#D97706', dashed: '1', fontSize: '13', fontStyle: '1' },
  });
  const gCore = b.addGroup({
    label: 'Core Layer',
    x: 160, y: 240, width: 900, height: 220,
    styleOverrides: { fillColor: '#DBEAFE', strokeColor: '#2563EB', dashed: '1', fontSize: '13', fontStyle: '1' },
  });
  const gFoundation = b.addGroup({
    label: 'Foundation Layer',
    x: 160, y: 480, width: 900, height: 180,
    styleOverrides: { fillColor: '#D1FAE5', strokeColor: '#059669', dashed: '1', fontSize: '13', fontStyle: '1' },
  });

  // ── Left-side vertical labels (as text nodes) ────────────────────────
  // (groups already have labels at top-left)

  // ── Interface Layer nodes ────────────────────────────────────────────
  const nClient = b.addNode({ type: 'user', label: 'Client Surface', x: 200, y: 85, width: 160, height: 55, subLabel: 'UI / CLI / API', parent: gInterface });
  const nGateway = b.addNode({ type: 'api', label: 'Gateway', x: 480, y: 85, width: 150, height: 55, subLabel: 'Routing + Auth', parent: gInterface });
  const nRegistry = b.addNode({ type: 'process', label: 'Registry', x: 740, y: 85, width: 150, height: 55, subLabel: 'Service Catalog', parent: gInterface });

  // ── Core Layer nodes ─────────────────────────────────────────────────
  const nPlanner = b.addNode({ type: 'agent', label: 'Task Planner', x: 190, y: 280, width: 160, height: 55, subLabel: 'Decomposition', parent: gCore });
  const nModel = b.addNode({ type: 'llm', label: 'Model Runtime', x: 440, y: 280, width: 170, height: 55, subLabel: 'Inference Engine', parent: gCore });
  const nPolicy = b.addNode({ type: 'process', label: 'Policy Guardrails', x: 710, y: 280, width: 180, height: 55, subLabel: 'Safety + Limits', parent: gCore });
  const nTool = b.addNode({ type: 'tool', label: 'Tool Runtime', x: 440, y: 375, width: 170, height: 55, subLabel: 'Execution Sandbox', parent: gCore });

  // ── Foundation Layer nodes ───────────────────────────────────────────
  const nMemory = b.addNode({ type: 'database', label: 'Memory Store', x: 200, y: 520, width: 160, height: 60, subLabel: 'Vector + KV', parent: gFoundation });
  const nObserve = b.addNode({ type: 'process', label: 'Observability', x: 490, y: 520, width: 160, height: 55, subLabel: 'Logs + Traces', parent: gFoundation });

  // ── Edges ────────────────────────────────────────────────────────────
  b.addEdge({ source: nClient, target: nGateway, label: 'request', flowType: 'primary' });
  b.addEdge({ source: nGateway, target: nRegistry, label: 'discover', flowType: 'control' });
  b.addEdge({ source: nGateway, target: nPlanner, label: 'route', flowType: 'control' });
  b.addEdge({ source: nPlanner, target: nModel, label: 'plan', flowType: 'control' });
  b.addEdge({ source: nModel, target: nPolicy, label: 'check', flowType: 'control' });
  b.addEdge({ source: nPlanner, target: nTool, label: 'invoke', flowType: 'async' });
  b.addEdge({ source: nModel, target: nMemory, label: 'recall', flowType: 'memoryRead' });
  b.addEdge({ source: nTool, target: nMemory, label: 'persist', flowType: 'memoryWrite' });
  b.addEdge({ source: nModel, target: nObserve, label: 'log', flowType: 'async' });
  b.addEdge({ source: nTool, target: nObserve, label: 'trace', flowType: 'async' });
  b.addEdge({ source: nPolicy, target: nTool, label: 'guard', flowType: 'feedback' });
  b.addEdge({ source: nMemory, target: nPlanner, label: 'context', flowType: 'feedback' });

  return b;
}

// ---------------------------------------------------------------------------
// 7. API Integration Flow — Style 7 (OpenAI Official)
// ---------------------------------------------------------------------------

function generateApiFlowStyle7(): DiagramBuilder {
  const b = new DiagramBuilder({ style: 7, title: 'API Integration Flow', width: 1080, height: 760 });

  // ── Swimlane groups ──────────────────────────────────────────────────
  const gEntry = b.addGroup({
    label: 'Entry',
    x: 20, y: 50, width: 1040, height: 170,
    styleOverrides: { fillColor: '#EFF6FF', strokeColor: '#3B82F6', dashed: '1', fontSize: '13', fontStyle: '1' },
  });
  const gModel = b.addGroup({
    label: 'Model + Tools',
    x: 20, y: 240, width: 1040, height: 200,
    styleOverrides: { fillColor: '#F0FDF4', strokeColor: '#16A34A', dashed: '1', fontSize: '13', fontStyle: '1' },
  });
  const gDelivery = b.addGroup({
    label: 'Delivery',
    x: 20, y: 460, width: 1040, height: 200,
    styleOverrides: { fillColor: '#FFF7ED', strokeColor: '#EA580C', dashed: '1', fontSize: '13', fontStyle: '1' },
  });

  // ── Entry nodes ──────────────────────────────────────────────────────
  const nApp = b.addNode({ type: 'process', label: 'Application', x: 150, y: 90, width: 160, height: 55, subLabel: 'Client App', parent: gEntry });
  const nSdk = b.addNode({ type: 'api', label: 'OpenAI SDK Layer', x: 500, y: 90, width: 190, height: 55, subLabel: 'Python / Node SDK', parent: gEntry });

  // ── Model + Tools nodes ──────────────────────────────────────────────
  const nPrompt = b.addNode({ type: 'process', label: 'Prompt Builder', x: 100, y: 290, width: 170, height: 55, subLabel: 'Template Engine', parent: gModel });
  const nRuntime = b.addNode({ type: 'llm', label: 'Model Runtime', x: 380, y: 290, width: 170, height: 55, subLabel: 'GPT-4 / o1', parent: gModel });
  const nToolCalls = b.addNode({ type: 'tool', label: 'Tool Calls', x: 660, y: 290, width: 160, height: 55, subLabel: 'Function API', parent: gModel });
  const nObservability = b.addNode({ type: 'process', label: 'Observability', x: 400, y: 375, width: 170, height: 50, subLabel: 'Logging + Metrics', parent: gModel });

  // ── Delivery nodes ───────────────────────────────────────────────────
  const nFormatter = b.addNode({ type: 'process', label: 'Response Formatter', x: 200, y: 510, width: 190, height: 55, subLabel: 'Stream + Parse', parent: gDelivery });
  const nRelease = b.addNode({ type: 'process', label: 'Release Control', x: 530, y: 510, width: 180, height: 55, subLabel: 'Feature Flag + A/B', parent: gDelivery });
  const nOutput = b.addNode({ type: 'user', label: 'End User', x: 830, y: 510, width: 150, height: 55, subLabel: 'Response', parent: gDelivery });

  // ── Edges ────────────────────────────────────────────────────────────
  b.addEdge({ source: nApp, target: nSdk, label: 'API call', flowType: 'primary' });
  b.addEdge({ source: nSdk, target: nPrompt, label: 'build', flowType: 'control' });
  b.addEdge({ source: nPrompt, target: nRuntime, label: 'prompt', flowType: 'primary' });
  b.addEdge({ source: nRuntime, target: nToolCalls, label: 'invoke tool', flowType: 'control' });
  b.addEdge({ source: nToolCalls, target: nRuntime, label: 'tool result', flowType: 'feedback' });
  b.addEdge({ source: nRuntime, target: nObservability, label: 'log', flowType: 'async' });
  b.addEdge({ source: nToolCalls, target: nObservability, label: 'trace', flowType: 'async' });
  b.addEdge({ source: nRuntime, target: nFormatter, label: 'raw output', flowType: 'primary' });
  b.addEdge({ source: nFormatter, target: nRelease, label: 'format', flowType: 'embedding' });
  b.addEdge({ source: nRelease, target: nOutput, label: 'deliver', flowType: 'primary' });
  b.addEdge({ source: nRelease, target: nSdk, label: 'config', flowType: 'feedback' });

  return b;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function generateAll() {
  cleanDir(OUT_DIR);
  console.log('Generating 7 sample diagrams...\n');

  saveDrawio('mem0-style1', generateMem0Style1());
  saveDrawio('toolcall-style2', generateToolcallStyle2());
  saveDrawio('microservices-style3', generateMicroservicesStyle3());
  saveDrawio('memory-types-style4', generateMemoryTypesStyle4());
  saveDrawio('multiagent-style5', generateMultiagentStyle5());
  saveDrawio('system-arch-style6', generateSystemArchStyle6());
  saveDrawio('api-flow-style7', generateApiFlowStyle7());

  console.log('\n✅ Done! 7 .drawio files saved to assets/samples/');
}

generateAll();
