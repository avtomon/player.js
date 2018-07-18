"use strict";
var QooizPlayer;
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
            /**
             * Уникальный идентификатор плеера
             */
            this.uniq = Utils.GoodFuncs.getRandomString(12);
            this.styleFilePath = cnf.styleFilePath || Player.defaultOptions.styleFilePath;
            this.activate = cnf.activate !== undefined ? cnf.activate : Player.defaultOptions.activate;
            this.mainWrapperClass = cnf.mainWrapperClass || Player.defaultOptions.mainWrapperClass;
            this.imageWrapperClass = cnf.imageWrapperClass || Player.defaultOptions.imageWrapperClass;
            this.scrollButtonsWidth = cnf.scrollButtonsWidth || Player.defaultOptions.scrollButtonsWidth;
            this.scrollButtonsPadding = cnf.scrollButtonsPadding || Player.defaultOptions.scrollButtonsPadding;
            this.imageStopClass = cnf.imageStopClass || Player.defaultOptions.imageStopClass;
            element.classList.add('player');
            element.insertAdjacentHTML('beforeend', `<div class="${this.mainWrapperClass}"></div>`);
            element.insertAdjacentHTML('beforeend', `<div class="${this.imageWrapperClass}"></div>`);
            this.imageWrapper = element.querySelector(this.imageWrapperClass);
            this.mainWrapper = element.querySelector(this.mainWrapperClass);
            this.imageWrapper.classList.add(this.uniq);
            element.querySelectorAll(`img:not(.${this.imageStopClass})`).forEach(function (image) {
                this.addItem(image);
                image.remove();
            }, this);
            if (element.classList.contains('video')) {
                this.render = function (curImage) {
                    return Player.renderVideo(this.mainWrapper, curImage);
                }.bind(this);
                this.type = 'video';
            }
            else if (element.classList.contains('image')) {
                this.render = function (curImage) {
                    return Player.renderImage(this.mainWrapper, curImage);
                }.bind(this);
                this.type = 'image';
            }
            else if (element.classList.contains('book')) {
                this.render = function (curImage) {
                    return Player.renderBook(this.mainWrapper, curImage);
                }.bind(this);
                this.type = 'book';
            }
            this.imageWrapper.addEventListener('click', function (e) {
                let target = Utils.GoodFuncs.getDelegateTarget(e, '.img');
                if (!target) {
                    return;
                }
                this.render(target);
            }.bind(this));
            this.imageWrapper.addEventListener('click', function (e) {
                let target = Utils.GoodFuncs.getDelegateTarget(e, '.img > i');
                if (!target) {
                    return;
                }
                this.deleteItem(Utils.GoodFuncs.index(target.parentElement, '.img'));
                e.stopPropagation();
            }.bind(this));
            let firstImage = this.imageWrapper.querySelector('.img');
            firstImage.classList.add('first');
            if (this.activate) {
                firstImage.dispatchEvent(new Event('click'));
            }
            let imageWrapperSelector = '.' + this.uniq, playerSliderPseudoBefore = Utils.GoodFuncs.pseudo(this.styleFilePath, imageWrapperSelector + ':before'), playerSliderPseudoAfter = Utils.GoodFuncs.pseudo(this.styleFilePath, imageWrapperSelector + ':after');
            this.imageWrapper.addEventListener('click', function (e) {
                if (this.imageWrapper.getAttribute('disabled')) {
                    return;
                }
                let offset = e.detail && e.detail['offset'] || e.offsetX;
                if ((this.imageWrapper.scrollLeft < this.scrollButtonsPadding && offset <= this.scrollButtonsWidth)
                    ||
                        (this.imageWrapper.scrollLeft > this.imageWrapper.scrollWidth - this.imageWrapper.clientWidth - this.scrollButtonsPadding
                            &&
                                offset >= this.imageWrapper.clientWidth - this.scrollButtonsWidth)) {
                    return false;
                }
                let first = this.imageWrapper.querySelector('.img');
                first.classList.remove('first');
                if (offset <= this.scrollButtonsWidth) {
                    Utils.GoodFuncs.prev(first, '.img').classList.add('first');
                }
                else if (offset >= this.imageWrapper.clientWidth - this.scrollButtonsWidth) {
                    Utils.GoodFuncs.next(first, '.img').classList.add('first');
                }
                first = this.imageWrapper.querySelector('.img.first');
                if (!first) {
                    return;
                }
                let scroll = 0;
                Utils.GoodFuncs.prevAll(first, '.img').forEach(function (element) {
                    scroll += element.clientWidth;
                });
                this.imageWrapper.animate({
                    scrollLeft: scroll
                }, 500);
                this.imageWrapper.removeAttribute('disabled');
                playerSliderPseudoBefore({ left: scroll + 'px !important' });
                playerSliderPseudoAfter({ left: 'calc(100% + ' + scroll + 'px) !important' });
            }.bind(this));
            this.imageWrapper.addEventListener('wheel', function (e) {
                if (this.getAttribute('disabled')) {
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
         * Рендеринг видео в плеере
         *
         * @param {HTMLDivElement} mainWrapper - блок хранящий видео
         * @param {HTMLSpanElement} curImage - загружаемое изображение
         *
         * @returns {HTMLVideoElement | null}
         */
        static renderVideo(mainWrapper, curImage) {
            if (curImage.classList.contains('current')) {
                return null;
            }
            let videoSrc = curImage.dataset.objectSrc, imageSrc = curImage.dataset.src;
            if (!videoSrc) {
                let parched = imageSrc ? imageSrc.match(/^(.*?\/)image\/(\w+)/) : null;
                videoSrc = Array.isArray(parched) ? parched[1] + 'video/' + parched[2] + '.mp4' : null;
            }
            if (!videoSrc) {
                return null;
            }
            mainWrapper.querySelector('video:visible').style.display = 'none';
            Array.from(curImage.parentElement.children).forEach(function (imageSpan) {
                imageSpan.classList.remove('current');
            });
            curImage.classList.add('current');
            for (let video of Array.from(mainWrapper.querySelectorAll('video'))) {
                video = video;
                if (video.src === videoSrc) {
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
            mainWrapper.insertAdjacentElement('afterbegin', video);
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
            if (curImage.classList.contains('current')) {
                return null;
            }
            mainWrapper.querySelector('img:visible').style.display = 'none';
            Array.from(curImage.parentElement.children).forEach(function (imageSpan) {
                imageSpan.classList.remove('current');
            });
            curImage.classList.add('current');
            let imageSrc = curImage.dataset.src;
            for (let image of Array.from(mainWrapper.querySelectorAll('img'))) {
                if (image.src === imageSrc) {
                    image.style.display = 'block';
                    return image;
                }
            }
            let image = Utils.GoodFuncs.createElementWithAttrs('img', {
                class: 'materialboxed',
                src: imageSrc
            });
            mainWrapper.insertAdjacentElement('afterbegin', image);
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
            if (curImage.classList.contains('current')) {
                return null;
            }
            let bookSrc = curImage.dataset.objectSrc, imageSrc = curImage.dataset.src, bookType = curImage.dataset.type || bookSrc.match(/.+?\.([^.]+)$/)[1];
            if (!bookSrc) {
                let parched = imageSrc ? imageSrc.match(/^(.*?\/)image\/(\w+)/) : null;
                bookSrc = Array.isArray(parched) && bookType ? parched[1] + 'book/' + parched[2] + '.' + bookType : null;
            }
            if (!bookSrc || !bookType) {
                return null;
            }
            mainWrapper.querySelector('iframe:visible, embed:visible').style.display = 'none';
            Array.from(curImage.parentElement.children).forEach(function (imageSpan) {
                imageSpan.classList.remove('current');
            });
            curImage.classList.add('current');
            for (let book of Array.from(mainWrapper.querySelectorAll('embed, iframe'))) {
                if (book['src'] === book) {
                    book['style'].display = 'block';
                    return book.tagName === 'iframe' ? book : book;
                }
            }
            let iframe = document.createElement('iframe');
            switch (bookType) {
                case 'pdf':
                    iframe.setAttribute('src', bookSrc);
                    break;
                default:
                    iframe.setAttribute('src', 'https://docs.google.com/viewer?url=' + document.location.origin + bookSrc + '&embedded=true');
            }
            mainWrapper.insertAdjacentElement('afterbegin', iframe);
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
            let span = Utils.GoodFuncs.createElementWithAttrs('span', {
                'class': 'img',
                'data-src': image.src,
                'title': image.title.length > 50 ? image.title.substr(0, 50) + '...' : image.title,
                'data-object-src': image.dataset.objectSrc,
                'data-type': image.dataset.type,
                'html': '<i class="material-icons">close</i>',
                'data-source': sourceName || image.dataset.source
            });
            span.style.backgroundImage = 'url(' + image.src + ')';
            this.imageWrapper.appendChild(span);
            if (isActivate) {
                span.dispatchEvent(new Event('click'));
            }
        }
        /**
         * Удалить пару изображение - ресурс из плеера
         *
         * @param {number} index - индекс удаляемой сущность
         */
        deleteItem(index) {
            let images = Array.from(this.imageWrapper.querySelectorAll('.img')), image = images[index], src = image.dataset.objectSrc;
            image.remove();
            this.mainWrapper.querySelector('*[src="' + src + '"]').remove();
            images[index + 1].dispatchEvent(new Event('click'));
            this.imageWrapper.dispatchEvent(new CustomEvent('deleteItem', {
                detail: {
                    index: index,
                    image: image
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
        activate: true,
        mainWrapperClass: 'main-wrapper',
        imageWrapperClass: 'image-wrapper',
        scrollButtonsWidth: 50,
        scrollButtonsPadding: 10,
        imageStopClass: 'no-image'
    };
    QooizPlayer.Player = Player;
})(QooizPlayer || (QooizPlayer = {}));
//# sourceMappingURL=player.js.map