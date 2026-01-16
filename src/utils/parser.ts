export interface ModelResponse {
  answer: string;
  thinking?: string;
}

export interface ModelEntry {
  modelName: string;
  family: string;
  format: 'markdown' | 'text';
  full: ModelResponse;
  summary: ModelResponse;
}

export interface ArchiveEntry {
  date: string; // YYYY-MM-DD
  models: Record<string, ModelEntry>;
}

function detectFamily(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes('claude')) return 'Claude';
    if (lower.includes('deepseek')) return 'DeepSeek';
    if (lower.includes('doubao')) return 'Doubao';
    if (lower.includes('gemini')) return 'Gemini';
    if (lower.includes('openai') || lower.includes('gpt')) return 'OpenAI';
    if (lower.includes('qwen')) return 'Qwen';
    return 'Other';
}

function detectFormat(name: string): 'markdown' | 'text' {
    if (name.toLowerCase().includes('doubao')) return 'text';
    return 'markdown';
}

export function parseArchive(id: string, rawContent: string): ArchiveEntry {
  // 1. Extract Date from filename logic (assuming ID is "YYYYMMDD.md" or "YYYYMMDD")
  const dateMatch = id.match(/(\d{4})(\d{2})(\d{2})/);
  let date = id;
  if (dateMatch) {
    date = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
  }

  const models: Record<string, ModelEntry> = {};
  
  // 2. Split Models by "======"
  const sections = rawContent.split('======').map(s => s.trim()).filter(Boolean);

  sections.forEach(section => {
    const lines = section.split('\n');
    // First line is expected to be the Model Name (or close to it)
    // We clean it up: remove empty lines at start
    let nameLineIndex = 0;
    while (nameLineIndex < lines.length && !lines[nameLineIndex].trim()) {
        nameLineIndex++;
    }
    
    if (nameLineIndex >= lines.length) return;

    const modelName = lines[nameLineIndex].trim();
    const family = detectFamily(modelName);
    const format = detectFormat(modelName);
    
    // The rest is the conversation. Join back and split by separator.
    const conversationText = lines.slice(nameLineIndex + 1).join('\n');
    
    // 3. Split Interaction by "-----" (5 or more dashes)
    // Use regex to ensure it is a standalone separator line (not a table alignment row like |---|)
    const parts = conversationText.split(/(?:^|\n)\s*-{5,}\s*(?:\n|$)/).map(p => p.trim());
    
    // Expected structure:
    // [0] Prompt 1
    // [1] Answer 1 (Full)
    // [2] Prompt 2
    // [3] Answer 2 (Summary)
    
    if (parts.length >= 4) {
        const fullResp = extractThinking(parts[1]);
        const summaryResp = extractThinking(parts[3]);

        models[modelName] = {
            modelName,
            family,
            format,
            full: fullResp,
            summary: summaryResp
        };
    } else if (parts.length >= 2) {
         // Fallback if only one answer exists
         const fullResp = extractThinking(parts[1]);
         models[modelName] = {
             modelName,
             family,
             format,
             full: fullResp,
             summary: { answer: "Summary not available for this date." }
         };
    }
  });

  return { date, models };
}

function extractThinking(text: string): ModelResponse {
    // Regex to match """ ... """
    // Using [\s\S]*? for non-greedy match across newlines
    const thinkingRegex = /"""([\s\S]*?)"""/;
    const match = text.match(thinkingRegex);

    if (match) {
        const thinking = match[1].trim();
        const answer = text.replace(match[0], '').trim();
        return { answer, thinking };
    }

    return { answer: text };
}
