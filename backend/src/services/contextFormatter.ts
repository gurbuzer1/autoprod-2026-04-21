import type { Client, ContextProfile } from '../types';

export function buildContextText(client: Client, profile: ContextProfile): string {
  const constraints: string[] = JSON.parse(profile.constraints || '[]');
  const toneExamples: string[] = JSON.parse(profile.tone_examples || '[]');

  const constraintsList =
    constraints.length > 0
      ? constraints.map((c) => `- ${c}`).join('\n')
      : '- (none)';

  const toneList =
    toneExamples.length > 0
      ? toneExamples.map((t) => `- ${t}`).join('\n')
      : '- (none)';

  return [
    `## Client Context: ${client.name}`,
    `**Industry**: ${client.industry ?? 'N/A'}`,
    `**Brand Voice**: ${profile.brand_voice || 'N/A'}`,
    `**Target Audience**: ${profile.target_audience || 'N/A'}`,
    `**Constraints**:\n${constraintsList}`,
    `**Tone Examples**:\n${toneList}`,
    `**Project Status**: ${profile.project_status || 'N/A'}`,
    `**Background**: ${profile.background || 'N/A'}`,
  ].join('\n\n');
}
