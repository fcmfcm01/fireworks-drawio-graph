/**
 * Generate sample .drawio diagram files for documentation.
 * Usage: npx tsx src/scripts/generate-samples.ts
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { DiagramBuilder } from '../builder/diagram-builder.js';
import { createArchitectureDiagram } from '../templates/architecture.js';
import { createFlowchart } from '../templates/flowchart.js';
import { createSequenceDiagram } from '../templates/sequence.js';
import { createDataFlowDiagram } from '../templates/data-flow.js';
import { createAwsArchitectureDiagram } from '../templates/cloud-architecture.js';
import '../stencils/catalogs/aws4.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '../../docs/samples');

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function saveDrawio(name: string, builder: DiagramBuilder) {
  const path = resolve(OUT_DIR, `${name}.drawio`);
  writeFileSync(path, builder.toDrawioFile(), 'utf-8');
  console.log(`  ✓ ${name}.drawio`);
  return path;
}

function generateAll() {
  ensureDir(OUT_DIR);

  saveDrawio('architecture-microservices', createArchitectureDiagram({
    title: 'Microservices Architecture',
    style: 1,
    layers: [
      { name: 'Client', nodes: [{ label: 'Web App' }, { label: 'Mobile App' }] },
      { name: 'Gateway', nodes: [{ label: 'API Gateway', type: 'api' }] },
      { name: 'Services', nodes: [{ label: 'User Service' }, { label: 'Order Service' }, { label: 'Payment Service' }] },
      { name: 'Data', nodes: [{ label: 'PostgreSQL', type: 'database' }, { label: 'Redis', type: 'database' }, { label: 'S3', type: 'database' }] },
    ],
    connections: [
      { from: 'Web App', to: 'API Gateway', label: 'HTTPS', flowType: 'primary' },
      { from: 'Mobile App', to: 'API Gateway', label: 'HTTPS', flowType: 'primary' },
      { from: 'API Gateway', to: 'User Service', label: 'route', flowType: 'control' },
      { from: 'API Gateway', to: 'Order Service', label: 'route', flowType: 'control' },
      { from: 'API Gateway', to: 'Payment Service', label: 'route', flowType: 'control' },
      { from: 'User Service', to: 'PostgreSQL', label: 'query', flowType: 'memoryRead' },
      { from: 'Order Service', to: 'Redis', label: 'cache', flowType: 'memoryRead' },
      { from: 'Payment Service', to: 'S3', label: 'store', flowType: 'memoryWrite' },
    ],
  }));

  saveDrawio('flowchart-cicd', createFlowchart({
    title: 'CI/CD Pipeline',
    style: 2,
    steps: [
      { label: 'Push', type: 'start', id: 'push' },
      { label: 'Build', type: 'process' },
      { label: 'Tests Pass?', type: 'decision' },
      { label: 'Deploy Staging', type: 'process' },
      { label: 'QA Review?', type: 'decision' },
      { label: 'Deploy Prod', type: 'process' },
      { label: 'Done', type: 'end' },
      { label: 'Notify Failure', type: 'process' },
    ],
    connections: [
      { from: 'push', to: 'Build' },
      { from: 'Build', to: 'Tests Pass?' },
      { from: 'Tests Pass?', to: 'Deploy Staging', label: 'yes' },
      { from: 'Tests Pass?', to: 'Notify Failure', label: 'no' },
      { from: 'Deploy Staging', to: 'QA Review?' },
      { from: 'QA Review?', to: 'Deploy Prod', label: 'approved' },
      { from: 'Deploy Prod', to: 'Done' },
    ],
  }));

  saveDrawio('sequence-auth', createSequenceDiagram({
    title: 'User Authentication',
    style: 3,
    participants: [
      { name: 'Client' },
      { name: 'API Gateway' },
      { name: 'Auth Service' },
      { name: 'Database' },
    ],
    messages: [
      { from: 'Client', to: 'API Gateway', label: 'POST /login', type: 'sync' },
      { from: 'API Gateway', to: 'Auth Service', label: 'validate(credentials)', type: 'sync' },
      { from: 'Auth Service', to: 'Database', label: 'SELECT user', type: 'sync' },
      { from: 'Database', to: 'Auth Service', label: 'user record', type: 'return' },
      { from: 'Auth Service', to: 'API Gateway', label: 'JWT token', type: 'return' },
      { from: 'API Gateway', to: 'Client', label: '200 OK + token', type: 'return' },
    ],
  }));

  saveDrawio('dataflow-rag', createDataFlowDiagram({
    title: 'RAG Pipeline',
    style: 1,
    nodes: [
      { label: 'User Query', type: 'user' },
      { label: 'Embedding Model', type: 'llm' },
      { label: 'Vector Store', type: 'database' },
      { label: 'LLM', type: 'llm' },
      { label: 'Response', type: 'process' },
      { label: 'Document Store', type: 'database' },
    ],
    edges: [
      { from: 'User Query', to: 'Embedding Model', label: 'text', flowType: 'primary' },
      { from: 'Embedding Model', to: 'Vector Store', label: 'embeddings', flowType: 'embedding' },
      { from: 'Vector Store', to: 'LLM', label: 'context', flowType: 'memoryRead' },
      { from: 'Document Store', to: 'Embedding Model', label: 'docs', flowType: 'memoryRead' },
      { from: 'LLM', to: 'Response', label: 'generation', flowType: 'primary' },
    ],
  }));

  saveDrawio('cloud-aws-serverless', createAwsArchitectureDiagram({
    title: 'AWS Serverless App',
    nodes: [
      { shape: 'cloudfront', label: 'CloudFront', x: 400, y: 60 },
      { shape: 'api_gateway', label: 'API Gateway', x: 400, y: 180 },
      { shape: 'lambda', label: 'Lambda', x: 250, y: 300 },
      { shape: 'lambda', label: 'Lambda', x: 550, y: 300 },
      { shape: 'dynamodb', label: 'DynamoDB', x: 250, y: 420 },
      { shape: 's3', label: 'S3', x: 550, y: 420 },
    ],
    connections: [
      { from: '0', to: '1', label: 'route' },
      { from: '1', to: '2', label: 'invoke' },
      { from: '1', to: '3', label: 'invoke' },
      { from: '2', to: '4', label: 'query' },
      { from: '3', to: '5', label: 'store' },
    ],
  }));

  const agent = new DiagramBuilder({ style: 6, title: 'AI Agent Architecture', height: 700 });
  const user = agent.addNode({ type: 'user', label: 'User', x: 400, y: 60, width: 100, height: 60 });
  const orchestrator = agent.addNode({ type: 'agent', label: 'Agent', x: 370, y: 200, width: 160, height: 70 });
  const llm = agent.addNode({ type: 'llm', label: 'LLM', x: 150, y: 360, width: 140, height: 60 });
  const tools = agent.addNode({ type: 'api', label: 'Tools', x: 370, y: 360, width: 160, height: 60 });
  const memory = agent.addNode({ type: 'database', label: 'Memory', x: 600, y: 360, width: 140, height: 60 });
  const vectordb = agent.addNode({ type: 'database', label: 'Vector DB', x: 600, y: 520, width: 140, height: 60 });
  const knowledge = agent.addNode({ type: 'document', label: 'Knowledge', x: 370, y: 520, width: 160, height: 60 });
  agent.addEdge({ source: user, target: orchestrator, label: 'prompt', flowType: 'primary' });
  agent.addEdge({ source: orchestrator, target: llm, label: 'reason', flowType: 'control' });
  agent.addEdge({ source: orchestrator, target: tools, label: 'execute', flowType: 'control' });
  agent.addEdge({ source: orchestrator, target: memory, label: 'recall', flowType: 'memoryRead' });
  agent.addEdge({ source: memory, target: vectordb, label: 'embed', flowType: 'embedding' });
  agent.addEdge({ source: knowledge, target: llm, label: 'context', flowType: 'memoryRead' });
  agent.addEdge({ source: llm, target: orchestrator, label: 'response', flowType: 'feedback' });
  saveDrawio('architecture-ai-agent', agent);

  console.log('\n✅ Done! .drawio files saved to docs/samples/');
}

generateAll();
