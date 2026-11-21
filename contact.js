/* ============================================================
   contact.js
   - per-field inline error messages (not alert())
   - prevents submit when invalid
   - accessible errors (role="alert", aria-describedby)
   - success message when valid
   - HTML validation attrs kept as fallback
   ============================================================ */
(function () {
  "use strict";

  const form = document.getElementById("contact-form");
  if (!form) return;

  const fields = {
    name:    { input: form.querySelector("#name"),    err: form.querySelector("#name-error") },
    email:   { input: form.querySelector("#email"),   err: form.querySelector("#email-error") },
    subject: { input: form.querySelector("#subject"), err: form.querySelector("#subject-error") },
    message: { input: form.querySelector("#message"), err: form.querySelector("#message-error") },
    consent: { input: form.querySelector("#consent"), err: form.querySelector("#consent-error") },
    source:  { input: form.querySelector('input[name="source"]'), err: form.querySelector("#source-error") },
  };

  const status = document.getElementById("form-status");

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(name, msg) {
    const f = fields[name];
    if (!f) return;
    f.err.textContent = msg;
    f.err.hidden = !msg;
    if (msg) f.input.setAttribute("aria-invalid", "true");
    else     f.input.removeAttribute("aria-invalid");
  }

  /* ---------- Validators ---------- */
  function validateName() {
    const v = fields.name.input.value.trim();
    if (v.length < 3) { setError("name", "Please enter at least 3 characters."); return false; }
    setError("name", ""); return true;
  }
  function validateEmail() {
    const v = fields.email.input.value.trim();
    if (!EMAIL_RE.test(v)) { setError("email", "Please enter a valid email address."); return false; }
    setError("email", ""); return true;
  }
  function validateSubject() {
    const v = fields.subject.input.value;
    if (!v) { setError("subject", "Please choose a subject."); return false; }
    setError("subject", ""); return true;
  }
  function validateMessage() {
    const v = fields.message.input.value.trim();
    if (v.length < 20) { setError("message", "Please write at least 20 characters."); return false; }
    setError("message", ""); return true;
  }
  function validateSource() {
    const checked = form.querySelector('input[name="source"]:checked');
    if (!checked) { setError("source", "Please pick one option."); return false; }
    setError("source", ""); return true;
  }
  function validateConsent() {
    if (!fields.consent.input.checked) { setError("consent", "Please tick the consent box."); return false; }
    setError("consent", ""); return true;
  }

  /* ---------- Live validation ---------- */
  fields.name.input.addEventListener("blur", validateName);
  fields.email.input.addEventListener("blur", validateEmail);
  fields.message.input.addEventListener("blur", validateMessage);
  fields.subject.input.addEventListener("change", validateSubject);
  fields.consent.input.addEventListener("change", validateConsent);
  form.querySelectorAll('input[name="source"]').forEach((r) =>
    r.addEventListener("change", validateSource)
  );

  /* ---------- Submit ---------- */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const valid =
      validateName() &
      validateEmail() &
      validateSubject() &
      validateMessage() &
      validateSource() &
      validateConsent();

    if (!valid) {
      status.textContent = "Please fix the errors above and try again.";
      status.className = "form-status error";
      /* Focus the first invalid field for keyboard users */
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    status.textContent = "Thanks! Your message has been sent.";
    status.className = "form-status success";
    form.reset();
    Object.keys(fields).forEach((k) => setError(k, ""));
  });
})();