class TimelineView {
    constructor() {
        this.container = document.getElementById('timeline');
        this.currentLanguage = 'chinese';
        this.archives = [];
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1
        });
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'chinese' ? 'english' : 'chinese';
        this.render();
    }

    formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString(
            this.currentLanguage === 'chinese' ? 'zh-CN' : 'en-US',
            { year: 'numeric', month: 'long', day: 'numeric' }
        );
    }

    createArchiveCard(archive) {
        const card = document.createElement('div');
        card.className = 'archive-card';

        const content = document.createElement('div');
        content.className = 'card-content';

        const date = document.createElement('div');
        date.className = 'archive-date';
        date.textContent = this.formatDate(archive.date);
        content.appendChild(date);

        const qaPairs = archive[this.currentLanguage];
        qaPairs.forEach(pair => {
            const qaDiv = document.createElement('div');
            qaDiv.className = 'qa-pair';

            const question = document.createElement('div');
            question.className = 'question';
            question.textContent = pair.question;
            qaDiv.appendChild(question);

            const answer = document.createElement('div');
            answer.className = 'answer';
            answer.textContent = pair.answer;
            qaDiv.appendChild(answer);

            content.appendChild(qaDiv);
        });

        card.appendChild(content);
        return card;
    }

    render() {
        this.container.innerHTML = '';
        
        this.archives.forEach(archive => {
            const card = this.createArchiveCard(archive);
            this.container.appendChild(card);
            this.observer.observe(card);
        });
    }

    async initialize(archives) {
        this.archives = archives;
        this.render();
    }
}
