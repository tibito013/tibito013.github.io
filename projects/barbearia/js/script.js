// ================================================================
// CONFIGURAÇÕES DA BARBEARIA
// ================================================================
// Este é um projeto conceitual. Troque os dados abaixo pelos dados reais.
// WhatsApp: use somente números no formato 55 + DDD + número.
// Instagram: use "@usuario" ou o link completo do perfil.
const businessConfig = {
  whatsapp: "",
  instagram: "",
  address: "Localização demonstrativa — endereço definido no projeto real",
  hours: [
    "Segunda a sexta · 9h às 20h",
    "Sábado · 9h às 18h",
  ],
};

// Mensagem preenchida automaticamente ao abrir o WhatsApp.
const appointmentMessage = "Olá! Vi o site da barbearia e gostaria de agendar um horário.";

// Cada chave corresponde ao atributo data-service de um botão de serviço.
// Assim, todos os botões usam a mesma lógica e somente a mensagem muda.
const serviceMessages = {
  corte: "Olá! Vi o site da Nobre Barbearia e gostaria de agendar um Corte.",
  barba: "Olá! Vi o site da Nobre Barbearia e gostaria de agendar a Barba.",
  "corte-barba": "Olá! Vi o site da Nobre Barbearia e gostaria de agendar Corte + Barba.",
  acabamento: "Olá! Vi o site da Nobre Barbearia e gostaria de agendar um Acabamento.",
};

// Seleciona os elementos usados nas interações da página.
const menuButton = document.querySelector(".menu-button");
const mainMenu = document.querySelector(".main-nav");
const menuLinks = document.querySelectorAll(".main-nav a");

// Abre ou fecha o menu em telas menores.
menuButton.addEventListener("click", () => {
  const isOpen = mainMenu.classList.toggle("open");

  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  document.body.classList.toggle("menu-open", isOpen);
});

// Função reutilizável para fechar o menu.
function closeMenu() {
  mainMenu.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu");
  document.body.classList.remove("menu-open");
}

// Fecha o menu depois que o visitante escolhe uma seção.
menuLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// A tecla Escape também fecha o menu, melhorando a navegação por teclado.
document.addEventListener("keydown", (event) => {
  const isMenuOpen = mainMenu.classList.contains("open");

  if (event.key === "Escape" && isMenuOpen) {
    closeMenu();
    menuButton.focus();
  }
});

// Remove espaços, parênteses e outros símbolos do número.
function normalizeWhatsappNumber(number) {
  return number.replace(/\D/g, "");
}

// Valida um número brasileiro com código do país, DDD e telefone.
function isValidWhatsappNumber(number) {
  return /^55\d{10,11}$/.test(number);
}

const whatsappNumber = normalizeWhatsappNumber(businessConfig.whatsapp);
const hasWhatsapp = isValidWhatsappNumber(whatsappNumber);

// Configura todos os botões de agendamento usando o mesmo contato.
document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  if (!hasWhatsapp) {
    link.hidden = true;
    return;
  }

  // Se o link tiver data-service, busca a mensagem específica desse serviço.
  // Links sem data-service continuam usando a mensagem geral de agendamento.
  const message = serviceMessages[link.dataset.service] || appointmentMessage;

  link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.hidden = false;
});

// Converte um usuário do Instagram em link completo.
function createInstagramUrl(value) {
  const instagramValue = value.trim();

  if (!instagramValue) return "";
  if (/^https?:\/\/(www\.)?instagram\.com\//i.test(instagramValue)) return instagramValue;

  const username = instagramValue.replace(/^@/, "");
  return /^[a-zA-Z0-9._]+$/.test(username)
    ? `https://www.instagram.com/${username}/`
    : "";
}

const instagramLink = document.querySelector("[data-instagram]");
const instagramUrl = createInstagramUrl(businessConfig.instagram);

if (instagramLink && instagramUrl) {
  instagramLink.href = instagramUrl;
  instagramLink.target = "_blank";
  instagramLink.rel = "noopener noreferrer";
  instagramLink.hidden = false;
}

// Repete endereço e horários nos pontos corretos sem duplicar dados no HTML.
document.querySelectorAll("[data-address]").forEach((element) => {
  element.textContent = businessConfig.address;
});

document.querySelectorAll("[data-hours]").forEach((element) => {
  element.textContent = businessConfig.hours.join("\n");
});

// Atualiza o ano do rodapé automaticamente.
document.querySelector("#current-year").textContent = new Date().getFullYear();
