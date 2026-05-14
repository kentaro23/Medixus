document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    const open = navMenu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });
}

if (header) {
  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

const revealElements = document.querySelectorAll(".reveal");
const countElements = document.querySelectorAll("[data-count-to]");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));

  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  countElements.forEach((element) => countObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
  countElements.forEach(animateCount);
}

function animateCount(element) {
  const target = Number(element.dataset.countTo || 0);
  const suffix = element.dataset.countSuffix || "";
  const duration = 1100;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.round(target * eased).toLocaleString("ja-JP")}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

const contactType = document.querySelector("[data-contact-type]");
if (contactType) {
  const params = new URLSearchParams(window.location.search);
  const map = {
    os: "Medixus OSの導入検討・資料請求",
    demo: "Medixus OSのデモ予約",
    ir: "投資に関するご相談",
    doctor: "管理者医師（院長）について",
    partner: "パートナー・提携のご相談",
    recruit: "採用について",
  };
  const type = params.get("type");
  if (type && map[type]) contactType.value = map[type];

  const job = params.get("job");
  const message = document.querySelector("[data-contact-message]");
  if (job && message && !message.value) {
    message.value = `応募職種: ${job}\n\n`;
  }
}

const params = new URLSearchParams(window.location.search);
const formStatus = document.querySelector(".form-status");
if (formStatus && params.get("sent") === "1") {
  formStatus.textContent = "ありがとうございます。2営業日以内にご連絡します。";
}
if (formStatus && params.has("error")) {
  formStatus.textContent = "送信できませんでした。時間を置いてもう一度お試しください。";
}

document.querySelectorAll("[data-static-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector(".form-status");
    if (status) {
      status.textContent = "ありがとうございます。2営業日以内にご連絡します。";
    }
  });
});
