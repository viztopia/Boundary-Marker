
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/content/archives/20250918.md');
const rawContent = fs.readFileSync(filePath, 'utf8');

function extractThinking(text) {
    const thinkingRegex = /"""([\s\S]*?)"""/;
    const match = text.match(thinkingRegex);

    if (match) {
        const thinking = match[1].trim();
        const answer = text.replace(match[0], '').trim();
        return { answer, thinking };
    }

    return { answer: text };
}

// 2. Split Models by "======"
const sections = rawContent.split('======').map(s => s.trim()).filter(Boolean);

sections.forEach((section, idx) => {
    console.log(`--- Section ${idx} ---`);
    const lines = section.split('\n');
    let nameLineIndex = 0;
    while (nameLineIndex < lines.length && !lines[nameLineIndex].trim()) {
        nameLineIndex++;
    }
    
    if (nameLineIndex >= lines.length) return;

    const modelName = lines[nameLineIndex].trim();
    console.log(`Model: ${modelName}`);

    const conversationText = lines.slice(nameLineIndex + 1).join('\n');
    
    // 3. Split Interaction by "------" (5 or more dashes) on its own line
    const parts = conversationText.split(/(?:^|\n)\s*-{5,}\s*(?:\n|$)/).map(p => p.trim());
    
    console.log(`Parts count: ${parts.length}`);
    parts.forEach((p, i) => {
        console.log(`Part ${i} length: ${p.length}`);
        console.log(`Part ${i} preview: ${p.substring(0, 50).replace(/\n/g, '\\n')}...`);
    });
    
    if (parts.length >= 4) {
        const summaryResp = extractThinking(parts[3]);
        console.log('Summary Answer Preview:', summaryResp.answer.substring(0, 100));
        console.log('Summary Answer Length:', summaryResp.answer.length);
        console.log('Summary Thinking Length:', (summaryResp.thinking || '').length);
        
        if (summaryResp.answer.length === 0) {
            console.log('!!! WARNING: Empty Summary Answer !!!');
            console.log('Part[3] content:', parts[3]);
        }
    }
});
