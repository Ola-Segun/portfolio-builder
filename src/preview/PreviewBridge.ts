import type { BridgeMessage } from '../types/bridge';
import type { PortfolioStore } from '../types/portfolio';

class PreviewBridge {
  private iframe: HTMLIFrameElement | null = null;
  private messageQueue: BridgeMessage[] = [];
  private ready = false;

  /** Scroll Y captured before a doc.write() rewrite — restored after PREVIEW_READY */
  private pendingScrollY = 0;
  /**
   * When set, smooth-scroll to this section after next rewrite (e.g. new section added).
   * Takes priority over pendingScrollY.
   */
  private pendingScrollToSectionId: string | null = null;

  reset(): void {
    window.removeEventListener('message', this.handleMessage);
    this.ready = false;
    this.messageQueue = [];
    this.iframe = null;
    // NOTE: pendingScrollY and pendingScrollToSectionId are NOT reset here —
    // they are set just before reset() and consumed after the next PREVIEW_READY.
  }

  /**
   * Capture current iframe scroll Y.
   * Call immediately before reset().
   * Does NOT touch pendingScrollToSectionId so add-section intent is preserved.
   */
  saveScrollPosition(iframe: HTMLIFrameElement | null): void {
    if (!this.pendingScrollToSectionId) {
      // Only save position if we're not already targeting a specific new section
      this.pendingScrollY = iframe?.contentWindow?.scrollY ?? 0;
    }
  }

  /**
   * After the next rewrite, navigate to this section instead of restoring position.
   * Call before set({ sections }) so it's in place before the fingerprint fires.
   */
  setPendingScrollToSection(sectionId: string): void {
    this.pendingScrollToSectionId = sectionId;
    this.pendingScrollY = 0;
  }

  register(iframe: HTMLIFrameElement): void {
    this.iframe = iframe;
    window.addEventListener('message', this.handleMessage);
  }

  private handleMessage = (e: MessageEvent<BridgeMessage>): void => {
    if (e.data?.type !== 'PREVIEW_READY') return;

    this.ready = true;

    // Flush queued messages first
    const queued = this.messageQueue.slice();
    this.messageQueue = [];
    queued.forEach(msg => this.sendInternal(msg));

    // Post-rewrite scroll intent (priority: section nav > position restore)
    if (this.pendingScrollToSectionId) {
      this.sendInternal({ type: 'SCROLL_TO_SECTION', sectionId: this.pendingScrollToSectionId });
      this.pendingScrollToSectionId = null;
    } else if (this.pendingScrollY > 0) {
      this.sendInternal({ type: 'SCROLL_RESTORE', scrollY: this.pendingScrollY });
      this.pendingScrollY = 0;
    }
  };

  send(message: BridgeMessage): void {
    if (!this.ready || !this.iframe?.contentWindow) {
      this.messageQueue.push(message);
      if (this.messageQueue.length > 30) this.messageQueue.shift();
      return;
    }
    this.sendInternal(message);
  }

  private sendInternal(message: BridgeMessage): void {
    this.iframe!.contentWindow!.postMessage(message, '*');
  }

  sendFullState(state: PortfolioStore): void {
    this.send({ type: 'FULL_REFRESH', state });
  }

  scrollToSection(sectionId: string): void {
    this.send({ type: 'SCROLL_TO_SECTION', sectionId });
  }

  unregister(): void {
    this.reset();
  }
}

export const bridge = new PreviewBridge();
