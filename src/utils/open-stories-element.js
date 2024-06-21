function css(t) {
    return `\n  :host {\n    display: inline-block;\n    font-family: system-ui, sans-serif;\n    --magic-h: 88vh;\n    --magic-w: 88vw;\n  }\n\n  ::backdrop {\n    background-color: rgba(0, 0, 0, 0.9);\n  }\n\n  #trigger:hover #amount {\n opacity: 1 !important;\n   transform: scale(1)!important; \n  }\n\n dialog button {\n    border: 0;\n    background: 0;\n    appearance: none;\n    cursor: pointer;\n    padding: 0;\n    margin: 0;\n  }\n  \n  #side-controls {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    gap: 0.7vh;\n  }\n\n  #side-controls #close,\n  #play,\n  #pause {\n    display: none;\n  }\n  \n  dialog.is-paused #play {\n    display: block;\n  }\n\n  dialog:not(.is-paused) #pause {\n    display: block;\n  }\n\n  :host(open-stories.is-empty) .ring {\n    opacity: 0.5;\n  }\n\n  :host(open-stories:not(.is-read):not(.is-empty)) .ring {\n    border: 2px solid #08c;\n    margin: 0;\n  }\n\n  .avatar {\n    width: 100%;\n    aspect-ratio: 1;\n    border-radius: 50%;\n  }\n\n  dialog {\n    height: min(var(--magic-h), var(--magic-w) * 16/9);\n    padding: 0;\n    border: 0;\n    aspect-ratio: 2/3;\n    background: transparent;\n    overflow: visible;\n    max-height: var(--magic-h);\n    max-width: var(--magic-w);\n  }\n  \n  #images {\n    overflow: hidden;\n    height: 100%;\n    width: 100%;\n    position: absolute;\n    background: #000;\n    border-radius: 10px;\n  }\n\n  #images img {\n    position: absolute;\n    max-height: 100%;\n    max-width: 100%;\n    width: 100%;\n    aspect-ratio: 2/3;\n    object-fit: cover;\n  height:100%;\n    top: 0;\n    opacity: 0;\n  }\n\n  #images img.shown {\n    opacity: 1;\n  }\n\n  .bar {\n    border-radius: 3px;\n    overflow: hidden;\n    height: 100%;\n    background: rgba(200, 200, 200, .2);\n    z-index: 1;\n    flex: auto;\n    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);\n    transition: all 200ms;\n  }\n\n  #bars:hover .bar {\n    height: 4px;\n    transform: translateY(-1px);\n    background: rgba(200, 200, 200, .5);\n  }\n\n  .bar:hover {\n    transform: translateY(-1px);\n    flex-shrink: 0;\n    transform-origin: center;\n    min-width: 20px;\n    height: 4px;\n  }\n\n  #bars:hover {\n    gap: 2px;\n  }\n\n  #bars {\n    left: 0; \n    right: 0;\n    top: 0;\n    height: 2px;\n    position: absolute;\n    padding: 10px;\n    display: flex;\n    gap: 3px;\n    z-index: 2;\n  }\n\n  #side-controls button,\n  #side-controls a {\n    display: inline-flex;\n  }\n\n  #time {\n    position: absolute;\n    margin: 10px;\n    top: 0; \n    left: 0;\n    z-index: 1;\n  }\n\n  #time, {\n    color: rgba(255, 255, 255, 0.7);\n  }\n\n  #time,\n  #metadata,\n  #more {\n    color: #fff;\n    font-size: 1.7vh;\n    font-weight: 600;\n    text-shadow: 0 0 2px black;;\n  }\n\n  svg {\n    width: auto;\n    height: 3.5vh;\n    filter: drop-shadow(0 0 3px rgba(0, 0, 0, .5));\n    line-height: 0;\n  }\n\n  #bottom-controls {\n    position: absolute;\n    z-index: 1;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    padding: 10px;\n    display: flex;\n    align-items: end;\n    overflow: hidden;\n    pointer-events: none;\n    gap: 1vh;\n  }\n\n  .action {\n    cursor: pointer;\n    transition: transform .3s;\n  }\n\n  .action:not([disabled]):hover,\n  .action:not([disabled]):focus {\n    transform: scale(1.2);\n  }\n\n  #open-heart {\n    left: auto;\n    right: 0;\n    display: inline-flex;\n  }\n\n  #open-heart .off {\n    transition: opacity .3s;\n  }\n\n  #open-heart .on {\n    position: absolute;\n    z-index: 1;\n    opacity: 0;\n    transform: scale(0);\n    transition: transform .3s;\n  }\n\n  #open-heart[aria-pressed="true"] .on { \n    transform: scale(1);\n    opacity: 1;\n  }\n\n  #open-heart[aria-pressed="true"] .off { opacity: 0; }\n\n  #open-heart[aria-pressed="true"] path { fill: #f00; }\n\n  #open-heart[aria-busy="true"] { animation: pulsate .4s infinite; }\n\n  @keyframes pulsate {\n    0% { transform: scale(1) }\n    100% { transform: scale(1.2) }\n  }\n\n  #open-heart[errored] {\n    opacity: .5;\n  }\n\n  #metadata-details {\n    display: flex;\n    flex: 1 1 auto;\n    align-items: end;\n    overflow: hidden;\n    padding: 0.7vh 0;\n    gap: 0.7vh; \n  }\n\n  #metadata,\n  #more {\n    line-height: 1.5em;\n  }\n\n  .is-collapsed #more {\n    display: block;\n  }\n  \n  #more {\n    display: none;\n    cursor: pointer;\n  }\n\n  #more,\n  .action {\n    pointer-events: auto;\n  }\n\n  #metadata {\n    flex: 1 1 auto;\n    white-space: nowrap;\n  }\n  \n  .is-collapsed #metadata {\n    overflow: hidden;\n    text-overflow: ellipsis;\n  }\n\n  .is-expanded #metadata {\n    white-space: normal;\n  }\n\n  #metadata a {\n    color: #000;\n  }\n\n  .progress {\n    height: 100%;\n    animation: none;\n    background-color: #fff;\n  }\n  \n  .progressing ~ .bar .progress {\n    background-color: transparent;\n    width: auto;\n  }\n\n  .is-loading .progressing .progress,\n  .is-paused .progressing .progress {\n    animation-play-state: paused;\n  }\n\n  .progressing .progress {\n    width: 0;\n    animation: progress ${t}s linear;\n    animation-play-state: running;\n  }\n\n  @keyframes progress {\n    0% { width: 0%; }\n    100% { width: 100%; }\n  }\n\n  .is-loading button:not(.bar),\n  .is-loading #controls,\n  .is-loading #open-heart {\n    display: none;\n  }\n\n  .is-loading #images img {\n    opacity: 0;\n  }\n\n  .is-loading .loading-visual {\n    display: block;\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    width: 2vh;\n    aspect-ratio: 1;\n    text-align: center;\n    background: #fff;\n    z-index: 1;\n    margin-left: -1vh;\n    animation: rotate 2s linear infinite;\n    font-size: 14px;\n  }\n\n  @keyframes rotate {\n    0% { transform: rotate(0deg); }\n    100% { transform: rotate(360deg); }\n  }\n\n  .loading-visual {\n    display: none;\n  }\n\n  #goToBlock {\n    left: 50%;\n    transform: translate(-50%, -50%);\n    padding: 0 2vw;\n    aspect-ratio: 9 / 16;\n    height: min(var(--magic-h), var(--magic-w) * 16/9);\n    position: absolute;\n    top: 50%;\n    z-index: 1;\n    pointer-events: none;\n    box-sizing: border-box;\n  }\n\n  #back, #forward {\n    pointer-events: all;\n    position: absolute;\n    z-index: 1;\n    min-width: 40px;\n    height: calc(100% - 100px);\n    bottom: 50px;\n    padding: 0;\n    font-size: 3vh;\n    width: 12vh;\n    font-family: system-ui, sans-serif;\n    color: #fff;\n  }\n\n  #back {\n    left: -1.5em;\n    text-align: left;\n  }\n\n  #forward {\n    right: -1.5em;\n    text-align: right;\n  }\n\n  @media (max-width: 420px), screen and (orientation: portrait) {\n    :host {\n      --magic-h: calc(var(--mobileVh) * 97);\n      --magic-w: 100vw;\n    }\n\n    ::backdrop {\n      background-color: #000;\n    }\n\n    #side-controls #close {\n      display: inline-flex;\n    }\n  }\n\n  [hidden] {\n    display: none !important;\n  }\n`;
}
class OpenStoriesElement extends HTMLElement {
    constructor() {
        super(),
            (this.themeColor = null),
            (this.currentIndex = -1),
            (this.count = 0),
            (this.timer = null),
            (this.currentBar = null),
            (this.currentImage = null),
            (this.images = []),
            (this.bars = []),
            (this.promises = []),
            (this.paused = !1),
            (this.open = !1),
            (this.items = []),
            (this.root = this.attachShadow({ mode: 'open' })),
            (this.root.innerHTML =
                '\n      <button type="dialog" id="trigger" part="button"><slot>View stories</slot><div part="amount" id="amount"></div></button>\n      <dialog class="is-loading" part="dialog">\n        <div class="loading-visual" part="loading-visual"></div>\n        <div id="bars"></div>\n        <span id="time"></span>\n        <div id="goToBlock">\n          <button id="back">←</button>\n          <button id="forward">→</button>\n        </div>\n        <div id="images"></div>\n        <div id="bottom-controls">\n          <div id="metadata-details">\n            <div id="metadata" part="metadata-content"></div>\n            <button type="button" id="more" part="metadata-summary">\n            [more]\n            </button>\n          </div>\n          <div id="side-controls">\n            <button id="close" class="action" type="button" aria-label="Close">\n              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">\n                <rect x="6" y="7.35723" width="1.91942" height="10.1014" rx="0.95971" transform="rotate(-45 6 7.35723)" fill="white"/>\n                <rect x="7.35724" y="14.5" width="1.91942" height="10.1014" rx="0.95971" transform="rotate(-135 7.35724 14.5)" fill="white"/>\n              </svg>\n            </button>\n            <button type="button" class="action" id="open-heart" part="open-heart" part="open-heart" hidden>\n              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="on">\n                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.60419 6.08132C9.77084 5.51626 10.1042 8.08132 10.1042 8.08132L10.1042 13.5813C8.60419 13.5813 7.10419 12.0813 6.50161 11.0813C5.89903 10.0813 5.43754 6.64637 7.60419 6.08132ZM12.6042 6.08131C10.4375 5.51626 10.1042 8.08132 10.1042 8.08132L10.1042 13.5813C11.6042 13.5813 13.1042 12.0813 13.7068 11.0813C14.3093 10.0813 14.7708 6.64637 12.6042 6.08131Z" fill="white"/>\n              </svg>\n              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="off">\n                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.51776 6.65626C9.99827 7.26627 10.1042 8.08132 10.1042 8.08132C10.1042 8.08132 10.2101 7.26627 10.6906 6.65626C11.0625 6.1841 11.6589 5.83478 12.6042 6.08131C14.7708 6.64637 14.3093 10.0813 13.7068 11.0813C13.1042 12.0813 11.6042 13.5813 10.1042 13.5813C8.60419 13.5813 7.10419 12.0813 6.50161 11.0813C5.89903 10.0813 5.43754 6.64637 7.60419 6.08132C8.54951 5.83478 9.14584 6.1841 9.51776 6.65626ZM9.11332 8.21616L9.11237 8.20995C9.111 8.20138 9.10825 8.18497 9.10382 8.16202C9.09487 8.11576 9.07949 8.04512 9.05555 7.95993C9.00587 7.78317 8.92824 7.57595 8.81703 7.39676C8.70614 7.2181 8.58996 7.11151 8.47666 7.0572C8.3811 7.0114 8.20033 6.95929 7.85655 7.04895C7.4012 7.1677 7.08018 7.59115 7.01156 8.494C6.97938 8.91746 7.01661 9.36612 7.09563 9.76183C7.17781 10.1734 7.28974 10.4517 7.35813 10.5652C7.5966 10.9609 8.04101 11.4942 8.58331 11.9193C9.13877 12.3547 9.67326 12.5813 10.1042 12.5813C10.5351 12.5813 11.0696 12.3547 11.6251 11.9193C12.1674 11.4942 12.6118 10.9609 12.8503 10.5652C12.9186 10.4517 13.0306 10.1734 13.1127 9.76183C13.1918 9.36612 13.229 8.91746 13.1968 8.49399C13.1282 7.59115 12.8072 7.1677 12.3518 7.04895C12.008 6.95929 11.8273 7.0114 11.7317 7.0572C11.6184 7.11151 11.5022 7.2181 11.3913 7.39676C11.2801 7.57595 11.2025 7.78317 11.1528 7.95993C11.1289 8.04512 11.1135 8.11576 11.1046 8.16202C11.1001 8.18497 11.0974 8.20138 11.096 8.20995L11.0951 8.21615C11.0277 8.71143 10.6047 9.08132 10.1042 9.08132C9.60373 9.08132 9.18068 8.71144 9.11332 8.21616Z" fill="white"/>\n              </svg>\n            </button>\n            <a href id="link" class="action" aria-label="Story (copy link)">\n              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">\n                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.41489 9.17763C9.80542 8.78711 9.80542 8.15395 9.41489 7.76342V7.76342C9.02437 7.3729 8.3912 7.3729 8.00068 7.76342L6.92857 8.83553C5.757 10.0071 5.757 11.9066 6.92857 13.0782C8.10014 14.2497 9.99964 14.2497 11.1712 13.0782V13.0782C11.3254 12.924 11.3254 12.6739 11.1712 12.5197L10.3154 11.664C10.1612 11.5098 9.9112 11.5098 9.757 11.664V11.664C9.36647 12.0545 8.73331 12.0545 8.34278 11.664C7.95226 11.2734 7.95226 10.6403 8.34278 10.2497L9.41489 9.17763ZM11.5918 9.82911C11.2013 10.2196 11.2013 10.8528 11.5918 11.2433V11.2433C11.9824 11.6338 12.6155 11.6338 13.0061 11.2433L13.9996 10.2497C15.1712 9.07817 15.1712 7.17868 13.9996 6.00711C12.8281 4.83553 10.9286 4.83553 9.757 6.00711V6.00711C9.64616 6.11794 9.64616 6.29763 9.757 6.40847L10.7698 7.42132C10.8807 7.53215 11.0604 7.53215 11.1712 7.42132V7.42132C11.5617 7.03079 12.1949 7.03079 12.5854 7.42132C12.9759 7.81184 12.9759 8.44501 12.5854 8.83553L11.5918 9.82911Z" fill="white"/>\n              </svg>\n            </a>\n            <button id="play-pause" class="action" type="button" aria-label="Play/Pause" aria-pressed="true">\n              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" id="play">\n                <path d="M7 13.0568V6.94319C7 6.12982 7.91937 5.65669 8.58124 6.12946L12.8608 9.18627C13.4191 9.58509 13.4191 10.4149 12.8608 10.8137L8.58124 13.8705C7.91937 14.3433 7 13.8702 7 13.0568Z" fill="white"/>\n              </svg>\n              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" id="pause">\n                <rect x="7" y="6" width="2" height="8" rx="1" fill="white"/>\n                <path d="M11 7C11 6.44772 11.4477 6 12 6V6C12.5523 6 13 6.44772 13 7V13C13 13.5523 12.5523 14 12 14V14C11.4477 14 11 13.5523 11 13V7Z" fill="white"/>\n              </svg>\n            </button>\n          </div>\n        </div>\n      </dialog>\n    '),
            (this.dialog = this.root.querySelector('dialog')),
            (this.button = this.root.querySelector('button#trigger')),
            (this.amount = this.root.querySelector('button #amount')),
            (this.close = this.root.querySelector('button#close')),
            (this.openHeart = this.root.querySelector('button#open-heart')),
            (this.metadataDetails = this.root.querySelector('#metadata-details')),
            (this.meta = this.root.querySelector('#metadata')),
            (this.moreMetadata = this.root.querySelector('#more')),
            (this.link = this.root.querySelector('a#link')),
            (this.time = this.root.querySelector('#time')),
            (this.goToBinding = this.goTo.bind(this, 1)),
            (this._src = this.hasAttribute('src') ? this.formatSrc(this.getAttribute('src')) : ''),
            (this._duration = this.hasAttribute('duration')
                ? Number(this.getAttribute('duration'))
                : 5);
    }
    get isHighlight() {
        return this.hasAttribute('is-highlight');
    }
    setThemeColor(t) {
        t &&
            !this.themeColor &&
            ((this.themeColor = document.createElement('meta')),
            (this.themeColor.name = 'theme-color'),
            (this.themeColor.content = '#000'),
            document.body.append(this.themeColor)),
            !t && this.themeColor && (this.themeColor.remove(), (this.themeColor = null));
    }
    connectedCallback() {
        this.button.addEventListener('click', () => {
            this.dialog.open ? this.dialog.close() : this.dialog.showModal(),
                (this.open = this.dialog.open),
                this.dialog.open &&
                    ((this.dialog.tabIndex = -1),
                    this.dialog.focus(),
                    this.startTimer(),
                    this.setThemeColor(!0));
        }),
            this.close.addEventListener('click', () => {
                this.button.click();
            }),
            this.dialog.addEventListener('click', (t) => {
                this.dialog.open && t.target === this.dialog && this.button.click();
            });
        const t = this.src;
        t && this.fetchData(t);
        const n = document.createElement('style');
        (n.innerText = css(this.duration)),
            this.root.append(n),
            this.style.setProperty('--mobileVh', 0.01 * window.innerHeight + 'px'),
            this.moreMetadata.addEventListener('click', () => {
                this.metadataDetails.classList.add('is-expanded'),
                    this.metadataDetails.classList.remove('is-collapsed');
            });
    }
    set src(t) {
        this.setAttribute('src', t), (this._src = this.formatSrc(t));
    }
    get src() {
        return this._src;
    }
    set duration(t) {
        this._duration = Number(t);
    }
    get duration() {
        return this._duration;
    }
    async sendHeart() {
        const t = this.items[this.currentIndex],
            n = this.items[this.currentIndex]._open_stories.reactions?.open_heart_urls || [];
        if (0 === n.length) return;
        const e = `♥︎@${t.id}`,
            i = [];
        for (const t of n) i.push(fetch(t, { method: 'post', body: '❤️' }));
        this.openHeart.setAttribute('aria-busy', 'true');
        let s = null;
        try {
            s = await Promise.any(i);
        } catch {
        } finally {
            if ((this.openHeart.setAttribute('aria-busy', 'false'), !s)) return;
        }
        const o = (localStorage.getItem('_open_heart') || '').split(',').filter((t) => t);
        o.push(e), localStorage.setItem('_open_heart', o.join(',')), this.prepareHeart();
    }
    bindEvents() {
        const t = this.root.querySelector('#images'),
            n = this.root.querySelector('#play-pause'),
            e = this.root.querySelector('button#back'),
            i = this.root.querySelector('button#forward');
        this.openHeart.addEventListener('click', () => {
            this.sendHeart();
        }),
            this.link.addEventListener('click', async () => {
                await navigator.clipboard.writeText(this.link.href);
            }),
            e.addEventListener('click', () => {
                0 === this.currentIndex ? this.dialog.close() : this.goTo(-1);
            }),
            i.addEventListener('click', () => {
                this.currentIndex === this.count - 1 ? this.dialog.close() : this.goTo(1);
            }),
            this.dialog.addEventListener('close', () => {
                this.paused && this.resume(),
                    this.timer && clearTimeout(this.timer),
                    this.currentIndex >= this.items.length - 1 && (this.currentIndex = -1),
                    this.checkIfAllRead(),
                    this.setThemeColor(!1),
                    this.itemByHash() && (window.location.hash = '');
            }),
            n.addEventListener('click', () => {
                n.setAttribute('aria-pressed', this.paused.toString()),
                    this.paused ? this.resume() : this.pause();
            }),
            t.addEventListener('click', () => {
                n.click();
            });
        const s = this.dialog;
        document.addEventListener(
            'keydown',
            function (t) {
                if (!s.open) return;
                'ArrowRight' === t.key && i.click();
                'ArrowLeft' === t.key && e.click();
            }.bind(this)
        );
    }
    itemByHash() {
        const t = (location.hash || '').slice(1);
        if (0 !== t.length) return this.items.find((n) => n.id === t);
    }
    checkHashId() {
        if (Array.from(document.querySelectorAll('open-stories')).find((t) => t !== this && t.open))
            return !1;
        const t = this.itemByHash();
        if (!t) return !1;
        const n = this.items.indexOf(t);
        return (
            this.currentIndex !== n &&
            ((this.currentIndex = n - 1), this.dialog.open ? this.goTo(1) : this.button.click(), !0)
        );
    }
    checkIfAllRead() {
        if (this.isHighlight) return !1;
        const t = this.items[this.items.length - 1],
            n = this.getViewedId(),
            e = t && t.id === n;
        return this.classList.toggle('is-read', e), e;
    }
    async fetchData(t) {
        this.classList.add('is-loading');
        const n = await (await fetch(t)).json();
        this.classList.remove('is-loading');
        this.amount.textContent = n.items.length;
        const e = new Date();
        (this.items = n.items
            .filter(
                (t) =>
                    t._open_stories.mime_type.startsWith('image') &&
                    (!t._open_stories.date_expired || e <= new Date(t._open_stories.date_expired))
            )
            .reverse()),
            this.classList.toggle('is-empty', 0 === this.items.length),
            0 === this.items.length ? (this.button.disabled = !0) : this.appendImages(),
            window.addEventListener('hashchange', this.checkHashId.bind(this)),
            this.checkHashId() || this.setIndexToUnread();
    }
    formatSrc(t) {
        return new URL(t || '', location.href).toString();
    }
    setIndexToUnread() {
        if (this.isHighlight) return !1;
        const t = this.getViewedId();
        if (!t) return;
        const n = this.items.findIndex((n) => n.id === t);
        n < 0 || this.checkIfAllRead() || (this.currentIndex = n);
    }
    pause() {
        (this.paused = !0),
            this.classList.add('is-paused'),
            this.dialog.classList.add('is-paused'),
            this.timer && clearTimeout(this.timer);
    }
    resume() {
        (this.paused = !1),
            this.classList.remove('is-paused'),
            this.dialog.classList.remove('is-paused'),
            this.currentBar
                ?.querySelector('.progress')
                ?.addEventListener('animationend', this.goToBinding, { once: !0 });
    }
    appendImages() {
        (this.count = this.items.length),
            (this.images = []),
            (this.bars = []),
            (this.promises = []);
        const t = this.root.querySelector('#bars'),
            n = this.root.querySelector('#images');
        for (const e of this.items) {
            const i = document.createElement('button');
            (i.type = 'button'), i.classList.add('bar');
            const s = this.images.length;
            i.addEventListener('click', () => {
                const t = s - this.currentIndex;
                0 !== t && this.goTo(t);
            });
            const o = document.createElement('div');
            o.classList.add('progress'),
                i.setAttribute(
                    'aria-label',
                    `${s + 1} of ${this.items.length} ${
                        1 === this.items.length ? 'stroy' : 'stories'
                    }`
                ),
                i.setAttribute(
                    'title',
                    `${s + 1} of ${this.items.length} ${
                        1 === this.items.length ? 'stroy' : 'stories'
                    }`
                ),
                i.append(o),
                t.append(i),
                this.bars.push(i);
            const a = document.createElement('img');
            this.promises.push(new Promise((t) => a.addEventListener('load', t))),
                1 !== this.promises.length && this.lazyLoad
                    ? a.setAttribute('data-src', e._open_stories.url)
                    : (a.src = e._open_stories.url),
                'alt' in e._open_stories && (a.alt = e._open_stories.alt),
                n.append(a),
                this.images.push(a);
        }
    }
    async startTimer() {
        if (
            (await this.promises[0],
            this.dialog.classList.contains('is-loading') &&
                (this.dialog.classList.remove('is-loading'), this.bindEvents()),
            this.lazyLoad)
        )
            for (const t of this.images)
                !t.src && t.hasAttribute('data-src') && (t.src = t.getAttribute('data-src') || '');
        this.goTo();
    }
    async goTo(t = null) {
        if (
            (t || (t = 1),
            this.currentBar &&
                ((this.currentBar.style.animation = 'none'),
                this.currentBar.offsetHeight,
                this.currentBar.style.removeProperty('animation'),
                this.currentBar.classList.remove('progressing'),
                (this.meta.textContent = '')),
            this.timer && clearTimeout(this.timer),
            this.currentImage && this.currentImage.classList.remove('shown'),
            (this.currentIndex += t),
            this.currentIndex === this.count)
        )
            return void this.dialog.close();
        (this.currentBar = this.bars[this.currentIndex]),
            (this.currentImage = this.images[this.currentIndex]),
            this.currentBar.classList.add('progressing', 'paused'),
            this.currentImage.classList.add('shown'),
            this.dialog.classList.add('is-loading'),
            await this.promises[this.currentIndex],
            this.dialog.classList.remove('is-loading'),
            this.currentBar.classList.remove('paused');
        const n = this.items[this.currentIndex];
        this.isHighlight || this.setViewed(n.id),
            (this.time.textContent = this.relativeTime(n.date_published));
        const e = 'caption' in n._open_stories ? n._open_stories.caption : null;
        this.metadataDetails.classList.remove('is-expanded', 'is-collapsed'),
            (this.meta.textContent = e || ''),
            this.meta.clientWidth > this.metadataDetails.clientWidth &&
                this.metadataDetails.classList.add('is-collapsed'),
            this.prepareHeart(),
            n.url
                ? ((this.link.hidden = !1), (this.link.href = n.url))
                : ((this.link.hidden = !0), this.link.removeAttribute('href')),
            this.currentIndex > this.count - 1 && (this.currentIndex = 0),
            (this.timer = window.setTimeout(this.goTo.bind(this), 1e3 * this.duration)),
            this.paused && this.pause();
    }
    get viewedKey() {
        return this.src;
    }
    get lazyLoad() {
        return 'lazy' === this.getAttribute('loading');
    }
    setViewed(t) {
        const n = this.items.findIndex((t) => t.id === this.getViewedId());
        if (this.items.findIndex((n) => n.id === t) < n) return;
        const e = JSON.parse(localStorage.getItem('_open_stories') || '{}');
        (e[this.viewedKey] = t), localStorage.setItem('_open_stories', JSON.stringify(e));
    }
    getViewedId() {
        return JSON.parse(localStorage.getItem('_open_stories') || '{}')[this.viewedKey];
    }
    prepareHeart() {
        const t = this.items[this.currentIndex],
            n = (t._open_stories.reactions?.open_heart_urls || []).length > 0;
        if (((this.openHeart.hidden = !n), !n)) return;
        const e = (localStorage.getItem('_open_heart') || '').split(',').includes(`♥︎@${t.id}`);
        this.openHeart.setAttribute('aria-pressed', e.toString()), (this.openHeart.disabled = e);
    }
    relativeTime(t) {
        if (!t) return '';
        const n = new Date(t);
        if ('Invalid Date' === n.toString()) return '';
        const e = Math.round((new Date().getTime() - n.getTime()) / 1e3 / 60);
        return e > 1440
            ? `${Math.round(e / 60 / 24)}d`
            : e > 60
              ? `${Math.round(e / 60)}h`
              : `${e}m`;
    }
}
window.customElements.get('open-stories') ||
    ((window.OpenStoriesElement = OpenStoriesElement),
    window.customElements.define('open-stories', OpenStoriesElement));
export default OpenStoriesElement;
