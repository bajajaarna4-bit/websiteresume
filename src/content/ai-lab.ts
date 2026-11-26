export interface AiLabNode {
  id: string;
  slotLabel: string;
  title: string;
  category: 'Agents' | 'Local Models' | 'Multimodal' | 'Security' | 'Tooling';
  quarter: string;
  summary: string;
  experimentPrompt: string;
  isTodo: true;
}

// TODO(portfolio-data): Replace every placeholder entry below with verified AI tools and experiments you built or tested.
export const AI_LAB_NODES: AiLabNode[] = [
  {
    id: 'ai-slot-1',
    slotLabel: 'TODO // NODE 01',
    title: '[TODO: Agentic IDE / Orchestrator Experiment]',
    category: 'Agents',
    quarter: '[TODO: Date]',
    summary:
      'Placeholder for your notes on multi-agent workflows, tool-calling reliability, or code generation loops.',
    experimentPrompt: '[TODO: Document what you actually built, broke, and learned here.]',
    isTodo: true,
  },
  {
    id: 'ai-slot-2',
    slotLabel: 'TODO // NODE 02',
    title: '[TODO: Local LLM / Quantized Inference Setup]',
    category: 'Local Models',
    quarter: '[TODO: Date]',
    summary:
      'Placeholder for local model experimentation (e.g., Ollama / GGUF hardware benchmarks or offline prompts).',
    experimentPrompt: '[TODO: Add exact model names and real hardware observations only.]',
    isTodo: true,
  },
  {
    id: 'ai-slot-3',
    slotLabel: 'TODO // NODE 03',
    title: '[TODO: Audio / Multimodal AI Tooling]',
    category: 'Multimodal',
    quarter: '[TODO: Date]',
    summary:
      'Placeholder for multimodal experiments such as music/audio synthesis workflows or vision prompts.',
    experimentPrompt: '[TODO: Link to verified prototype notes or keep scoped to real learnings.]',
    isTodo: true,
  },
  {
    id: 'ai-slot-4',
    slotLabel: 'TODO // NODE 04',
    title: '[TODO: AI Safety & Prompt-Injection Guardrails]',
    category: 'Security',
    quarter: '[TODO: Date]',
    summary:
      'Placeholder for tool allowlisting, Zod schema enforcement on LLM JSON outputs, or sandbox experiments.',
    experimentPrompt: '[TODO: Share one concrete security lesson from testing AI outputs.]',
    isTodo: true,
  },
  {
    id: 'ai-slot-5',
    slotLabel: 'TODO // NODE 05',
    title: '[TODO: Rapid Prototyping Stack]',
    category: 'Tooling',
    quarter: '[TODO: Date]',
    summary:
      'Placeholder for how you pair AI docs/MCP tools with manual debugging to ship ideas fast.',
    experimentPrompt: '[TODO: Replace with your favorite repeatable workflow or prompt habit.]',
    isTodo: true,
  },
];
