class ArchiveParser {
    static async parseArchive(content) {
        const [chinesePart, englishPart] = content.split('=====').map(part => part.trim());
        
        return {
            chinese: this.parseQAPairs(chinesePart),
            english: this.parseQAPairs(englishPart)
        };
    }

    static parseQAPairs(content) {
        const pairs = content.split('-----').map(pair => pair.trim()).filter(Boolean);
        const qaPairs = [];
        
        for (let i = 0; i < pairs.length; i += 2) {
            if (pairs[i] && pairs[i + 1]) {
                qaPairs.push({
                    question: pairs[i],
                    answer: pairs[i + 1]
                });
            }
        }
        
        return qaPairs;
    }

    static extractDateFromFilename(filename) {
        const match = filename.match(/(\d{8})/);
        if (match) {
            const dateStr = match[1];
            return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
        }
        return null;
    }

    static async loadArchives() {
        try {
            // Instead of fetching directory listing, we'll use a direct approach
            const archiveFiles = [
                '20250129.md',
                '20250205.md'
            ];
            
            const archives = [];
            for (const file of archiveFiles) {
                try {
                    const response = await fetch(`archive/${file}`);
                    if (!response.ok) {
                        console.warn(`Failed to load ${file}:`, response.statusText);
                        continue;
                    }
                    const content = await response.text();
                    const date = this.extractDateFromFilename(file);
                    const parsed = await this.parseArchive(content);
                    archives.push({ date, ...parsed });
                } catch (error) {
                    console.warn(`Error processing ${file}:`, error);
                }
            }
            
            return archives.sort((a, b) => b.date.localeCompare(a.date));
        } catch (error) {
            console.error('Error loading archives:', error);
            return [];
        }
    }
}
