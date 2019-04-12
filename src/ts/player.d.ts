export declare namespace QooizPlayer {
    /**
     * Интерфейс конфига плеера
     */
    interface IPlayerOptions {
        /**
         * Путь к файлу со стилями
         */
        readonly styleFilePath?: string;
        /**
         * Выбирать первый элемент при инициализации плеера
         */
        readonly activate?: boolean;
        /**
         * Класс блока просмотра
         */
        readonly mainWrapperClass?: string;
        /**
         * Класс блока превью
         */
        readonly imageWrapperClass?: string;
        /**
         * Ширина кпопок прокрутки
         */
        readonly scrollButtonsWidth?: number;
        /**
         * Погрешность клика по кнопкам прокрутки
         */
        readonly scrollButtonsPadding?: number;
        /**
         * Изображения с этим классом не загружаются в плеер
         */
        readonly imageStopClass?: string;
    }
    /**
     * Просмотрщик на чистом JavaScript. На данный момент может отображать видео, графику и книги в формате PDF.
     */
    class Player implements IPlayerOptions {
        protected static renderInit(mainWrapper: HTMLDivElement, curImage: HTMLSpanElement, selector: string): void;
        /**
         * Рендеринг видео в плеере
         *
         * @param {HTMLDivElement} mainWrapper - блок хранящий видео
         * @param {HTMLSpanElement} curImage - загружаемое изображение
         *
         * @returns {HTMLVideoElement | null}
         */
        protected static renderVideo(mainWrapper: HTMLDivElement, curImage: HTMLSpanElement): HTMLVideoElement | null;
        /**
         * Рендеринг изображения в плеере
         *
         * @param {HTMLDivElement} mainWrapper - блок хранящий изображения
         * @param {HTMLSpanElement} curImage - загружаемое изображение
         *
         * @returns {HTMLImageElement | null}
         */
        protected static renderImage(mainWrapper: HTMLDivElement, curImage: HTMLSpanElement): HTMLImageElement | null;
        /**
         * Рендеринг книги в плеере
         *
         * @param {HTMLDivElement} mainWrapper - блок хранящий изображения
         * @param {HTMLSpanElement} curImage - загружаемое изображение
         *
         * @returns {HTMLIFrameElement | HTMLEmbedElement | null}
         */
        protected static renderBook(mainWrapper: HTMLDivElement, curImage: HTMLSpanElement): HTMLIFrameElement | HTMLEmbedElement | null | undefined;
        /**
         * Параметры конфигурации по умолчанию
         *
         * @type {IPlayerOptions}
         */
        static defaultOptions: IPlayerOptions;
        readonly styleFilePath: string;
        readonly activate: boolean;
        readonly mainWrapperClass: string;
        readonly imageWrapperClass: string;
        readonly scrollButtonsWidth: number;
        readonly scrollButtonsPadding: number;
        readonly imageStopClass: string;
        /**
         * Обработчик добавления новой сущности
         */
        protected readonly render: (curImage: HTMLElement) => HTMLElement | null;
        /**
         * Уникальный идентификатор плеера
         */
        protected readonly uniq: string;
        /**
         * Блок просмотра
         */
        readonly mainWrapper: HTMLDivElement;
        /**
         * Блок превью
         */
        readonly imageWrapper: HTMLDivElement;
        /**
         * Тип плеера
         */
        readonly type: 'video' | 'image' | 'book';
        /**
         * На каком элементе загружается плеер
         */
        readonly element: HTMLElement;
        /**
         * Конструктор
         *
         * @param {HTMLElement} element - на каком элементе загружается плеер
         * @param {IPlayerOptions} cnf - объект конфигурации
         */
        constructor(element: HTMLElement, cnf?: IPlayerOptions);
        /**
         * Геттер для уникального идентификатора плеера
         *
         * @returns {string}
         */
        readonly id: string;
        /**
         * Добавить изображение в плеер
         *
         * @param {HTMLImageElement} image - изображение
         * @param {boolean} isActivate - активировать добавляемое изображение
         * @param {string} sourceName - ссылка на альтернативный ресурс
         */
        addItem(image: HTMLImageElement, isActivate?: boolean, sourceName?: string): void;
        /**
         * Удалить пару изображение - ресурс из плеера
         *
         * @param {number} index - индекс удаляемой сущность
         */
        deleteItem(index: number): void;
    }
}
