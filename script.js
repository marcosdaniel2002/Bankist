'use strict';
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollto = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabsContainers = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////////
// BUTON SCROLLING

btnScrollto.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' }); // modern way
});

///////////////////////////////////////////
// PAGE NAVIGATION

/* document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
}); */

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// /////////////////////////////////////
// TABBED COMPONENT

tabsContainers.addEventListener('click', function (e) {
  const click = e.target.closest('.operations__tab');

  // guard clause
  if (!click) return;
  document
    .querySelectorAll('.operations__tab')
    // remove tab
    .forEach(t => t.classList.remove('operations__tab--active'));
  //active tab
  click.classList.add('operations__tab--active');

  // activate content area
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${click.dataset.tab}`)
    .classList.add('operations__content--active');
});

//////////////////////////////////////////
// MENU FADE ANIMATION
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sibblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    sibblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

////////////////////////////////////////////////////////////
// STICKY NAVIGATION INTERSECTION OBSERVER API

// const obsCallBack = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const obsOptions = {
//   root: null, // viewport
//   threshold: [0, 0.2],
// };
// const observer = new IntersectionObserver(obsCallBack, obsOptions);
// observer.observe(section1);

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//////////////////////////////////////////////////
// REVEAL SECTIONS

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

/////////////////////////////////////////////////
// LAZY LOADING IMAGES
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  // replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    this.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});
imgTargets.forEach(img => imgObserver.observe(img));

////////////////////////////////////////////////////
// SLIDES
let curSlide = 0;
slider.style.overflow = 'visible';
// 0% 100% 200% 300% ....
const goToSlide = function (numSlides) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - numSlides)}%)`)
  );
};

// movs slides
const nextSlide = function () {
  if (curSlide === slides.length - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = slides.length - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

// dots slides
const createDots = function () {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

const init = function () {
  goToSlide(0);
  createDots();
  activateDot(0);
};
init();

// EVENT HANDLERS SLIDE
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  e.key === 'ArrowRight' && nextSlide(); // short circuiting
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDot(slide);
  }
});

///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
/// LECTURES

// 181 Selecting, Creating, and Deleting Elements

console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

console.log(allSections); //NODELIST

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button'); // create a HTML COLLECTION async method
console.log(allButtons);

console.log(document.getElementsByClassName('btn')); // create a HTML COLLECTION async method

// creating and inserted elements
// .insertAdjancentHTML
const message = document.createElement('div'); // not yet in the DOM
message.classList.add('cookie-message');
// message.textContent = 'We use cookied for improve functionality and analytics.';
message.innerHTML =
  'We use cookied for improve functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
// header.prepend(message); // add element like a first child
// header.append(message); // last child
// header.prepend(message.cloneNode(true));

/* header.before(message); // element like a siblings
header.after(message); */

// delete elements
/* document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  }); */

// 182 Styles, Attributes and Classes

//styles
message.style.backgroundColor = '#78583A';
message.style.width = '120%';

console.log(message.style.color);
console.log(message.style.backgroundColor); // only get style

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).backgroundColor);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// atributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);

logo.alt = 'Beautiful minimalist logo';

console.log(logo.src);
console.log(logo.getAttribute('src'));
logo.setAttribute('company', 'bankist');

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

// data atributtes
console.log(logo.dataset.versionNumber);

// classes
logo.classList.add('c');
logo.classList.remove('c');
logo.classList.toggle('c');
console.log(logo.classList.contains('nav__logo')); // NOT INCLUDES

// logo.clasName = 'Jonas' NO USAR

// 183 Implementing Smooth Scrolling

/* const btnScrollto = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollto.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords); // relative to view port
  console.log(e.target.getBoundingClientRect());
  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  console.log(
    'Heigh/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // scrolling
  // window.scrollTo(s1coords.left, s1coords.top); // relative to window page
  window.scrollTo(
    s1coords.left + window.pageXOffset,
    s1coords.top + window.pageYOffset
  );

  // modern way
  section1.scrollIntoView({ behavior: 'smooth' });
}); */

// 184 Types of Events and Event Handlers
/* const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('addEventListener: Great! You are reading the heading :D');
  // h1.removeEventListener('mouseenter', alertH1); // only execute once time
};
h1.addEventListener('mouseenter', alertH1);

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000); */
/* h1.onmouseenter = function (e) {
  alert('addEventListener: Great! You are reading the heading :D');
}; */

// 185 Event Propagation_ Bubbling and Capturing

// 186 Event Propagation in Practice

/* const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
console.log(randomInt(1, 3));
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
  // e.curentTarget === this

  // stop propagation to father elements
  // e.stopPropagation();
});
document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});
document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
}); */

// 187 Event Delegation_ Implementing Page Navigation

// 188 DOM Traversing

/* const h1 = document.querySelector('h1');

// going downwards: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
console.log(h1.firstChild);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// going upwardsL: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)'; // close parent element that contains class header
h1.closest('h1').style.background = 'var(--gradient-primary)'; // itself

// going sideways: sibblings
console.log(h1.previousElementSibling); // null because itself is the first element
console.log(h1.nextElementSibling);
// if we need all sibblings
console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});
 */
// 189 Building a Tabbed Component

// 190 Passing Arguments to Event Handlers

// 190 Passing Arguments to Event Handlers

// 191 Implementing a Sticky Navigation_ The Scroll Event

// 193 Revealing Elements on Scroll

// 194 Lazy Loading Images

// 195 Building a Slider Component_ Part 1

// 196 Building a Slider Component_ Part 2

// 197 Lifecycle DOM Events
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fuly loaded', e);
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });

// 198 Efficient Script Loading_ defer and async
