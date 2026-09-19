// ================================================================
// CONFIGURAÇÃO DOS SEUS CONTATOS
// ================================================================
// Coloque seu WhatsApp entre as aspas usando SOMENTE números.
// Formato: 55 + DDD + número. Exemplo: "5511999999999".
//
// No Instagram, você pode usar "@seuusuario" ou o link completo.
// Exemplo: "https://www.instagram.com/seuusuario/".
const contactConfig = {
  whatsappNumber: "5513997581547",
  instagram: "https://www.instagram.com/jvdev.br/",
};

// Cada tipo de botão usa uma mensagem específica.
// As chaves abaixo correspondem ao atributo data-whatsapp do HTML.
const whatsappMessages = {
  principal: "Olá, João! Vi seu portfólio da JV Dev e gostaria de solicitar um orçamento.",
  essencial: "Olá, João! Vi o portfólio da JV Dev e tenho interesse na Landing Page Essencial.",
  profissional: "Olá, João! Vi o portfólio da JV Dev e tenho interesse na Landing Page Profissional.",
  institucional: "Olá, João! Vi o portfólio da JV Dev e tenho interesse no Site Institucional.",
  personalizado: "Olá, João! Vi o portfólio da JV Dev e gostaria de conversar sobre um projeto personalizado.",
};

// Selecionamos os elementos que terão comportamento interativo.
const menuButton = document.querySelector(".menu-button");
const mainMenu = document.querySelector(".main-nav");
const menuLinks = document.querySelectorAll(".main-nav a");
const header = document.querySelector(".site-header");

// Esta função fecha o menu móvel e atualiza o atributo de acessibilidade.
function closeMenu() {
  mainMenu.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu");
  document.body.classList.remove("menu-open");
}

// Ao tocar no botão, alternamos entre menu aberto e fechado.
menuButton.addEventListener("click", () => {
  const isOpen = mainMenu.classList.toggle("open");

  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  document.body.classList.toggle("menu-open", isOpen);
});

// Depois que o visitante escolhe um link, o menu móvel é fechado.
menuLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// A tecla Escape fecha o menu apenas quando ele estiver realmente aberto.
// Depois disso, o foco volta para o botão para facilitar a navegação por teclado.
document.addEventListener("keydown", (event) => {
  const isMenuOpen = mainMenu.classList.contains("open");

  if (event.key === "Escape" && isMenuOpen) {
    closeMenu();
    menuButton.focus();
  }
});

// Remove qualquer caractere que não seja número e valida o formato brasileiro.
function normalizeWhatsappNumber(number) {
  return number.replace(/\D/g, "");
}

function isValidWhatsappNumber(number) {
  // O total deve ter 12 ou 13 dígitos: 55 + DDD + telefone.
  return /^55\d{10,11}$/.test(number);
}

// Monta a URL final do WhatsApp com a mensagem já preenchida.
function createWhatsappUrl(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

const normalizedWhatsappNumber = normalizeWhatsappNumber(contactConfig.whatsappNumber);
const hasWhatsapp = isValidWhatsappNumber(normalizedWhatsappNumber);

// Todos os elementos com data-whatsapp recebem o mesmo número.
// O valor do atributo escolhe qual mensagem será usada.
document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  const messageKey = link.dataset.whatsapp;
  const message = whatsappMessages[messageKey];

  // Se ainda não houver um número válido, o botão fica oculto.
  // Assim nenhum visitante encontra um link quebrado ou aviso técnico.
  if (!hasWhatsapp || !message) {
    link.hidden = true;
    return;
  }

  link.href = createWhatsappUrl(normalizedWhatsappNumber, message);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.hidden = false;
});

// Aceita tanto "@usuario" quanto um link completo do Instagram.
function createInstagramUrl(value) {
  const instagramValue = value.trim();

  if (!instagramValue) {
    return "";
  }

  if (/^https?:\/\/(www\.)?instagram\.com\//i.test(instagramValue)) {
    return instagramValue;
  }

  const username = instagramValue.replace(/^@/, "");

  if (/^[a-zA-Z0-9._]+$/.test(username)) {
    return `https://www.instagram.com/${username}/`;
  }

  return "";
}

const instagramLink = document.querySelector("[data-instagram]");
const instagramUrl = createInstagramUrl(contactConfig.instagram);

// O Instagram também fica oculto enquanto não houver usuário ou link válido.
if (instagramLink && instagramUrl) {
  instagramLink.href = instagramUrl;
  instagramLink.target = "_blank";
  instagramLink.rel = "noopener noreferrer";
  instagramLink.hidden = false;
}

// Uma borda discreta aparece no cabeçalho após o início da rolagem.
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 12);
});

// O ano do copyright é atualizado automaticamente pelo navegador.
document.querySelector("#current-year").textContent = new Date().getFullYear();
