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

// Applica la lingua scelta pilotando la select nascosta creata da Google.
function applyTranslation(langCode) {
  const trySetLanguage = () => {
    const combo = document.querySelector(".goog-te-combo");
    if (!combo) return false;
    combo.value = langCode;
    combo.dispatchEvent(new Event("change"));
    return true;
  };

  if (trySetLanguage()) return;

  // Il widget di Google può impiegare qualche istante a comparire nel DOM:
  // ritentiamo per un massimo di 5 secondi.
  let attempts = 0;
  const interval = setInterval(() => {
    attempts += 1;
    if (trySetLanguage() || attempts > 25) {
      clearInterval(interval);
    }
  }, 200);
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
