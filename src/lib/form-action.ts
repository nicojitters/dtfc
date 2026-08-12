/**
 * Form-gateway action-URL helper. Every form component reads this at render
 * time and either produces a real Formspree action URL or a fallback state.
 *
 * When the corresponding PUBLIC_FORMSPREE_* env var is set to a non-empty,
 * non-`xxxxxxxx` (placeholder) value, returns the real action URL and
 * fallbackMode: false. Otherwise returns action: '#' and fallbackMode: true.
 *
 * Fallback UI: components render a "Form not yet configured" note + a
 * mailto: link and (optionally) disable the submit button. This lets the
 * site ship + merge before the client provides real Formspree IDs; forms
 * activate the moment `.env` is populated and the site rebuilds.
 */
export type FormKey = 'newsletter' | 'askShakespeare' | 'testimonial';

const PLACEHOLDER = 'xxxxxxxx';

export function formActionFor(key: FormKey): { action: string; fallbackMode: boolean } {
  const envVar: Record<FormKey, string | undefined> = {
    newsletter: import.meta.env.PUBLIC_FORMSPREE_NEWSLETTER_ID,
    askShakespeare: import.meta.env.PUBLIC_FORMSPREE_ASK_SHAKESPEARE_ID,
    testimonial: import.meta.env.PUBLIC_FORMSPREE_TESTIMONIAL_ID,
  };
  const id = envVar[key];
  if (id && id !== PLACEHOLDER && id.length > 0) {
    return { action: `https://formspree.io/f/${id}`, fallbackMode: false };
  }
  return { action: '#', fallbackMode: true };
}
