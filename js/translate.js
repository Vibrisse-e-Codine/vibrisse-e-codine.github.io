/**
 * Ponte tra il sito e Google Translate.
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

function neutralizeGoogleBannerOffset() {
  if (!document.body) return;
  const fixBodyTop = () => {
    if (document.body.style.top && document.body.style.top !== "0px") {
      document.body.style.top = "0px";
    }
  };
  fixBodyTop();
  new MutationObserver(fixBodyTop).observe(document.body, {
    attributes: true,
    attributeFilter: ["style"]
  });
}
neutralizeGoogleBannerOffset();
