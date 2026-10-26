/**
 * @file <psds-disclosure> web component (Lit).
 *
 * Progressive enhancement over server-rendered markup: Twig (or React) renders
 * the trigger button and panel as light-DOM children, and this element adds
 * the open/close behavior. It renders into the light DOM instead of a shadow
 * root so the shared psds-* CSS applies, and so the content stays visible and
 * themeable before (or without) JavaScript.
 *
 * Expected markup:
 *   <psds-disclosure>
 *     <button class="psds-disclosure__trigger" type="button">Summary</button>
 *     <div class="psds-disclosure__panel">Content</div>
 *   </psds-disclosure>
 *
 * Emits `psds-toggle` with `event.detail.open` when the state changes.
 */

import { LitElement } from 'lit';

export class PsdsDisclosure extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    this.open = false;
    this.handleClick = this.handleClick.bind(this);
  }

  createRenderRoot() {
    return this;
  }

  get trigger() {
    return this.querySelector(':scope > .psds-disclosure__trigger');
  }

  get panel() {
    return this.querySelector(':scope > .psds-disclosure__panel');
  }

  // Listen on the host and match the trigger at click time, so frameworks
  // that append children after the element connects still work.
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.handleClick);
    this.requestUpdate();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this.handleClick);
  }

  handleClick(event) {
    const { trigger } = this;
    if (!trigger || !trigger.contains(event.target)) return;

    this.open = !this.open;
    this.dispatchEvent(
      new CustomEvent('psds-toggle', {
        bubbles: true,
        composed: true,
        detail: { open: this.open },
      }),
    );
  }

  updated() {
    const { trigger, panel } = this;
    if (!trigger || !panel) return;

    if (!panel.id) {
      panel.id = `psds-disclosure-${crypto.randomUUID()}`;
    }
    trigger.setAttribute('aria-controls', panel.id);
    trigger.setAttribute('aria-expanded', String(this.open));
    panel.hidden = !this.open;
  }
}

if (!customElements.get('psds-disclosure')) {
  customElements.define('psds-disclosure', PsdsDisclosure);
}
