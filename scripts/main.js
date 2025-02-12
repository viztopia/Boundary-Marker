document.addEventListener('DOMContentLoaded', async () => {
    const timeline = new TimelineView();
    const archives = await ArchiveParser.loadArchives();
    await timeline.initialize(archives);

    // Setup language toggle
    const langToggle = document.getElementById('langToggle');
    langToggle.addEventListener('click', () => {
        timeline.toggleLanguage();
    });

    // Cache the processed archives
    if ('localStorage' in window) {
        try {
            localStorage.setItem('archives', JSON.stringify(archives));
        } catch (e) {
            console.warn('Failed to cache archives:', e);
        }
    }
});
