// Global variable to store projects data
let projectsData = [];

// Load profile data from JSON
fetch('profile.json')
    .then(response => response.json())
    .then(data => {
        document.getElementById('user-name').textContent = data.name;
        document.getElementById('user-role').textContent = data.role;

        // About section
        document.getElementById('about-title').textContent = data.aboutTitle || "О себе";
        document.getElementById('about-text').innerText = data.aboutText;
        if (data.aboutCollapsed) document.getElementById('card-about').classList.add('collapsed');

        // Career section
        document.getElementById('career-title').textContent = data.careerTitle || "Карьера";
        renderSubmodules('career-list', data.careerItems);
        if (data.careerCollapsed) document.getElementById('card-career').classList.add('collapsed');

        // Projects section
        document.getElementById('projects-title').textContent = data.projectsTitle || "Мои работы";
        if (data.projectItems) {
            projectsData = data.projectItems;
            renderProjectsGrid('projects-list', projectsData);
        }
        if (data.projectsCollapsed) document.getElementById('card-projects').classList.add('collapsed');

        // Contacts section
        document.getElementById('contacts-title').textContent = data.contactsTitle || "Контакты";
        const contactsHTML = `
            <address class="contacts-wrapper">
                Тел.: <span class="contact-row">
                    <a href="tel:+79511567563">+7 951 156 75 63</a>
                    <button class="copy-btn" onclick="copyToClipboard('+79511567563', this)" title="Скопировать" aria-label="Скопировать номер телефона">
                        <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                    <span class="copy-tooltip">Скопировано!</span>
                </span><br>
                E-mail: <span class="contact-row">
                    <a href="mailto:alexander.masyuk@gmail.com">alexander.masyuk@gmail.com</a>
                    <button class="copy-btn" onclick="copyToClipboard('alexander.masyuk@gmail.com', this)" title="Скопировать" aria-label="Скопировать адрес электронной почты">
                        <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                    <span class="copy-tooltip">Скопировано!</span>
                </span><br>
                Телеграм: <span class="contact-row">
                    <a href="https://t.me/jaddy_LD" target="_blank">@jaddy_LD</a>
                    <button class="copy-btn" onclick="copyToClipboard('@jaddy_LD', this)" title="Скопировать" aria-label="Скопировать логин Telegram">
                        <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                    <span class="copy-tooltip">Скопировано!</span>
                </span><br>
                Предпочтительный способ связи: телеграм, телефон
            </address>
        `;
        document.getElementById('contacts-text').innerHTML = contactsHTML;
        if (data.contactsCollapsed) document.getElementById('card-contacts').classList.add('collapsed');

        document.title = `${data.name} — ${data.role}`;
        updateFloatingButton();
    })
    .catch(error => {
        console.error('Ошибка загрузки profile.json:', error);
    });

// Render submodules (career items)
function renderSubmodules(containerId, items) {
    const container = document.getElementById(containerId);
    if (!items || items.length === 0) return;

    container.innerHTML = items.map(item => {
        const tagsHTML = item.tags ? `<div class="tags-container">${item.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : '';

        if (item.comment) {
            return `
                <div class="submodule-item">
                    <div class="submodule-grid">
                        <div class="submodule-main">
                            <div class="submodule-header">
                                <div>
                                    <div class="submodule-title">${item.title}</div>
                                    ${item.subtitle ? `<div class="submodule-subtitle">${item.subtitle}</div>` : ''}
                                </div>
                            </div>
                            <div class="submodule-body">${item.description}</div>
                            ${tagsHTML}
                        </div>

                        <!-- Right column with date and comment -->
                        <div class="submodule-side-wrapper">
                            ${item.date ? `<div class="submodule-date-container"><div class="submodule-date">${item.date}</div></div>` : ''}
                            <div class="submodule-comment-side">
                                ${item.comment}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        return `
            <div class="submodule-item">
                <div class="submodule-header">
                    <div>
                        <div class="submodule-title">${item.title}</div>
                        ${item.subtitle ? `<div class="submodule-subtitle">${item.subtitle}</div>` : ''}
                    </div>
                    ${item.date ? `<div class="submodule-date">${item.date}</div>` : ''}
                </div>
                <div class="submodule-body">${item.description}</div>
                ${tagsHTML}
            </div>
        `;
    }).join('');
}

// Render projects grid
function renderProjectsGrid(containerId, projects) {
    const container = document.getElementById(containerId);
    if (!projects || projects.length === 0) return;

    container.innerHTML = projects.map((item, index) => {
        const tagsHTML = item.tags ? `<div class="tags-container">${item.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : '';
        const imgHTML = item.previewImg ? `<img src="${item.previewImg}" alt="${item.title}" class="project-card-image">` : '';

        return `
            <div class="project-card" onclick="openModal(${index})">
                ${imgHTML}
                <div class="project-card-content">
                    <div class="project-card-title">${item.title}</div>
                    ${item.subtitle ? `<div class="project-card-subtitle">${item.subtitle}</div>` : ''}
                    <div class="project-card-desc">${item.description}</div>
                    ${tagsHTML}
                </div>
            </div>
        `;
    }).join('');
}

// Open project modal
function openModal(index) {
    const project = projectsData[index];
    if (!project) return;

    // Очищаем ВСЕ поля модального окна перед заполнением
    document.getElementById('modalTitle').textContent = '';
    document.getElementById('modalSubtitle').textContent = '';
    document.getElementById('modalGallery').innerHTML = '';
    document.getElementById('modalDescription').textContent = ''; // <-- ВАЖНО: Очищаем описание!
    document.getElementById('modalTags').innerHTML = '';
    document.getElementById('modalLinkContainer').innerHTML = '';

    // Устанавливаем заголовок и подзаголовок
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalSubtitle').textContent = `${project.subtitle || ''}${project.date ? ' • ' + project.date : ''}`;

    // Если есть htmlFile, грузим его
    if (project.htmlFile) {
        document.getElementById('modalGallery').innerHTML = '<div class="loader">Загрузка...</div>';
        document.getElementById('projectModal').classList.add('active');
        document.body.style.overflow = 'hidden';

        fetch(project.htmlFile)
            .then(response => {
                if (!response.ok) throw new Error('Файл не найден');
                return response.text();
            })
            .then(html => {
                document.getElementById('modalGallery').innerHTML = html;
            })
            .catch(error => {
                console.error('Ошибка загрузки проекта:', error);
                document.getElementById('modalGallery').innerHTML = '<p>Не удалось загрузить проект.</p>';
            });
    }
    // Если нет htmlFile, используем старую логику
    else {
        // Теги
        if (project.tags) {
            document.getElementById('modalTags').innerHTML = project.tags.map(t => `<span class="tag">${t}</span>`).join('');
        }

        // Изображения
        if (project.modalImages) {
            document.getElementById('modalGallery').innerHTML = project.modalImages.map(img => `<img src="${img}" alt="Скриншот проекта">`).join('');
        }

        // Описание (только если есть)
        if (project.fullDescription) {
            document.getElementById('modalDescription').textContent = project.fullDescription;
        } else if (project.description) {
            document.getElementById('modalDescription').textContent = project.description;
        }

        // Ссылка (только если есть)
        if (project.link) {
            document.getElementById('modalLinkContainer').innerHTML = `
                <a href="${project.link}" target="_blank" class="modal-link-btn">
                    Перейти к проекту &rarr;
                </a>
            `;
        }

        document.getElementById('projectModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}
// Close project modal
function closeModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('projectModal').classList.remove('active');
    document.body.style.overflow = '';
}

// Copy text to clipboard
function copyToClipboard(text, btnElement) {
    navigator.clipboard.writeText(text).then(() => {
        const tooltip = btnElement.nextElementSibling;
        if (tooltip) {
            tooltip.classList.add('show');
            setTimeout(() => tooltip.classList.remove('show'), 1500);
        }
    });
}

// Scroll to specific card
function scrollToCard(cardId) {
    const card = document.getElementById(cardId);
    if (card) {
        if (card.classList.contains('collapsed')) card.classList.remove('collapsed');
        card.scrollIntoView({ behavior: 'smooth' });
    }
}

// Toggle card collapse
function toggleCard(cardId) {
    const card = document.getElementById(cardId);
    card.classList.toggle('collapsed');
    updateFloatingButton();
}

// Get most visible expanded card
function getMostVisibleExpandedCard() {
    const cards = document.querySelectorAll('.card-collapsible:not(.collapsed)');
    let maxVisibleHeight = 0;
    let targetCard = null;

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(window.innerHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);

        if (visibleHeight > maxVisibleHeight) {
            maxVisibleHeight = visibleHeight;
            targetCard = card;
        }
    });

    return { targetCard, maxVisibleHeight };
}

// Update floating collapse button visibility
function updateFloatingButton() {
    const btn = document.getElementById('floatingBtn');
    const { targetCard, maxVisibleHeight } = getMostVisibleExpandedCard();

    if (targetCard && maxVisibleHeight > 100) {
        btn.classList.add('visible');
    } else {
        btn.classList.remove('visible');
    }
}

// Collapse the most visible card
function collapseMostVisibleCard() {
    const { targetCard } = getMostVisibleExpandedCard();
    if (targetCard) {
        targetCard.classList.add('collapsed');
        updateFloatingButton();
    }
}

// Scroll event handler with throttling
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            onScrollUpdate();
            ticking = false;
        });
        ticking = true;
    }
});

// Update scroll-dependent elements
function onScrollUpdate() {
    const scrolled = window.scrollY;
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    document.getElementById("progressBar").style.width = ((winScroll / height) * 100) + "%";

    const sq1 = document.querySelector('.square-1');
    const sq2 = document.querySelector('.square-2');
    const gp1 = document.querySelector('.gamepad-1');
    const gp2 = document.querySelector('.gamepad-2');

    if (sq1) sq1.style.transform = `translate3d(0, ${scrolled * 0.22}px, 0) rotate(${20 + scrolled * 0.03}deg)`;
    if (sq2) sq2.style.transform = `translate3d(0, ${-scrolled * 0.18}px, 0) rotate(${-15 - scrolled * 0.02}deg)`;
    if (gp1) gp1.style.transform = `translate3d(0, ${-scrolled * 0.15}px, 0) rotate(${-12 + scrolled * 0.04}deg)`;
    if (gp2) gp2.style.transform = `translate3d(0, ${scrolled * 0.2}px, 0) rotate(${25 - scrolled * 0.03}deg)`;

    updateFloatingButton();
}
