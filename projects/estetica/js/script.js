// ================================================================
// CONFIGURAÇÕES DA AURA ESTÉTICA
// ================================================================
// Troque somente os valores abaixo quando tiver os dados reais.
// WhatsApp: use apenas números no formato 55 + DDD + número.
// Instagram: use "@usuario" ou o link completo do perfil.
// Endereço: deixe vazio enquanto não houver um endereço real.
// Horários: adicione cada período como um item da lista.
const businessConfig = {
  whatsapp: "",
  instagram: "",
  address: "",
  hours: [],
};

// Mensagem usada nos botões gerais de agendamento.
const generalMessage = "Olá! Vi o site da Aura Estética e gostaria de agendar uma avaliação.";

// Cada chave corresponde ao atributo data-treatment de um tratamento.
// Isso permite usar uma única lógica para todos os links do WhatsApp.
const treatmentMessages = {
  limpeza: "Olá! Vi o site da Aura Estética e gostaria de saber mais sobre Limpeza de Pele.",
  peeling: "Olá! Vi o site da Aura Estética e gostaria de saber mais sobre Peeling.",
  drenagem: "Olá! Vi o site da Aura Estética e gostaria de saber mais sobre Drenagem Linfática.",
  modeladora: "Olá! Vi o site da Aura Estética e gostaria de saber mais sobre Massagem Modeladora.",
  facial: "Olá! Vi o site da Aura Estética e gostaria de saber mais sobre Tratamento Facial.",
  corporal: "Olá! Vi o site da Aura Estética e gostaria de saber mais sobre Cuidados Corporais.",
};

const menuButton = document.querySelector(".menu-button");
const mainMenu = document.querySelector(".main-nav");
const menuLinks = document.querySelectorAll(".main-nav a");
const header = document.querySelector(".site-header");

// Fecha o menu e restaura os atributos usados por leitores de tela.
function closeMenu() {
  mainMenu.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu");
  document.body.classList.remove("menu-open");
}

// Alterna o menu em celulares e tablets.
menuButton.addEventListener("click", () => {
  const isOpen = mainMenu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  document.body.classList.toggle("menu-open", isOpen);
});

menuLinks.forEach((link) => link.addEventListener("click", closeMenu));

// Escape fecha o menu somente quando ele realmente está aberto.
document.addEventListener("keydown", (event) => {
  const isMenuOpen = menuButton.getAttribute("aria-expanded") === "true";

  if (event.key === "Escape" && isMenuOpen) {
    closeMenu();
    menuButton.focus();
  }
});

// Remove espaços, símbolos e outros caracteres do número informado.
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
  // dataset transforma data-treatment="limpeza" em link.dataset.treatment.
  const message = treatmentMessages[link.dataset.treatment] || generalMessage;

  // Sem número válido, o link continua oculto e não causa erro ao visitante.
  if (!hasWhatsapp) {
    link.hidden = true;
    return;
  }

  link.href = createWhatsappUrl(whatsappNumber, message);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.hidden = false;
});

// O link interno aparece apenas quando o WhatsApp ainda não foi configurado.
const contactFallback = document.querySelector("[data-contact-fallback]");
if (contactFallback && hasWhatsapp) {
  contactFallback.hidden = true;
}

// Aceita tanto um usuário quanto o link completo do Instagram.
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

// Endereço e horários só ocupam espaço quando foram configurados.
const addressElement = document.querySelector("[data-address]");
if (addressElement && businessConfig.address.trim()) {
  addressElement.textContent = businessConfig.address;
  addressElement.hidden = false;
}

const hoursElement = document.querySelector("[data-hours]");
const hoursColumn = document.querySelector("[data-hours-column]");
if (businessConfig.hours.length > 0) {
  hoursElement.textContent = businessConfig.hours.join("\n");
} else {
  hoursColumn.hidden = true;
}

// Evita uma coluna de contato vazia no rodapé.
const contactColumn = document.querySelector("[data-contact-column]");
if (!hasWhatsapp && !instagramUrl && !businessConfig.address.trim()) {
  contactColumn.hidden = true;
}

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
