// ================================================================
// CONFIGURAÇÕES DA MARCA FICTÍCIA
// ================================================================
// WhatsApp: use somente números no formato 55 + DDD + número.
// Instagram: use "@usuario" ou o link completo do perfil.
const businessConfig = {
  whatsapp: "",
  instagram: "",
};

// Mensagem usada nos CTAs gerais da página.
const generalMessage = "Olá! Vi seu site e gostaria de saber mais sobre o acompanhamento.";

// As chaves correspondem ao atributo data-mode presente no HTML.
// Dessa forma, todos os botões compartilham a mesma lógica.
const modeMessages = {
  presencial: "Olá! Vi seu site e tenho interesse no acompanhamento presencial.",
  online: "Olá! Vi seu site e tenho interesse no acompanhamento online.",
  plano: "Olá! Vi seu site e tenho interesse no plano de treino personalizado.",
};

const menuButton = document.querySelector(".menu-button");
const mainMenu = document.querySelector(".main-nav");
const menuLinks = document.querySelectorAll(".main-nav a");
const header = document.querySelector(".site-header");

// Fecha o menu e atualiza os atributos de acessibilidade.
function closeMenu() {
  mainMenu.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu");
  document.body.classList.remove("menu-open");
}

menuButton.addEventListener("click", () => {
  const isOpen = mainMenu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  document.body.classList.toggle("menu-open", isOpen);
});

menuLinks.forEach((link) => link.addEventListener("click", closeMenu));

// Escape só interfere no foco quando o menu realmente está aberto.
document.addEventListener("keydown", (event) => {
  const isMenuOpen = menuButton.getAttribute("aria-expanded") === "true";

  if (event.key === "Escape" && isMenuOpen) {
    closeMenu();
    menuButton.focus();
  }
});

function normalizeWhatsappNumber(number) {
  return number.replace(/\D/g, "");
}

function isValidWhatsappNumber(number) {
  return /^55\d{10,11}$/.test(number);
}

function createWhatsappUrl(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

const whatsappNumber = normalizeWhatsappNumber(businessConfig.whatsapp);
const hasWhatsapp = isValidWhatsappNumber(whatsappNumber);

document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  // data-mode="online" fica disponível como link.dataset.mode.
  const message = modeMessages[link.dataset.mode] || generalMessage;

  // Sem um número válido, o link permanece oculto e não gera erro.
  if (!hasWhatsapp) {
    link.hidden = true;
    return;
  }

  link.href = createWhatsappUrl(whatsappNumber, message);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.hidden = false;
});

// Os links internos substituem os CTAs do WhatsApp enquanto o número está vazio.
document.querySelectorAll("[data-whatsapp-fallback]").forEach((link) => {
  link.hidden = hasWhatsapp;
});

function createInstagramUrl(value) {
  const instagramValue = value.trim();

  if (!instagramValue) return "";

  if (/^https?:\/\/(www\.)?instagram\.com\//i.test(instagramValue)) {
    return instagramValue;
  }

  const username = instagramValue.replace(/^@/, "");
  return /^[a-zA-Z0-9._]+$/.test(username)
    ? `https://www.instagram.com/${username}/`
    : "";
}

const instagramUrl = createInstagramUrl(businessConfig.instagram);
const instagramLink = document.querySelector("[data-instagram]");

if (instagramLink && instagramUrl) {
  instagramLink.href = instagramUrl;
  instagramLink.target = "_blank";
  instagramLink.rel = "noopener noreferrer";
  instagramLink.hidden = false;
}

// Evita uma coluna vazia quando WhatsApp e Instagram ainda não foram configurados.
const contactColumn = document.querySelector("[data-contact-column]");
if (!hasWhatsapp && !instagramUrl) {
  contactColumn.hidden = true;
}

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
