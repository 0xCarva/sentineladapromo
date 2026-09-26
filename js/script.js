/* ============================================================
   SENTINELA DA PROMO — script.js
   ============================================================
   CONFIGURAÇÃO RÁPIDA
   Altere apenas a constante abaixo para trocar o link do canal
   em TODOS os botões da página automaticamente.
   ============================================================ */
const TELEGRAM_LINK = "https://t.me/SEU_CANAL";

(function applyTelegramLink() {
  document.querySelectorAll("[data-cta]").forEach((el) => {
    el.setAttribute("href", TELEGRAM_LINK);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
})();

/* ------------------------------------------------------------
   Scroll reveal (IntersectionObserver)
   ------------------------------------------------------------ */
(function scrollReveal() {
  const items = document.querySelectorAll(".reveal");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  items.forEach((el) => observer.observe(el));
})();

/* ------------------------------------------------------------
   Contadores animados (membros, ofertas, etc.)
   Edite o atributo data-counter="NUMERO" no HTML para
   atualizar os valores reais do seu canal.
   ------------------------------------------------------------ */
(function animateCounters() {
  const counters = document.querySelectorAll("[data-counter]");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const run = (el) => {
    const target = parseInt(el.getAttribute("data-counter"), 10) || 0;
    if (prefersReduced) {
      el.textContent = target.toLocaleString("pt-BR");
      return;
    }
    const duration = 1400;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString("pt-BR");
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(run);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          run(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => observer.observe(el));
})();

/* ------------------------------------------------------------
   FAQ accordion
   ------------------------------------------------------------ */
(function faqAccordion() {
  const items = document.querySelectorAll(".faq-item");

  items.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      const isOpen = item.getAttribute("data-open") === "true";

      // fecha os outros itens abertos (accordion de item único)
      items.forEach((other) => {
        if (other !== item) {
          other.setAttribute("data-open", "false");
          other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
          other.querySelector(".faq-answer").style.maxHeight = null;
        }
      });

      const nextState = !isOpen;
      item.setAttribute("data-open", String(nextState));
      question.setAttribute("aria-expanded", String(nextState));
      answer.style.maxHeight = nextState ? answer.scrollHeight + "px" : null;
    });
  });
})();

/* ------------------------------------------------------------
   Fundo com partículas de sinal (canvas leve)
   Respeita prefers-reduced-motion e reduz densidade em telas
   pequenas para manter a performance.
   ------------------------------------------------------------ */
(function signalParticles() {
  const canvas = document.getElementById("signal-canvas");
  if (!canvas) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    canvas.style.display = "none";
    return;
  }

  const ctx = canvas.getContext("2d");
  let width, height, particles;
  const isMobile = window.innerWidth < 700;
  const COUNT = isMobile ? 26 : 52;
  const MAX_DIST = isMobile ? 90 : 130;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = document.documentElement.scrollHeight;
  }

  function makeParticles() {
    particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * Math.min(height, window.innerHeight * 1.4),
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    const viewTop = window.scrollY - 200;
    const viewBottom = window.scrollY + window.innerHeight + 200;

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    });

    ctx.fillStyle = "rgba(255,106,31,0.55)";
    particles.forEach((p) => {
      if (p.y < viewTop || p.y > viewBottom) return;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.strokeStyle = "rgba(255,106,31,0.10)";
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      if (a.y < viewTop || a.y > viewBottom) continue;
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(step);
  }

  resize();
  makeParticles();
  requestAnimationFrame(step);

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      makeParticles();
    }, 250);
  });
})();
