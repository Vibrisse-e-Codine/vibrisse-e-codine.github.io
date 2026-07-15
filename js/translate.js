/**
 * Ponte tra il widget nascosto di Google Translate e il selettore di lingua
 * personalizzato (bandiere + nomi nativi). Il sito resta in italiano finché
 * l'utente non sceglie un'altra lingua: a quel punto il testo della pagina
 * viene tradotto automaticamente in tempo reale, senza ricaricare la pagina.
 */

// Richiesto dallo script ufficiale Google Translate: inizializza il widget
// nascosto includendo tutte le lingue disponibili nel servizio.
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: "it",
      autoDisplay: false,
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    },
    "google_translate_element"
  );
}

// Fa scattare un evento in modo compatibile con tutti i browser: il widget
// nascosto di Google Translate ascolta l'evento "change" sulla sua tendina,
// ma non sempre reagisce a un semplice `new Event('change')` — questo
// metodo è quello storicamente più affidabile.
function fireChangeEvent(element) {
  if (typeof Event === "function") {
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }
  if (document.createEvent) {
    const evt = document.createEvent("HTMLEvents");
    evt.initEvent("change", true, true);
    element.dispatchEvent(evt);
  }
}

// Applica la lingua scelta pilotando la select nascosta creata da Google.
function applyTranslation(langCode) {
  const trySetLanguage = () => {
    const combo = document.querySelector("select.goog-te-combo");
    if (!combo) return false;
    combo.value = langCode;
    // alcuni browser richiedono l'evento due volte per registrare il cambio
    fireChangeEvent(combo);
    fireChangeEvent(combo);
    return true;
  };

  if (trySetLanguage()) return;

  // Il widget di Google può impiegare qualche istante a comparire nel DOM
  // (dipende dal caricamento dello script esterno): ritentiamo fino a 10s.
  let attempts = 0;
  const interval = setInterval(() => {
    attempts += 1;
    if (trySetLanguage() || attempts > 40) {
      clearInterval(interval);
    }
  }, 250);
}

// Riporta il sito alla lingua originale (italiano).
function resetTranslation() {
  // Il cookie "googtrans" pilota lo stato del widget: rimuoverlo e
  // ricaricare riporta la pagina alla lingua originale.
  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie =
    "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" +
    window.location.hostname;
  window.location.reload();
}
