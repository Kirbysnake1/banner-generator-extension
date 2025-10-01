// Abrir el generador
document.getElementById("open").addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("generator.html") });
});

// Abrir tu perfil de LinkedIn
document.getElementById("linkedin").addEventListener("click", () => {
  chrome.tabs.create({ url: "https://www.linkedin.com/in/andres-ramirez-4a677023b" });
});

document.getElementById("github").addEventListener("click", () => {
  window.open("https://github.com/Kirbysnake1", "_blank");
});
