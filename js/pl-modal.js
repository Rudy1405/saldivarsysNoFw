/**
 * Created by cesarmejia on 20/08/2017.
 */
var pl;
(function (pl) {
    var PLEvent = /** @class */ (function () {
        // endregion
        /**
         * Create a PLEvent instance.
         * @constructor
         */
        function PLEvent() {
            this._handlers = [];
            this._scope = this || window;
        }
        // region Methods
        /**
         * Add new handler.
         * @param {function} handler
         */
        PLEvent.prototype.add = function (handler) {
            if (handler) {
                this._handlers.push(handler);
            }
        };
        /**
         * Excecute all suscribed handlers.
         */
        PLEvent.prototype.fire = function () {
            var _this = this;
            var args = arguments;
            this._handlers.forEach(function (handler) {
                handler.apply(_this._scope, args);
            });
        };
        /**
         * Remove handler from handlers.
         * @param {function} handler
         */
        PLEvent.prototype.remove = function (handler) {
            this._handlers = this._handlers.filter(function (fn) {
                if (fn != handler)
                    return fn;
            });
        };
        return PLEvent;
    }());
    pl.PLEvent = PLEvent;
})(pl || (pl = {}));
/**
 * Created by cesarmejia on 07/02/2018.
 */
(function (pl) {
    var Classie = /** @class */ (function () {
        function Classie() {
        }
        /**
         * Adds the specified class to an element.
         * @param {HTMLElement} elem
         * @param {string} className
         */
        Classie.addClass = function (elem, className) {
            if (elem.classList)
                elem.classList.add(className);
            else if (!Classie.hasClass(elem, className))
                elem.className += " " + className;
        };
        /**
         * Determine whether any of the matched elements are assigned the given class.
         * @param {HTMLElement} elem
         * @param {string} className
         * @returns {boolean}
         */
        Classie.hasClass = function (elem, className) {
            return elem.classList
                ? elem.classList.contains(className)
                : new RegExp("\\b" + className + "\\b").test(elem.className);
        };
        /**
         * Remove class from element.
         * @param {HTMLElement} elem
         * @param {string} className
         */
        Classie.removeClass = function (elem, className) {
            if (elem.classList)
                elem.classList.remove(className);
            else
                elem.className = elem.className.replace(new RegExp("\\b" + className + "\\b", "g"), '');
        };
        /**
         * Remove all classes in element.
         * @param {HTMLElement} elem
         */
        Classie.reset = function (elem) {
            elem.className = '';
        };
        /**
         * Add or remove class from element.
         * @param {HTMLElement} elem
         * @param {string} className
         */
        Classie.toggleClass = function (elem, className) {
            if (elem.classList)
                elem.classList.toggle(className);
            else
                Classie.hasClass(elem, className)
                    ? Classie.removeClass(elem, className)
                    : Classie.addClass(elem, className);
        };
        return Classie;
    }());
    pl.Classie = Classie;
})(pl || (pl = {}));
/**
 * Created by Sexar on 07/02/2018.
 */
(function (pl) {
    var Util = /** @class */ (function () {
        function Util() {
        }
        /**
         * Capitalize text.
         * @param {string} text
         * @returns {string}
         */
        Util.capitalizeText = function (text) {
            return text.replace(/\w/, function (l) { return l.toUpperCase(); });
        };
        /**
         * Merge objects and create a new one.
         * @param {Array<Object>} objects
         * @return {Object}
         */
        Util.extendsDefaults = function () {
            var objects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                objects[_i] = arguments[_i];
            }
            var result = {}, i;
            for (i = 0; i < objects.length; i++) {
                (function (currentObj) {
                    var prop;
                    for (prop in currentObj) {
                        if (currentObj.hasOwnProperty(prop)) {
                            result[prop] = currentObj[prop];
                        }
                    }
                })(objects[i]);
            }
            return result;
        };
        return Util;
    }());
    pl.Util = Util;
})(pl || (pl = {}));
/**
 * Created by cesarmejia on 20/08/2017.
 */
(function (pl) {
    var Modal = /** @class */ (function () {
        // endregion
        /**
         * Create an instance of Modal.
         * @constructor
         * @param {object} settings
         */
        function Modal(settings) {
            // endregion
            // region Fields
            /**
             * Flag that indicate if the modal is open or not.
             * @type {boolean}
             */
            this._isOpen = false;
            // Define default options.
            var defaults = {
                avoidClose: true,
                closeWithOverlay: true,
                effectName: ''
            };
            // Create settings by extending defaults with passed
            // settings in constructor.
            this._settings = pl.Util.extendsDefaults(defaults, settings || {});
            // Select transitionend that browser support.
            this._transitionend = Modal.transitionSelect();
            this.buildOut();
            this.initializeEvents();
        }
        // region Static
        /**
         * Get transitionend event depending of the browser.
         * @return {string}
         */
        Modal.transitionSelect = function () {
            var el = document.createElement('div');
            var transEndEventNames = {
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'otransitionend',
                transition: 'transitionend'
            };
            for (var name_1 in transEndEventNames) {
                if (el.style[name_1] !== undefined)
                    return transEndEventNames[name_1];
            }
        };
        ;
        // region Private Methods
        /**
         * Create modal elements.
         */
        Modal.prototype.buildOut = function () {
            // Create modal content.
            this.modal.appendChild(this.content);
            // Create close button element.
            if (!this._settings['avoidClose']) {
                this.content.appendChild(this.closeButton);
            }
        };
        /**
         * Attach handlers to modal elements.
         */
        Modal.prototype.initializeEvents = function () {
            var _this = this;
            if (!this._settings['avoidClose']) {
                var ESC_KEY_1 = 27;
                // Close modal if user press esc key.
                document.addEventListener('keydown', function (ev) {
                    if (ev.keyCode == ESC_KEY_1)
                        _this.close();
                }, false);
                // Close modal if user clicks the close button.
                this.closeButton.addEventListener('click', function (ev) {
                    _this.close();
                }, false);
                // Closep modal if user clicks the overlay.
                if (this._settings['closeWithOverlay']) {
                    this.overlay.addEventListener('click', function (ev) {
                        _this.close();
                    }, false);
                }
            }
            // Bind "this" context to toggleTransition handler.
            this.toggleTransitionend = this.toggleTransitionend.bind(this);
            // Attach handler to transitionend event, when the event occurs for the first time
            // remove the event because transitionend handler will execute the same times as
            // styles modified.
            this.content.addEventListener(this._transitionend, this.toggleTransitionend, false);
        };
        /**
         * Remove elements from DOM.
         */
        Modal.prototype.removeFromDom = function () {
            this.overlay.parentNode.removeChild(this.overlay);
            this.modal.parentNode.removeChild(this.modal);
        };
        /**
         * Control the flow of transitionend handler and modal.
         * @param {TransitionEvent} ev
         */
        Modal.prototype.toggleTransitionend = function (ev) {
            var _this = this;
            var functionToCall = this._isOpen ? this.onClosed : this.onOpened;
            // Remove transitionend handler to avoid multiple calls depending on css properties modfied.
            this.content.removeEventListener(this._transitionend, this.toggleTransitionend);
            this._isOpen = !this._isOpen;
            functionToCall.call(this);
            setTimeout(function () {
                _this.content.addEventListener(_this._transitionend, _this.toggleTransitionend, false);
            }, 50);
        };
        // endregion
        // region Methods
        /**
         * Close modal and remove from DOM.
         */
        Modal.prototype.close = function () {
            if (!this._isOpen)
                return;
            var body = document.body;
            // Fire closing event.
            this.onClosing();
            // Let scroll in body
            pl.Classie.removeClass(body, 'no-scroll');
            pl.Classie.removeClass(this.overlay, 'pl-modal-open');
            pl.Classie.removeClass(this.modal, 'pl-modal-open');
        };
        /**
         * Change effect from modal.
         * @param {string} effectName
         */
        Modal.prototype.changeEffect = function (effectName) {
            this._settings['effectName'] = effectName;
            pl.Classie.reset(this.modal);
            pl.Classie.addClass(this.modal, 'pl-modal');
            pl.Classie.addClass(this.modal, this._settings['effectName']);
        };
        /**
         * Add modal to DOM and show it.
         * @param {HTMLElement|string} element
         */
        Modal.prototype.open = function (element) {
            if (this._isOpen)
                return;
            var body = document.body;
            this.setContent(element);
            body.appendChild(this.overlay);
            body.appendChild(this.modal);
            // Avoid scroll in void since modal is open.
            pl.Classie.addClass(body, 'no-scroll');
            // Fire opening event.
            this.onOpening();
            // Force the browser to recognize the elements that we just added.
            window.getComputedStyle(this.overlay).backgroundColor;
            window.getComputedStyle(this.modal).opacity;
            window.getComputedStyle(this.content).opacity;
            pl.Classie.addClass(this.overlay, 'pl-modal-open');
            pl.Classie.addClass(this.modal, 'pl-modal-open');
        };
        /**
         * Set modal content.
         * @param {HTMLElement|string} element
         */
        Modal.prototype.setContent = function (element) {
            if (element === void 0) { element = ""; }
            // Empty content element.
            this.content.innerHTML = '';
            if (!this._settings['avoidClose']) {
                this.content.appendChild(this.closeButton);
            }
            if ("string" === typeof element) {
                this.content.appendChild(document.createTextNode(element));
            }
            else {
                this.content.appendChild(element);
            }
        };
        // endregion
        // region Events
        /**
         * Fires when modal is closed.
         */
        Modal.prototype.onClosing = function () {
            if (this._closing) {
                this._closing.fire();
            }
        };
        /**
         * Fires when modal is opened.
         */
        Modal.prototype.onOpening = function () {
            if (this._opening) {
                this._opening.fire();
            }
        };
        /**
         * Fires when modal is closed.
         */
        Modal.prototype.onClosed = function () {
            if (this._closed) {
                this._closed.fire();
            }
            this.removeFromDom();
        };
        /**
         * Fires when modal is opened.
         */
        Modal.prototype.onOpened = function () {
            if (this._opened) {
                this._opened.fire();
            }
        };
        Object.defineProperty(Modal.prototype, "closing", {
            /**
             * Get modal closing event.
             * @returns {pl.PLEvent}
             */
            get: function () {
                if (!this._closing) {
                    this._closing = new pl.PLEvent();
                }
                return this._closing;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Modal.prototype, "opening", {
            /**
             * Get modal opening event.
             * @returns {pl.PLEvent}
             */
            get: function () {
                if (!this._opening) {
                    this._opening = new pl.PLEvent();
                }
                return this._opening;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Modal.prototype, "closed", {
            /**
             * Get modal closed event.
             * @return {pl.PLEvent}
             */
            get: function () {
                if (!this._closed) {
                    this._closed = new pl.PLEvent();
                }
                return this._closed;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Modal.prototype, "opened", {
            /**
             * Get modal opened event.
             * @return {pl.PLEvent}
             */
            get: function () {
                if (!this._opened) {
                    this._opened = new pl.PLEvent();
                }
                return this._opened;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Modal.prototype, "overlay", {
            /**
             * Get overlay element.
             * @returns {HTMLElement}
             */
            get: function () {
                if (!this._overlay) {
                    this._overlay = document.createElement('div');
                    pl.Classie.addClass(this._overlay, 'pl-modal-overlay');
                }
                return this._overlay;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Modal.prototype, "modal", {
            /**
             * Get modal element.
             * @returns {HTMLElement}
             */
            get: function () {
                if (!this._modal) {
                    this._modal = document.createElement('div');
                    pl.Classie.addClass(this._modal, 'pl-modal');
                    pl.Classie.addClass(this._modal, this._settings['effectName']);
                }
                return this._modal;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Modal.prototype, "content", {
            /**
             * Get content element.
             * @returns {HTMLElement}
             */
            get: function () {
                if (!this._content) {
                    this._content = document.createElement('div');
                    pl.Classie.addClass(this._content, 'pl-modal-content');
                }
                return this._content;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Modal.prototype, "closeButton", {
            /**
             * Get close button element.
             * @returns {HTMLElement}
             */
            get: function () {
                if (!this._closeButton) {
                    this._closeButton = document.createElement('div');
                    pl.Classie.addClass(this._closeButton, 'pl-modal-close-button');

                }
                return this._closeButton;
            },
            enumerable: true,
            configurable: true
        });
        return Modal;
    }());
    pl.Modal = Modal;
})(pl || (pl = {}));