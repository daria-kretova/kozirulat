document.addEventListener('DOMContentLoaded', function() {
  const slidesContainer = document.getElementById('slides');
  const dots = document.querySelectorAll('.dot');
  const menuLinks = document.querySelectorAll('.menu-link');
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;
  let isScrolling = false;
  let scrollTimeout;
  let touchStartY = 0;
  let touchEndY = 0;

  // Инициализация - скрыть scrollbar
  slidesContainer.style.overflow = 'hidden';

  // Обработчик для навигационных точек
  dots.forEach(dot => {
    dot.addEventListener('click', function() {
      const slideIndex = parseInt(this.getAttribute('data-slide'));
      scrollToSlide(slideIndex);

      // Обновляем хэш в URL на основе текста соответствующего пункта меню
      const correspondingMenuLink = menuLinks[slideIndex];
      if (correspondingMenuLink) {
        const linkText = correspondingMenuLink.textContent.trim().toLowerCase().replace(/\s+/g, '-');
        history.pushState(null, null, `#${linkText}`);
      }
    });
  });

  // Обработчик для пунктов меню
  menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetSlide = document.getElementById(targetId);
      const slideIndex = Array.from(slides).indexOf(targetSlide);
      scrollToSlide(slideIndex);

      // Обновляем хэш в URL
      const linkText = this.textContent.trim().toLowerCase().replace(/\s+/g, '-');
      history.pushState(null, null, `#${linkText}`);
    });
  });

  // Обработчик скролла
  slidesContainer.addEventListener('scroll', function() {
    if (isScrolling) return;
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      updateActiveSlide();
    }, 100);
  });

  // Обработчик колеса мыши
  window.addEventListener('wheel', function(e) {
    if (isScrolling) return;
    
    // Определяем направление скролла
    if (e.deltaY > 0 && currentSlide < slides.length - 1) {
      // Скролл вниз
      scrollToSlide(currentSlide + 1);
    } else if (e.deltaY < 0 && currentSlide > 0) {
      // Скролл вверх
      scrollToSlide(currentSlide - 1);
    }
  }, { passive: false });

  // Обработчик касаний для мобильных устройств
  document.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].clientY;
    handleSwipe();
  }, { passive: true });

  // Функция для обработки свайпа
  function handleSwipe() {
    if (isScrolling) return;
    
    const threshold = 50; // Минимальное расстояние для свайпа
    
    if (touchEndY < touchStartY - threshold && currentSlide < slides.length - 1) {
      // Свайп вверх
      scrollToSlide(currentSlide + 1);
    } else if (touchEndY > touchStartY + threshold && currentSlide > 0) {
      // Свайп вниз
      scrollToSlide(currentSlide - 1);
    }
  }

  // Функция для прокрутки к определенному слайду
  function scrollToSlide(index) {
    isScrolling = true;
    currentSlide = index;
    
    const slide = slides[index];
    const slideTop = slide.offsetTop;
    
    slidesContainer.scrollTo({
      top: slideTop,
      behavior: 'smooth'
    });

    updateNavigation();
    
    setTimeout(() => {
      isScrolling = false;
    }, 1000);
  }

  // Обновление активного слайда
  function updateActiveSlide() {
    const scrollPosition = slidesContainer.scrollTop;
    const windowHeight = window.innerHeight;
    
    slides.forEach((slide, index) => {
      const slideTop = slide.offsetTop;
      const slideHeight = slide.offsetHeight;
      
      if (scrollPosition >= slideTop - windowHeight * 0.3 && 
          scrollPosition < slideTop + slideHeight - windowHeight * 0.3) {
        currentSlide = index;
      }
    });
    
    updateNavigation();

    // Обновляем хэш в URL при скролле
    const correspondingMenuLink = menuLinks[currentSlide];
    if (correspondingMenuLink) {
      const linkText = correspondingMenuLink.textContent.trim().toLowerCase().replace(/\s+/g, '-');
      history.pushState(null, null, `#${linkText}`);
    }
  }

  // Обновление навигации (точки и меню)
  function updateNavigation() {
    // Обновляем точки
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
    
    // Обновляем меню
    menuLinks.forEach((link, index) => {
      link.classList.toggle('active', index === currentSlide);
    });
  }

  // При загрузке с хешем типа #what-we-do — найти соответствующий блок и скроллить
  const hash = window.location.hash;
  if (hash) {
    const menuLink = Array.from(menuLinks).find(link => {
      const text = link.textContent.trim().toLowerCase().replace(/\s+/g, '-');
      return `#${text}` === hash;
    });

    if (menuLink) {
      const targetId = menuLink.getAttribute('href');
      const targetSlide = document.querySelector(targetId);
      const slideIndex = Array.from(slides).indexOf(targetSlide);
      setTimeout(() => {
        scrollToSlide(slideIndex);
      }, 100);
    }
  }

  // Инициализация первого слайда
  updateNavigation();
});

// Получаем элементы меню и гамбургера
const hamburger = document.querySelector('.hamburger');
const mainMenu = document.querySelector('.main-menu');

hamburger.addEventListener('click', () => {
// Переключаем меню
mainMenu.classList.toggle('active');

// Переключаем состояние гамбургера
hamburger.classList.toggle('hamburger--open');

// Меняем символ внутри гамбургера
if (hamburger.classList.contains('hamburger--open')) {
  hamburger.innerHTML = '✕'; // крестик
} else {
  hamburger.innerHTML = '☰'; // три полоски
}
});