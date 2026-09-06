const opening = document.querySelector('.opening');
const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
const progress = document.querySelector('.scroll-progress span');

const scrollPanels = [...document.querySelectorAll('main > section')];
scrollPanels.forEach((panel, index) => {
  panel.classList.add('scroll-panel');
  panel.style.setProperty('--panel-layer', String(index + 1));
});

const sectionLinks = [...document.querySelectorAll('.desktop-nav a')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    scrollPanels.forEach((panel) => panel.classList.toggle('is-current', panel === entry.target));
    sectionLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-22% 0px -58% 0px', threshold: 0 });

scrollPanels.forEach((panel) => sectionObserver.observe(panel));

window.addEventListener('load', () => {
  window.setTimeout(() => opening?.classList.add('is-hidden'), 680);
});

function setMenu(open) {
  menuButton?.setAttribute('aria-expanded', String(open));
  mobileMenu?.setAttribute('aria-hidden', String(!open));
  mobileMenu?.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
}

menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -45px' });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(element);
});

let ticking = false;
function updateScrollEffects() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  if (progress) progress.style.width = `${ratio * 100}%`;

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-parallax]').forEach((element) => {
      const speed = Number(element.dataset.parallax || 0);
      const rect = element.getBoundingClientRect();
      const offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * speed;
      element.style.setProperty('--parallax-y', `${offset}px`);
      element.style.translate = `0 var(--parallax-y)`;
    });
  }
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateScrollEffects);
}, { passive: true });
updateScrollEffects();

document.querySelectorAll('.tilt-card').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = card.getBoundingClientRect();
    const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -5;
    const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 5;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
  });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
});

const lessonData = {
  water: {
    code: 'Entry 01', date: 'July 23', topic: 'Biochemistry, Water & pH', title: 'The chemistry beneath medicine',
    before: 'I expected Biochemistry to feel distant from clinical medicine, filled with reactions I simply had to remember.',
    after: 'Water, hydrogen bonds, buffers, and pH showed me that normal physiology depends on precise chemical balance. A small molecular shift can become a whole-body problem.',
    clinical: 'Acid-base status influences how I will interpret breathing, circulation, electrolyte changes, and a patient\'s response to illness.',
    memory: 'A buffer is not just a definition. It is one of the body\'s quiet defenses against dangerous change.',
    muddy: 'I still need more practice connecting laboratory pH values with the respiratory and metabolic causes behind them.'
  },
  amino: {
    code: 'Entry 02', date: 'July 30', topic: 'Amino Acids & Peptides', title: 'Learning the alphabet of proteins',
    before: 'The amino acid structures looked like a wall of similar drawings, and memorizing every side chain felt inefficient.',
    after: 'Grouping them by charge, polarity, and chemical behavior gave the structures a pattern. Their properties began to explain how proteins fold and interact.',
    clinical: 'A single amino acid change can alter a protein enough to produce disease, so the details are small but never insignificant.',
    memory: 'The R group gives each amino acid its chemical personality.',
    muddy: 'I am still strengthening my recall of ionization states and how pH changes the charge of different side chains.'
  },
  questions: {
    code: 'Entry 03', date: 'July 31', topic: 'Communication Skills & Protein Structure', title: 'Questions are clinical instruments',
    before: 'I thought good communication depended mostly on asking enough questions and recording the answers.',
    after: 'I learned that sequence, tone, and open-ended questions can determine whether a patient feels safe enough to share the detail that changes the case.',
    clinical: 'Laboratory data becomes more useful when it is placed beside the patient\'s history, symptoms, concerns, and lived experience.',
    memory: 'The right question can uncover information that no laboratory result can provide by itself.',
    muddy: 'I am still learning how to guide an interview without making the conversation feel rehearsed or forced.'
  },
  labster: {
    code: 'Entry 04', date: 'August 4', topic: 'Labster Orientation', title: 'A laboratory without walls',
    before: 'A virtual laboratory sounded less convincing to me than handling the equipment in person.',
    after: 'The simulation gave me a safe place to repeat procedures, observe consequences, and understand the reason behind each step before entering a physical laboratory.',
    clinical: 'Reliable results depend on consistent technique. Simulation helps reinforce the habits that protect both accuracy and safety.',
    memory: 'Practice becomes meaningful when I understand why every step exists.',
    muddy: 'I needed time to become comfortable with the navigation and to connect the virtual controls with real laboratory workflow.'
  },
  buffers: {
    code: 'Entry 05', date: 'August 9', topic: 'Self-Directed Learning, Acid-Base Balance', title: 'Reading imbalance as a story',
    before: 'I initially treated dehydration, electrolyte loss, and acidosis as separate facts in a case.',
    after: 'Working through the case showed me how the findings influence one another. The symptoms, laboratory values, and buffer systems formed one connected biochemical story.',
    clinical: 'Recognizing the pattern matters because management begins with identifying what disturbed homeostasis and how urgently it must be corrected.',
    memory: 'Clinical findings make more sense when I trace them back to the process that produced them.',
    muddy: 'Compensation remains challenging, especially deciding which change is primary and which is the body\'s response.'
  },
  proteins: {
    code: 'Entry 06', date: 'August 14', topic: 'Protein Structure & Assessment', title: 'Structure refuses shortcuts',
    before: 'I believed reviewing the terms would be enough to carry me through questions about protein structure.',
    after: 'The assessment showed me that I needed to understand the forces behind folding, not only the names of the structural levels. That setback gave my next study session a clearer target.',
    clinical: 'Misfolding, denaturation, and altered protein interactions can explain dysfunction at the molecular level and guide the search for disease mechanisms.',
    memory: 'A protein\'s shape is part of its function, and losing that shape can mean losing that function.',
    muddy: 'I am still working on predicting which bonds and interactions are affected under different chemical conditions.'
  },
  oxygen: {
    code: 'Entry 07', date: 'August 27', topic: 'Hemoglobin & Myoglobin', title: 'Following oxygen through the body',
    before: 'Hemoglobin and myoglobin seemed like two similar proteins with curves I needed to memorize.',
    after: 'Comparing their structures, affinities, and roles helped me understand why one transports oxygen while the other stores it for muscle use.',
    clinical: 'Oxygen delivery changes with pH, carbon dioxide, temperature, and disease. These relationships help explain what happens when tissue demand and supply no longer match.',
    memory: 'The hemoglobin curve is a picture of adaptation, not just a graph.',
    muddy: 'I want to become faster at interpreting shifts in the dissociation curve within actual patient scenarios.'
  },
  enzymes: {
    code: 'Entry 08', date: 'Prelim Review', topic: 'Enzymes, Mechanism & Kinetics', title: 'The two-in-the-morning breakthrough',
    before: 'Enzyme kinetics felt like a language of graphs, constants, and equations that I could read without fully understanding.',
    after: 'Doc A\'s late review helped me connect active sites, inhibition, Michaelis-Menten behavior, and regulation as parts of one system. The topic became less intimidating because I finally understood what the numbers were describing.',
    clinical: 'Enzyme behavior helps explain metabolic disease, diagnostic markers, drug action, and why changing one pathway can affect many others.',
    memory: 'A difficult lesson can become manageable when I ask better questions and stay with it long enough.',
    muddy: 'Mixed inhibition and the relationship among Km, Vmax, and graphical changes still require deliberate practice.'
  }
};

const dialog = document.querySelector('.lesson-dialog');
const dialogClose = dialog?.querySelector('.dialog-close');

function openLesson(key) {
  const lesson = lessonData[key];
  if (!dialog || !lesson) return;
  dialog.querySelector('.dialog-code').textContent = lesson.code;
  dialog.querySelector('.dialog-date').textContent = lesson.date;
  dialog.querySelector('.dialog-topic').textContent = lesson.topic;
  dialog.querySelector('#dialog-title').textContent = lesson.title;
  dialog.querySelector('.dialog-before').textContent = lesson.before;
  dialog.querySelector('.dialog-after').textContent = lesson.after;
  dialog.querySelector('.dialog-clinical').textContent = lesson.clinical;
  dialog.querySelector('.dialog-memory').textContent = lesson.memory;
  dialog.querySelector('.dialog-muddy').textContent = lesson.muddy;
  dialog.showModal();
  document.body.classList.add('dialog-open');
}

document.querySelectorAll('.lesson-card').forEach((card) => card.addEventListener('click', () => openLesson(card.dataset.lesson)));
dialogClose?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', (event) => {
  const rect = dialog.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) dialog.close();
});
dialog?.addEventListener('close', () => document.body.classList.remove('dialog-open'));

const audio = document.querySelector('.site-audio');
const musicToggle = document.querySelector('.music-toggle');
const musicIcon = musicToggle?.querySelector('span');
const musicStatus = document.querySelector('.music-status');
const volumeSlider = document.querySelector('.volume-slider');
const volumeValue = document.querySelector('.volume-value');

if (audio && musicToggle && musicIcon && musicStatus && volumeSlider && volumeValue) {
  audio.volume = 0.5;

  const updatePlayer = () => {
    const playing = !audio.paused;
    musicIcon.textContent = playing ? 'Ⅱ' : '▶';
    musicStatus.textContent = playing ? 'Playing' : 'Paused';
    musicToggle.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} Tatlong Wife`);
    musicToggle.setAttribute('aria-pressed', String(playing));
  };

  const updateVolume = () => {
    const value = Number(volumeSlider.value);
    audio.volume = value / 100;
    volumeValue.value = `${value}%`;
    volumeValue.textContent = `${value}%`;
    volumeSlider.style.setProperty('--fill', `${value}%`);
  };

  const tryAutoplay = async () => {
    try {
      await audio.play();
      updatePlayer();
    } catch (_) {
      updatePlayer();
      musicStatus.textContent = 'Tap to play';
    }
  };

  const unlockAudio = async (event) => {
    if (!audio.paused || event.target?.closest?.('.music-player')) return;
    try { await audio.play(); updatePlayer(); } catch (_) { musicStatus.textContent = 'Press play'; }
  };

  musicToggle.addEventListener('click', async () => {
    if (audio.paused) {
      try { await audio.play(); } catch (_) { musicStatus.textContent = 'Tap again'; }
    } else {
      audio.pause();
    }
    updatePlayer();
  });
  volumeSlider.addEventListener('input', updateVolume);
  audio.addEventListener('play', updatePlayer);
  audio.addEventListener('pause', updatePlayer);
  document.addEventListener('pointerdown', unlockAudio, { passive: true });
  document.addEventListener('keydown', unlockAudio);
  updateVolume();
  updatePlayer();
  tryAutoplay();
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileMenu?.classList.contains('open')) setMenu(false);
});
