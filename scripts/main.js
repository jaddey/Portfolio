document.addEventListener('DOMContentLoaded', () => {
    fetch('profile.json')
        .then(response => response.json())
        .then(data => {
            // Данные пользователя
            document.getElementById('user-name').textContent = data.name;
            document.getElementById('user-role').textContent = data.role;
            
            // О себе
            document.getElementById('about-title').textContent = data.aboutTitle || "О себе";
            document.getElementById('about-text').innerText = data.aboutText;
            if (data.aboutCollapsed) document.getElementById('card-about').classList.add('collapsed');
            
            // Карьера
            document.getElementById('career-title').textContent = data.careerTitle || "Карьера";
            if (typeof renderSubmodules === 'function' && data.careerItems) {
                renderSubmodules('career-list', data.careerItems);
            }
            if (data.careerCollapsed) document.getElementById('card-career').classList.add('collapsed');

            // Мои работы
            document.getElementById('projects-title').textContent = data.projectsTitle || "Мои работы";
            if (typeof renderSubmodules === 'function' && data.projectItems) {
                renderSubmodules('projects-list', data.projectItems);
            }
            if (data.projectsCollapsed) document.getElementById('card-projects').classList.add('collapsed');

            // Контакты
            document.getElementById('contacts-title').textContent = data.contactsTitle || "Контакты";
            const contactsHTML = `
                Тел.: <span class="contact-row">
                    <a href="tel:+79511567563">+7 951 156 75 63</a>
                    <button class="copy-btn" onclick="copyToClipboard('+79511567563', this)" title="Скопировать" aria-label="Скопировать телефон">
                        <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                    <span class="copy-tooltip">Скопировано!</span>
                </span><br>
                E-mail: <span class="contact-row">
                    <a href="mailto:alexander.masyuk@gmail.com">alexander.masyuk@gmail.com</a>
                    <button class="copy-btn" onclick="copyToClipboard('alexander.masyuk@gmail.com', this)" title="Скопировать" aria-label="Скопировать email">
                        <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                    <span class="copy-tooltip">Скопировано!</span>
                </span><br>
                Телеграм: <span class="contact-row">
                    <a href="https://t.me/KlausterHargreeves" target="_blank">@KlausterHargreeves</a>
                    <button class="copy-btn" onclick="copyToClipboard('@KlausterHargreeves', this)" title="Скопировать" aria-label="Скопировать телеграм">
                        <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                    <span class="copy-tooltip">Скопировано!</span>
                </span><br>
                Предпочтительный способ связи: телеграм, телефон
            `;
            document.getElementById('contacts-text').innerHTML = contactsHTML;
            if (data.contactsCollapsed) document.getElementById('card-contacts').classList.add('collapsed');
        })
        .catch(err => console.error('Ошибка загрузки profile.json:', err));
});
