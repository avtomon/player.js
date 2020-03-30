"use strict";
import { Utils } from "../../../good-funcs.js/dist/js/GoodFuncs.js";
export var QooizPlayer;
(function (QooizPlayer) {
    /**
     * Просмотрщик на чистом JavaScript. На данный момент может отображать видео, графику и книги в формате PDF.
     */
    class Player {
        /**
         * Конструктор
         *
         * @param {HTMLElement} element - на каком элементе загружается плеер
         * @param {IPlayerOptions} cnf - объект конфигурации
         */
        constructor(element, cnf = {}) {
            this.animationDuration = 400;
            /**
             * Уникальный идентификатор плеера
             */
            this.uniq = Utils.GoodFuncs.getRandomString(12);
            this.prevScroll = 0;
            this.diffWidth = 0;
            this.imagesWidth = 0;
            this.images = [];
            this.position = 0;
            this.fullscreenButtonAdded = false;
            this.playerElement = element;
            this.styleFilePath = (cnf.styleFilePath || Player.defaultOptions.styleFilePath);
            this.activate = !element.classList.contains('no-active');
            this.mainWrapperClass = (cnf.mainWrapperClass || Player.defaultOptions.mainWrapperClass);
            this.imageWrapperClass = (cnf.imageWrapperClass || Player.defaultOptions.imageWrapperClass);
            this.scrollButtonsWidth = (cnf.scrollButtonsWidth || Player.defaultOptions.scrollButtonsWidth);
            this.scrollButtonsPadding
                = (cnf.scrollButtonsPadding || Player.defaultOptions.scrollButtonsPadding);
            this.imageStopClass = (cnf.imageStopClass || Player.defaultOptions.imageStopClass);
            const self = this;
            element.classList.add('player');
            element.insertAdjacentHTML('beforeend', `<div class="${this.mainWrapperClass}"></div>`);
            element.insertAdjacentHTML('beforeend', `<div class="${this.imageWrapperClass}"></div>`);
            this.imageWrapper = element.querySelector(`.${this.imageWrapperClass}`);
            this.mainWrapper = element.querySelector(`.${this.mainWrapperClass}`);
            this.imageWrapper.classList.add(this.uniq);
            this.setRender();
            this.setImageClick();
            this.setDeleteClick();
            this.setScroll();
            element.querySelectorAll(`img:not(.${this.imageStopClass})`).forEach(function (image) {
                self.addItem(image);
                image.remove();
            });
            this.images = Array.from(this.imageWrapper.querySelectorAll('.img'));
            let imagesWidth = 0;
            this.images.forEach(function (img) {
                imagesWidth += img.offsetWidth;
            });
            this.imagesWidth = imagesWidth;
            this.emptyPlayerImage = element.querySelector(`img.${this.imageStopClass}`);
            this.emptyPlayerImageDisplay = this.emptyPlayerImage ? this.emptyPlayerImage.style.display : null;
            const firstImage = this.imageWrapper.querySelector('.img');
            if (this.activate && firstImage) {
                firstImage.click();
            }
        }
        /**
         * Начало рендеринга
         *
         * @param {HTMLDivElement} mainWrapper
         * @param {HTMLSpanElement} curImage
         * @param {string} selector
         */
        static renderInit(mainWrapper, curImage, selector) {
            if (curImage.classList.contains('current')) {
                return;
            }
            mainWrapper.querySelectorAll(selector).forEach(function (element) {
                element.style.display = 'none';
            });
            if (curImage.parentElement) {
                Array.from(curImage.parentElement.children).forEach(function (imageSpan) {
                    imageSpan.classList.remove('current');
                });
            }
            curImage.classList.add('current');
        }
        /**
         * Рендеринг видео в плеере
         *
         * @param {HTMLDivElement} mainWrapper - блок хранящий видео
         * @param {HTMLSpanElement} curImage - загружаемое изображение
         *
         * @returns {HTMLVideoElement | null}
         */
        static renderVideo(mainWrapper, curImage) {
            Player.renderInit(mainWrapper, curImage, 'video');
            let videoSrc = curImage.dataset.objectSrc || '', imageSrc = curImage.dataset.src;
            if (!videoSrc) {
                return null;
            }
            for (let video of Array.from(mainWrapper.querySelectorAll('video'))) {
                if (video.getAttribute('src') === videoSrc) {
                    video.style.display = 'block';
                    return video;
                }
            }
            let video = Utils.GoodFuncs.createElementWithAttrs('video', {
                src: videoSrc,
                controls: 'controls',
                poster: imageSrc,
                preload: 'metadata',
                controlsList: 'nodownload',
                text: 'Видео не доступно',
                volume: 'high',
                status: 'stop',
                fullscreen: 'no' /*,
                width: mainWrapper.innerWidth(),
                height: mainWrapper.innerWidth() * curImage.innerHeight() / curImage.innerWidth()*/
            });
            mainWrapper.insertAdjacentElement('beforeend', video);
            return video;
        }
        /**
         * Рендеринг изображения в плеере
         *
         * @param {HTMLDivElement} mainWrapper - блок хранящий изображения
         * @param {HTMLSpanElement} curImage - загружаемое изображение
         *
         * @returns {HTMLImageElement | null}
         */
        static renderImage(mainWrapper, curImage) {
            Player.renderInit(mainWrapper, curImage, 'img');
            let imageSrc = curImage.dataset.src;
            for (let image of Array.from(mainWrapper.querySelectorAll('img'))) {
                if (image.getAttribute('src') === imageSrc) {
                    image.style.display = 'block';
                    return image;
                }
            }
            let image = Utils.GoodFuncs.createElementWithAttrs('img', {
                class: 'materialboxed responsive-img',
                src: imageSrc
            });
            mainWrapper.insertAdjacentElement('beforeend', image);
            if (window['M'] !== undefined) {
                M.Materialbox.init(image);
            }
            return image;
        }
        /**
         * Рендеринг книги в плеере
         *
         * @param {HTMLDivElement} mainWrapper - блок хранящий изображения
         * @param {HTMLSpanElement} curImage - загружаемое изображение
         *
         * @returns {HTMLIFrameElement | HTMLEmbedElement | null}
         */
        static renderBook(mainWrapper, curImage) {
            Player.renderInit(mainWrapper, curImage, 'iframe, embed');
            let bookSrc = curImage.dataset.objectSrc || '', bookSrcMatches = bookSrc.match(/.+?\.([^.]+)$/), bookType = curImage.dataset.type || (bookSrcMatches ? bookSrcMatches[1] : '');
            if (!bookSrc || !bookType) {
                return null;
            }
            for (let book of Array.from(mainWrapper.querySelectorAll('embed, iframe'))) {
                if (book.getAttribute('src') === bookSrc) {
                    book.style.display = 'block';
                    return book.tagName === 'iframe' ? book : book;
                }
            }
            let book = document.createElement('iframe');
            switch (bookType) {
                case 'pdf':
                    book.setAttribute('src', bookSrc);
                    break;
                default:
                    book.setAttribute('src', 'https://docs.google.com/viewer?url=' + document.location.origin + bookSrc + '&embedded=true');
            }
            book.allowFullscreen = true;
            mainWrapper.insertAdjacentElement('beforeend', book);
            return book;
        }
        setRender() {
            const self = this;
            if (this.playerElement.classList.contains('video')) {
                this.render = function (curImage) {
                    self.emptyPlayerImage && (self.emptyPlayerImage.style.display = 'none');
                    return Player.renderVideo(self.mainWrapper, curImage);
                };
                this.type = 'video';
            }
            else if (this.playerElement.classList.contains('image')) {
                this.render = function (curImage) {
                    self.emptyPlayerImage && (self.emptyPlayerImage.style.display = 'none');
                    return Player.renderImage(self.mainWrapper, curImage);
                };
                this.type = 'image';
            }
            else if (this.playerElement.classList.contains('book')) {
                this.render = function (curImage) {
                    self.emptyPlayerImage && (self.emptyPlayerImage.style.display = 'none');
                    self.addFullScreenButton();
                    return Player.renderBook(self.mainWrapper, curImage);
                };
                this.type = 'book';
            }
        }
        addFullScreenButton() {
            if (!this.fullscreenButtonAdded) {
                let button = document.createElement('button');
                button.classList.add('fullscreen');
                button.type = 'button';
                this.mainWrapper.append(button);
                button.addEventListener('click', function () {
                    Utils.GoodFuncs.nextAll(this, 'iframe').forEach(function (iframe) {
                        const computedStyle = window.getComputedStyle(iframe);
                        if (computedStyle.display !== 'none') {
                            const rFS = iframe.mozRequestFullScreen
                                || iframe.webkitRequestFullscreen
                                || iframe.requestFullscreen;
                            rFS.call(iframe);
                        }
                    });
                });
                this.fullscreenButtonAdded = true;
            }
        }
        setImageClick() {
            const self = this;
            this.imageWrapper.addEventListener('click', function (e) {
                let target = e.target;
                if (!target.matches('.img')) {
                    return;
                }
                e.stopPropagation();
                self.render(target);
                //self.scrollTo(self.images.indexOf(target));
            });
        }
        setDeleteClick() {
            const self = this;
            this.imageWrapper.addEventListener('click', function (e) {
                e.stopPropagation();
                let target = e.target;
                if (!target.matches('.img > i')) {
                    return;
                }
                const element = target.parentNode, index = self.images.indexOf(element);
                if (self.images[index + 1] !== undefined) {
                    self.images[index + 1].click();
                }
                else if (self.images[index - 1]) {
                    self.images[index - 1].click();
                }
                self.deleteItem(element);
                if (!self.images.length) {
                    self.emptyPlayerImage
                        && self.emptyPlayerImageDisplay
                        && (self.emptyPlayerImage.style.display = self.emptyPlayerImageDisplay);
                }
            });
        }
        setScroll() {
            const self = this;
            this.imageWrapper.addEventListener('click', function (e) {
                if (!e.target.matches('.' + self.imageWrapperClass)) {
                    return;
                }
                let offset = e['detail'] && e['detail']['offset'] !== undefined
                    ? e.detail['offset']
                    : e.offsetX;
                if (!self.images.length || self.imagesWidth <= self.imageWrapper.clientWidth) {
                    return;
                }
                let position = self.position;
                if (offset <= self.scrollButtonsWidth) {
                    if (self.images[position - 1]) {
                        position--;
                        self.diffWidth = 0;
                    }
                }
                else if (offset >= self.imageWrapper.clientWidth - self.scrollButtonsWidth) {
                    if (!self.diffWidth && self.images[position + 1]) {
                        position++;
                    }
                }
                else {
                    return;
                }
                const startScroll = self.prevScroll;
                if (self.scrollTo(position) === startScroll && position < self.position && startScroll) {
                    this.dispatchEvent(new CustomEvent('click', { detail: { offset: offset } }));
                }
            });
            this.imageWrapper.addEventListener('wheel', function (e) {
                e.preventDefault();
                if (this['disabled']) {
                    return;
                }
                if (e.deltaY < 0) {
                    this.dispatchEvent(new CustomEvent('click', { detail: { offset: 0 } }));
                    return;
                }
                this.dispatchEvent(new CustomEvent('click', { detail: { offset: this.clientWidth } }));
            });
        }
        /**
         *
         * @param {number} index
         *
         * @returns {number}
         */
        scrollTo(index) {
            const self = this;
            if (!this.images[index]) {
                return;
            }
            const currentImage = this.images[index];
            let scroll = 0;
            Utils.GoodFuncs.prevAll(currentImage, '.img').forEach(function (element) {
                scroll += element.clientWidth;
            });
            if (scroll > this.prevScroll) {
                let viewWidth = 0;
                Utils.GoodFuncs.nextAll(currentImage, '.img').forEach(function (element) {
                    viewWidth += element.clientWidth;
                });
                viewWidth += currentImage.clientWidth;
                if (viewWidth <= this.imageWrapper.clientWidth) {
                    this.diffWidth = this.imageWrapper.clientWidth - viewWidth;
                    scroll -= this.diffWidth;
                }
            }
            else {
                this.diffWidth = 0;
            }
            this.images.forEach(function (img) {
                img.animate({
                    left: [-self.prevScroll + 'px', -scroll + 'px']
                }, {
                    duration: self.animationDuration,
                    fill: 'forwards'
                });
            });
            this.position = index;
            this.prevScroll = scroll;
            return scroll;
        }
        /**
         * Геттер для уникального идентификатора плеера
         *
         * @returns {string}
         */
        get id() {
            return this.uniq;
        }
        /**
         * Добавить изображение в плеер
         *
         * @param {HTMLImageElement} image - изображение
         * @param {boolean} isActivate - активировать добавляемое изображение
         * @param {string} sourceName - ссылка на альтернативный ресурс
         */
        addItem(image, isActivate = false, sourceName = '') {
            if (image.closest('.clone')) {
                return;
            }
            let src = decodeURI(image.src), span = Utils.GoodFuncs.createElementWithAttrs('span', {
                'class': 'img',
                'data-src': src,
                'title': image.title.length > 50 ? image.title.substr(0, 50) + '...' : image.title,
                'data-object-src': image.dataset.objectSrc,
                'data-type': image.dataset.type,
                'html': '<i class="material-icons">close</i>',
                'data-name': sourceName || image.dataset.name
            });
            span.style.backgroundImage = `url(${src})`;
            this.imageWrapper.appendChild(span);
            this.images.push(span);
            this.imagesWidth += span.offsetWidth;
            if (isActivate) {
                span.click();
            }
        }
        /**
         * Удалить пару изображение - ресурс из плеера
         *
         * @param {HTMLSpanElement} element - удаляемый элемент
         */
        deleteItem(element) {
            let index = this.images.indexOf(element), objSrc = element.dataset.objectSrc || element.dataset.src;
            element.remove();
            for (let object of Array.from(this.mainWrapper.querySelectorAll('img, video, iframe, embed'))) {
                if (object.getAttribute('src') === objSrc) {
                    object.remove();
                }
            }
            this.images.splice(index, 1);
            this.images = this.images.filter(val => val);
            this.imagesWidth -= element.offsetWidth;
            document.dispatchEvent(new CustomEvent('deleteItem', {
                detail: {
                    src: objSrc,
                    field: element.dataset.name
                }
            }));
        }
    }
    /**
     * Параметры конфигурации по умолчанию
     *
     * @type {IPlayerOptions}
     */
    Player.defaultOptions = {
        styleFilePath: 'player.css',
        mainWrapperClass: 'main-wrapper',
        imageWrapperClass: 'image-wrapper',
        scrollButtonsWidth: 50,
        scrollButtonsPadding: 10,
        imageStopClass: 'no-image'
    };
    QooizPlayer.Player = Player;
})(QooizPlayer || (QooizPlayer = {}));
