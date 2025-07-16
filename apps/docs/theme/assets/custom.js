/**
 * Кастомний скрипт для покращення документації Yurba.js
 */
document.addEventListener('DOMContentLoaded', function() {
  // Додаємо кнопку "Повернутися вгору"
  const backToTopButton = document.createElement('button');
  backToTopButton.innerHTML = '↑';
  backToTopButton.className = 'back-to-top';
  backToTopButton.title = 'Повернутися вгору';
  backToTopButton.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.body.appendChild(backToTopButton);

  // Показуємо/ховаємо кнопку при прокрутці
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });

  // Додаємо підсвічування синтаксису для прикладів коду
  document.querySelectorAll('pre code').forEach(function(block) {
    if (window.hljs) {
      window.hljs.highlightElement(block);
    }
  });

  // Додаємо кнопку копіювання для блоків коду
  document.querySelectorAll('pre').forEach(function(block) {
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.textContent = 'Копіювати';
    
    copyButton.addEventListener('click', function() {
      const code = block.querySelector('code');
      if (code) {
        navigator.clipboard.writeText(code.textContent).then(function() {
          copyButton.textContent = 'Скопійовано!';
          setTimeout(function() {
            copyButton.textContent = 'Копіювати';
          }, 2000);
        });
      }
    });
    
    block.appendChild(copyButton);
  });

  // Додаємо перемикач теми (світла/темна)
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.title = 'Змінити тему';
  themeToggle.innerHTML = '🌓';
  
  themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
  });
  
  // Додаємо перемикач до навігації
  const nav = document.querySelector('.tsd-navigation.primary');
  if (nav) {
    nav.parentNode.insertBefore(themeToggle, nav);
  } else {
    document.body.appendChild(themeToggle);
  }
  
  // Встановлюємо тему з localStorage
  if (localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark-theme');
  }
  
  // Покращення для головної сторінки
  if (window.location.pathname.endsWith('/index.html') || window.location.pathname.endsWith('/')) {
    // Додаємо логотип на головну сторінку
    const pageTitle = document.querySelector('.tsd-page-title');
    if (pageTitle) {
      const logo = document.createElement('img');
      logo.src = './assets/logo.svg';
      logo.alt = 'Yurba.js Logo';
      logo.style.width = '100px';
      logo.style.marginBottom = '20px';
      logo.style.display = 'block';
      
      const container = pageTitle.querySelector('.container');
      if (container) {
        container.insertBefore(logo, container.firstChild);
      }
      
      // Додаємо опис під заголовком
      const h1 = pageTitle.querySelector('h1');
      if (h1 && !pageTitle.querySelector('.subtitle')) {
        const subtitle = document.createElement('p');
        subtitle.className = 'subtitle';
        subtitle.textContent = 'Офіційна API документація для розробників';
        h1.parentNode.insertBefore(subtitle, h1.nextSibling);
      }
    }
  }
});