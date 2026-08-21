// 1. Находим основные элементы модального окна на странице
const modal = document.getElementById('projectModal');
const modalBody = document.getElementById('modalContentContainer');
const closeBtn = document.getElementById('closeModalBtn');

// 2. Делегирование: слушаем клики по всей сетке карточек
const portfolioGrid = document.querySelector('.portfolio-grid');

portfolioGrid.addEventListener('click', async (event) => {
  // Проверяем, кликнули ли мы по карточке (или элементу внутри карточки)
  const card = event.target.closest('.portfolio-card');
  if (!card) return;

  // Считываем путь к файлу из дата-атрибута (например, data-project="projects/project-1.html")
  const projectUrl = card.dataset.project;
  if (!projectUrl) return;

  // Показываем индикатор загрузки, пока файл качается
  modalBody.innerHTML = '<div class="loader">Загрузка...</div>';
  modal.classList.add('active'); // Открываем модалку

  try {
    // Делаем запрос за HTML-файлом работы
    const response = await fetch(projectUrl);
    
    if (!response.ok) {
      throw new Error(`Ошибка загрузки: ${response.status}`);
    }

    // Превращаем ответ в текст (HTML)
    const htmlContent = await response.text();

    // Вставляем полученную верстку внутрь модалки
    modalBody.innerHTML = htmlContent;

  } catch (error) {
    console.error('Не удалось загрузить проект:', error);
    modalBody.innerHTML = '<p class="error">Произошла ошибка при загрузке проекта.</p>';
  }
});

// 3. Закрытие модального окна и очистка содержимого
function closeModal() {
  modal.classList.remove('active');
  // Очищаем содержимое через небольшую паузу (после анимации закрытия),
  // чтобы не занимать память и остановить возможное воспроизведение медиа/видео
  setTimeout(() => {
    modalBody.innerHTML = '';
  }, 300);
}

// Закрываем по кнопке крестика или по клику на темный фон (оверлей)
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});
