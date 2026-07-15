/**
 * Ponte tra il sito e Google Translate. Il sito resta in italiano finché
 * l'utente non sceglie un'altra lingua dalla tendina con le bandiere.
 *
 * Il vecchio metodo (pilotare via JavaScript la tendina nascosta creata da
 * Google) si è rivelato inaffidabile: molti browser non registravano il
 * cambiamento. Usiamo quindi il meccanismo ufficiale e documentato del
 * widget "Google Website Translator": un cookie chiamato "googtrans" nel
 * formato "/lingua_originale/lingua_scelta". Quando la pagina si ricarica,
 * lo script di Google legge da solo questo cookie e traduce automaticamente
 * tutto il contenuto — senza bisogno di simulare click o eventi.
 */

const SOURCE_LANG = "it";

// Inizializza il widget nascosto di Google Translate.
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: SOURCE_LANG,
      autoDisplay: false
    },
    "google_translate_element"
  );
}

// Scrive il cookie "googtrans" su tutte le varianti di dominio possibili,
// per essere sicuri che Google lo trovi indipendentemente da www./sottodomini.
function writeGoogTransCookie(value, expires) {
  const host = window.location.hostname;
  const domains = new Set([host, "." + host]);
  const parts = host.split(".");
  if (parts.length > 2) {
    const base = parts.slice(-2).join(".");
    domains.add(base);
    domains.add("." + base);
  }
  document.cookie = `googtrans=${value};path=/;${expires || ""}`;
  domains.forEach((domain) => {
    document.cookie = `googtrans=${value};path=/;domain=${domain};${expires || ""}`;
  });
}

// Applica la lingua scelta e ricarica la pagina: al ricaricamento Google
// Translate trova il cookie e traduce automaticamente tutto il contenuto.
function applyTranslation(langCode) {
  writeGoogTransCookie(`/${SOURCE_LANG}/${langCode}`);
  window.location.reload();
}

// Riporta il sito alla lingua originale (italiano).
function resetTranslation() {
  const expired = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
  writeGoogTransCookie("", expired);
  window.location.reload();
}
