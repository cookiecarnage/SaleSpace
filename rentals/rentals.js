"use strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

// ! Modal window
const openModal = function(evt) {
    evt.preventDefault();
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
};

const closeModal = function() {
    modal.classList.add("hidden");
    overlay.classList.add("hidden"); 
};

// Check every btn which are able to open modal window
btnsOpenModal.forEach( (btn) => btn.addEventListener("click", openModal) );

// If User clicked Close modal btn
btnCloseModal.addEventListener("click", closeModal);

// If User clicked on oveerlay to close modal
overlay.addEventListener("click", closeModal);

// If User pressed Escape btn
document.addEventListener("keydown", function(evt) {
    if (evt.key === "Escape" && !modal.classList.contains("hidden")) {
        console.log("Closing modal");
        closeModal();
    }
});

// ! "Learn more" button smooth scrolling to the top of section 1
btnScrollTo.addEventListener("click", function(evt) {
    // console.log(sec1Coordinates);
    // console.log(evt.target.getBoundingClientRect());
    // console.log('Current scroll (X/Y)', 
    // window.scrollX, scrollY);
    // console.log('height/width of viewport', 
    // document.documentElement.clientHeight, 
    // document.documentElement.clientWidth);

    /* Old school option with calculating coordinates:
     Найдем координаты бокса секции 1
        const sec1Coordinates = section1.getBoundingClientRect();

        window.scrollTo({
        left: sec1Coordinates.left + window.scrollX, 
        top: sec1Coordinates.top + window.scrollY,
        behavior: "smooth"
    });
    
    Another oldscool option, same result
    window.scrollTo(
        sec1Coordinates.left + window.scrollX, sec1Coordinates.top + window.scrollY
        );
    */

    // Scrolling - moves to the top of section--1
    section1.scrollIntoView({behavior: "smooth"});

    // console.log('Current scroll (X/Y)', window.scrollX, scrollY);
});

// ! Page navigation - navigation btns smooth scroll to corresponding sections

// Not great solution of event delegation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//     el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//     });
// });

// Better solution of event delegation
// 1. Add event listener to a common parent element (nav__links list)
document.querySelector('.nav__links').addEventListener('click', function(e) {
    e.preventDefault();
    
    // Matching strategy
    // 2. Determine what element originated the event (nav__link)
    if (e.target.classList.contains('nav__link')) {
        const id = e.target.getAttribute('href');

        document.querySelector(id).scrollIntoView({behavior: 'smooth'});

        console.log('LINK', id);
    }
});

// ! Tabbed component - activating tabs and corresponding text blocks (operations)
tabsContainer.addEventListener('click', function(e) {
    // Matching strategy - надо найти элемент, на к-м возникает клик/событие
    // Простое решение: const clicked = e.target. Но он вернет <span>, если нажать по цифре на кнопке
    // Попробуем тогда найти ближайшего родителя вкладки, к-я была кликнута: const clicked = e.target.parentElement. Но тогда при клике на кнопку будет выходит содержащий ее div, а при клике на span - кнопка. Нам нужна только кнопка при нажатии на кнопку и ее span.
    // Используем поиск ближайшего предка с одноименным названием кнопки - те, при нажатии на кнопку/span выйдет именно эта же кнопка, тк closest включает в поиск и сам элемент, на к-м ищет.
    // ! Исп-е closest имеет смысл, если есть nodeChild элементы, к-е мы можем нечаянно кликнуть и все сломается
    const clicked = e.target.closest('.operations__tab');

    // Если кликнуть по любому месту в контейнере кнопки, выйдет ошибка 'null', тк не сущ-ет такого предка у контейнера при поиске closest. Просто остановим ф-ю, если clicked = false
    if (!clicked) return;

    // Удалим класс активности со всех кнопок и текстовых блоков сразу для упрощения
    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    tabsContent.forEach(c => c.classList.remove('operations__content--active'));

    // Добавим класс активности на кликнутую кнопку
    clicked.classList.add('operations__tab--active');
    // Добавим класс активности на текстовый блок, содержащий цифровой модификатор (--1), такой же что и цифра в атрибуте кликнутой кнопки data.tab
    document
        .querySelector(`.operations__content--${clicked.dataset.tab}`)
        .classList.add('operations__content--active');
});
 
// ! Nav links fade animation on hover
const handleHover = function(e) {
    // this здесь равно передаваемому 'аргументу' opacity, при этом currentTarget остается неизменным - nav
    // console.log(this, e.currentTarget);

    // Здесь у нас нет элементов вроде span, на к-е можно нечаянно навести мышь, потому исп-м просто contains
    // Ограничим e.target только нужными ссылками, чтобы не получать объекты при наведении на список/nav
    if (e.target.classList.contains('nav__link')) {
        // Найдем наведенную ссылку
        const clicked = e.target;

        // Выбираем nav, чтобы юзать и другие его элементы, кроме ссылок

        // Найдем все ссылки, являющиеся ближайшими предками наведенной ссылки
        const siblings = clicked.closest('.nav').querySelectorAll('.nav__link');
        // console.log(clicked);

        // ищем через closest и просто тег img для универсальности - можно будет исп-ть для др img, если нпр несколько nav 
        const logo = clicked.closest('.nav').querySelector('img');

        // Снизим прозрачность всех ссылок, кроме  наведенной
        siblings.forEach(el => {
            if (el !== clicked) el.style.opacity = this;
        });
        // снизим прозрачность у лого 
        logo.style.opacity = this;
    }
};

// При наведении мышью на nav =>
// this = 0.5 или 1. e.currentTarget останется неизменным, тк мы установили сами значение this
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));
// ⬆ улучшенная версия этого способа ⬇:
// nav.addEventListener('mouseout', function (e) {
//     handleHover(e, 1);
// });

// ! Sticky navigation
/* Не лучшее решение для performance из-за события scroll
const initialCoords = section1.getBoundingClientRect();

window.addEventListener('scroll', function() {
    console.log(window.scrollY);
    console.log(document.documentElement.scrollTop);

    if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
});
*/

const header = document.querySelector('.header');
const navHeight =  nav.clientHeight;

// Ф-я колбэк с аргументом entries - cписок объектов с инфой о пересечении. Будем исп-ть св-ва объекта isIntersecting.
const stickyNav = function(entries) {
    // из entries деструктурируем переменную для каждого объекта
    const [entry] = entries;
    // console.log(entry);

    // добавим класс sticky, если нет пересечения элемента header и наблюдаемой области window (false) - те, когда не будет видно header
    if (!entry.isIntersecting) nav.classList.add('sticky'); 
    // удалим класс в других случаях   
    else nav.classList.remove('sticky');
};

// Создадим ссылку на экземпляр наблюдателя, чтобы вызвать методы прослушивания. Принимает ф-ю колбэк stickyNav, объект по доп настройкам пересечения options
const headerObserver = new IntersectionObserver(
    stickyNav, {
        root: null, // наблюдаемая область, родитель наблюдаемого элемента. По дефолту = window

        threshold: 0, // порог пересечения, при к-м сработает колбэк. Здесь сработает при пересечении даже на 1px

        rootMargin: `-${navHeight}px`, // зададим отрицательный отступ в высоту nav (-90px), чтобы он появлялся за -90px до пересечения с секцией 1
    }
);

// Вызов метода observe для запуска наблюдения за переданным элементом header
headerObserver.observe(header);

// ! Reveal sections on scroll
const allSections = document.querySelectorAll('.section');

// Ф-я колбэк с аргументами: 
//  1. entries - cписок объектов с инфой о пересечении. // Будем исп-ть св-ва объекта isIntersecting, target.
//  2. observer - ссылка на экземпляр наблюдателя для вызова методов прослушивания. Будем исп-ть его методы unobserve
const revealSection = function(entries, observer) {
    // из списка объектов с инфой о пересечении деструктурируем переменную для каждого объекта
    const [entry] = entries;
    // console.log(entry);

    // остановим выполнение ф-ии, если нет пересечения элемента section и наблюдаемой области window (false)
    if (!entry.isIntersecting) return;

    // если есть пересечение элемента section и наблюдаемой области window, удалим класс с наблюдаемого элемента section (entry.target), чтобы показать секцию
    entry.target.classList.remove('section--hidden');

    // Отключаем наблюдение за section (хорошо для performance)
    observer.unobserve(entry.target);
};

// Создадим ссылку на экземпляр наблюдателя, чтобы вызвать методы прослушивания. Принимает ф-ю колбэк revealSection, объект по доп настройкам пересечения options
const sectionObserver = new IntersectionObserver(
    revealSection, {
        root: null, // наблюдаемая область, родитель наблюдаемого элемента. По дефолту = window

        threshold: 0.15, // порог пересечения, при к-м сработает колбэк. Секция покажется, когда ее 15% попадет в область наблюдения. 
    }
);

// На переборе всех секций вызовем анонимную ф-ю с аргументом section.
allSections.forEach( function(section) {
    // вызовем метод observe для запуска наблюдения за переданным элементом section
    sectionObserver.observe(section); 
    
    // добавим класс к секции, чтобы скрыть ее. Те, по дефолту все секции будут скрыты, и лишь при пересечении покажутся.
    //  ! TURN ON LATER 
    //section.classList.add('section--hidden');
});


// ! Lazy loading images on scroll (great for performance)
const imgTargets = document.querySelectorAll('img[data-src]');

// Ф-я колбэк с аргументами: 
//  1. entries - cписок объектов с инфой о пересечении. // Будем исп-ть св-ва объекта isIntersecting, target.
//  2. observer - ссылка на экземпляр наблюдателя для вызова методов прослушивания. Будем исп-ть его методы unobserve
const loadImg = function(entries, observer) {
    // из списка объектов с инфой о пересечении деструктурируем переменную для каждого объекта
    const [entry] = entries;
    // console.log(entry);

    // остановим выполнение ф-ии, если нет пересечения элемента img и наблюдаемой области window (false)
    if (!entry.isIntersecting) return;

    // если есть пересечение элемента img и наблюдаемой области window:
    //  1. подменим src ссылку на ссылку из data-src - те сжатую картинку на тяжелую
    entry.target.src = entry.target.dataset.src;

    //  2. добавим event listener на элемент img с событием загрузки load - те, после полной загрузки картинки удалим класс lazy-img, чтобы снять блюр
    entry.target.addEventListener('load', function() {
        entry.target.classList.remove('lazy-img');
    // * если удаление класса написать без этого хэндлера - те, удалять одновременно с подменой src, при медленной скорости интернета картинка, еще не догрузившись, будет видна в плохом качестве
    });

    // Отключаем наблюдение за img (хорошо для performance)
    observer.unobserve(entry.target);
};

// Создадим ссылку на экземпляр наблюдателя, чтобы вызвать методы прослушивания. Принимает ф-ю колбэк loadImg, объект по доп настройкам пересечения options
const imgObserver = new IntersectionObserver(
    loadImg, {
        root: null, // наблюдаемая область, родитель наблюдаемого элемента. По дефолту = window

        threshold: 0, // порог пересечения, при к-м сработает колбэк. Секция покажется даже при пересчении на 1px

        rootMargin: '200px' // начать загрузку картинки заранее, за 200px до ее появления, чтобы юзер не заметил наш трюк с lazy loading
    }
);

// На переборе всех секций вызовем анонимную ф-ю с аргументом section.
imgTargets.forEach(img => imgObserver.observe(img));
    // вызовем метод observe для запуска наблюдения за переданным элементом section


// ! Slider: arrow and circle btns
const slider = function () {
    const slides = document.querySelectorAll('.slide');
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    const dotContainer = document.querySelector('.dots');

    // Установим текущий слайд как 0
    let curSlide = 0;
    const maxSlide = slides.length;

    // Создадим ф-ю для вставки на страницу круглых кнопок слайдера
    const createDots = function() {
        slides.forEach((_, i) => {
            dotContainer.insertAdjacentHTML(
                'beforeend', 
                `<button class="dots__dot dots__dot--active" data-slide="${i}"></button>`
            );
        });
    };

    // Создадим ф-ю для активации круглой кнопки слайдера
    const activateDot = function (slide) {
        // удалим класс активности со всех кнопок
        document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

        // добавим класс активности только на активную кнопку
        document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
        // или проще - dots[slide].classList.add('dots__dot--active');
        console.log(slide);
    };

    // Создадим ф-ю для перемещения слайда, принимающую текущий слайд
    const goToSlide = function(curSlide) {
        slides.forEach((s, i) => {
            console.log(`i = ${i}, curSlide = ${curSlide}`);
            
            s.style.transform = `translateX(${100 * (i - curSlide)}%)`;
            console.log(100 * (i - curSlide));
        });
        // console.log('************************');
    };

    // Создадим ф-ю для перемещения слайдов вправо для правой кнопки
    const nextSlide = function() {
        // вернем первый слайд, если ф-я доходит до максимального кол-ва слайдов (2)
        if (curSlide === maxSlide - 1) curSlide = 0;
        // увеличиваем текущий слайд на 1 (0, 1, 2)
        else curSlide++; 

        goToSlide(curSlide);
        // i идет в порядке: 0 1 2
        //  слайд 1: 0%
        //  слайд 2: 100%
        //  слайд 3: 200%
        // при первом нажатии правой кнопки curSlide равен 1, те это слайд №2
        //  слайд 1: 100 * (0 - 1) = -100%
        //  слайд 2: 100 * (1 - 1) = 0% 
        //  слайд 3: 100 * (2 - 1) = 100%
        // если curSlide = 2
        //  слайд 1: 100 * (0 - 2) = -200%
        //  слайд 2: 100 * (1 - 2) = -100%
        //  слайд 3: 100 * (2 - 2) = 0%
        // если curSlide = 0
        //  слайд 1: 100 * (0 - 0) = 0%
        //  слайд 2: 100 * (1 - 0) = 100% 
        //  слайд 3: 100 * (2 - 0) = 200%

        activateDot(curSlide);
        //чтобы при клике на кнопки влево/вправо активировались и круглые кнопки, вызовем соотв-ю ф-ю
    };

    // Создадим ф-ю для перемещения слайдов влево для левой кнопки
    const prevSlide = function() {
        // если текущий слайд = 0, те это слайд №1, установим текущему слайду значение 2, чтобы перемещение произошло на слайд 2 (№3) и можно было уменьшать значение 
        if (curSlide === 0) curSlide = maxSlide - 1;
        // уменьшаем текущий слайд на 1 (2, 1, 0)
        else curSlide--; 

        goToSlide(curSlide);
        // i идет в порядке: 2 1 0
        //  слайд 1: 0%
        //  слайд 2: 100%
        //  слайд 3: 200%
        // при первом нажатии левой кнопки curSlide равен 2, те это слайд №3
        //  слайд 1: 100 * (0 - 2) = -200%
        //  слайд 2: 100 * (1 - 2) = -100%
        //  слайд 3: 100 * (2 - 2) = 0%
        // если curSlide = 1
        //  слайд 1: 100 * (0 - 1) = -100%
        //  слайд 2: 100 * (1 - 1) = 0% 
        //  слайд 3: 100 * (2 - 1) = 100%
        // если curSlide = 0
        //  слайд 1: 100 * (0 - 0) = 0%
        //  слайд 2: 100 * (1 - 0) = 100% 
        //  слайд 3: 100 * (2 - 0) = 200%
 
        activateDot(curSlide);
        //чтобы при клике на кнопки влево/вправо активировались и круглые кнопки, вызовем соотв-ю ф-ю
    };
    /* // ? Another version of function for slides moving
    const slideCount = slides.length;
    const moveSlideBy = function (offset) {
        console.log(slideCount,curSlide, offset);
        console.log((slideCount + curSlide + offset) % slideCount);
        
        curSlide = (slideCount + curSlide + offset) % slideCount;

        slides.forEach((s, i) => {
            s.style.transform = `translateX(${(i - curSlide) * 100}%)`;
            console.log((i - curSlide) * 100);
        });
    };
    btnRight.addEventListener("click", () => moveSlideBy(1));
    btnLeft.addEventListener("click", () => moveSlideBy(-1));

    // with bind
    btnRight.addEventListener("click", () => moveSlideBy(1));
    btnLeft.addEventListener("click", () => moveSlideBy(-1));
    */

    // Ф-я инициализации всех основных ф-й для дефолтных значений
    const init = function() {
        goToSlide(0); 
        createDots();

        activateDot(0);
    };
    init();


    // ! Event handlers
    // Обработчик событий при клике на кнопки вправо/влево
    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);

    // Обработчик событий при нажатии стрелок на клавиатуре
    document.addEventListener('keydown', function(e) {
        // оба варианта равноценны, второй юзает short circuiting
        // вызов соотв-ей ф-ии перемещения слайда
        if (e.key === 'ArrowLeft') prevSlide();
        // e.key === 'ArrowRight' && nextSlide();
    });

    // Обработчик событий при клике на круглые кнопки слайдера
    dotContainer.addEventListener('click', function(e) {
        // Matching strategy:
        // Определяем, какой элемент вызывает наше событие (кнопка с классом dots__dot)
        if (e.target.classList.contains('dots__dot')) {
            // если событие содержит нужный класс,
            // присвоим текущему слайду (к-й записан в глобальной переменной) соотв-ее значение атрибута data-slide
            curSlide = Number(e.target.dataset.slide);

            // вызовем ф-ю перемещения слайда
            goToSlide(curSlide);

            activateDot(curSlide);
        }
    });
};
slider();

