import SERVICES from './services';
import './index.css';
import { debounce } from 'debounce';

export default class EditorjsEmbedigo {
    constructor({ data, api, readOnly }) {
        this.api = api;
        this._data = {};
        this.element = null;
        this.readOnly = readOnly;
    
        this.data = data;
    }

    set data(data) {
        if (!(data instanceof Object)) {
            throw Error('Embed Tool data should be object');
        }
        
        const { key, provider, url, html, caption = '' } = data;
    
        this._data = {
            key: key || this.data.key,
            provider: provider || this.data.provider,
            url: url || this.data.url,
            html: html || this.data.html,
            caption: caption || this.data.caption || '',
        };
        
        const oldView = this.element;
    
        if (oldView) {
            oldView.parentNode.replaceChild(this.render(), oldView);
            window.Embedigo.embed();
        }
    }
    
    get data() {
        if (this.element) {
            const caption = this.element.querySelector(`.${this.api.styles.input}`);
    
            this._data.caption = caption ? caption.innerHTML : '';
        }
    
        return this._data;
    }

    get CSS() {
        return {
            baseClass: this.api.styles.block,
            input: this.api.styles.input,
            container: 'embedigo-tool',
            containerLoading: 'embedigo-tool--loading',
            preloader: 'embedigo-tool__preloader',
            caption: 'embedigo-tool__caption',
            url: 'embedigo-tool__url',
            content: 'embedigo-tool__content',
        };
    }

    render() {
        if (!this.data.key) {
            const container = document.createElement('div');
        
            this.element = container;
        
            return container;
        }
    
        const container = document.createElement('div');
        const caption = document.createElement('div');
        const template = document.createElement('template');
        const preloader = this.createPreloader();
    
        container.classList.add(this.CSS.baseClass, this.CSS.container, this.CSS.containerLoading);
        caption.classList.add(this.CSS.input, this.CSS.caption);
    
        container.appendChild(preloader);
    
        caption.contentEditable = !this.readOnly;
        caption.dataset.placeholder = 'Enter a caption';
        caption.innerHTML = this.data.caption || '';
    
        template.innerHTML = this.data.html;
        template.content.firstChild.classList.add(this.CSS.content);
    
        const embedIsReady = this.embedIsReady(container);
    
        container.appendChild(template.content.firstChild);
        container.appendChild(caption);
    
        embedIsReady
            .then(() => {
                container.classList.remove(this.CSS.containerLoading);
            });
    
        this.element = container;
    
        return container;
    }

    createPreloader() {
        const preloader = document.createElement('preloader');
        const url = document.createElement('div');
    
        url.textContent = this.data.url;
    
        preloader.classList.add(this.CSS.preloader);
        url.classList.add(this.CSS.url);
    
        preloader.appendChild(url);
    
        return preloader;
    }

    save() {
        return this.data;
    }

    onPaste(event) {
        const payload = {
            url: event.detail.data,
            omit_script: true,
        };
    
        fetch('https://api.embedigo.xyz/embed', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                this.data = {
                    key: data.key,
                    provider: data.provider,
                    url: data.url,
                    html: data.html,
                };
            });
    }

    static prepare({ config = {} }) {
        const { services = {} } = config;
    
        let entries = Object.entries(SERVICES);
    
        const enabledServices = Object
            .entries(services)
            .filter(([key, value]) => {
                return typeof value === 'boolean' && value === true;
            })
            .map(([ key ]) => key);
    
        const userServices = Object
            .entries(services)
            .filter(([key, value]) => {
                return typeof value === 'object';
            })
            .filter(([key, service]) => EditorjsEmbedigo.checkServiceConfig(service))
            .map(([key, service]) => {
                return [key, {
                    regex: service.regex
                } ];
            });
    
        if (enabledServices.length) {
            entries = entries.filter(([ key ]) => enabledServices.includes(key));
        }
    
        entries = entries.concat(userServices);
    
        EditorjsEmbedigo.services = entries.reduce((result, [key, service]) => {
            if (!(key in result)) {
                result[key] = service;
        
                return result;
            }
        
            result[key] = Object.assign({}, result[key], service);
        
            return result;
        }, {});
    
        EditorjsEmbedigo.patterns = entries
            .reduce((result, [key, item]) => {
                result[key] = item.regex;
        
                return result;
            }, {});
    }

    static checkServiceConfig(config) {
        return config.regex && config.regex instanceof RegExp;
    }

    static get pasteConfig() {
        return {
            patterns: EditorjsEmbedigo.patterns,
        };
    }

    static get isReadOnlySupported() {
        return true;
    }

    embedIsReady(targetNode) {
        const PRELOADER_DELAY = 450;
    
        let observer = null;
    
        return new Promise((resolve, reject) => {
            observer = new MutationObserver(debounce(resolve, PRELOADER_DELAY));
            observer.observe(targetNode, {
                childList: true,
                subtree: true,
            });
        }).then(() => {
            observer.disconnect();
        });
    }
}