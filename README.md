<a name="Player"></a>

## Player
Класс плеера

**Kind**: global class  

* [Player](#Player)
    * [new Player(element, cnf)](#new_Player_new)
    * _instance_
        * [.uniq](#Player+uniq)
        * [.id](#Player+id) ⇒ <code>string</code>
        * [.addItem(image, isActivate, sourceName)](#Player+addItem)
        * [.deleteItem(index)](#Player+deleteItem)
    * _static_
        * [.renderVideo(mainWrapper, curImage)](#Player.renderVideo) ⇒ <code>HTMLVideoElement</code> \| <code>null</code>
        * [.renderImage(mainWrapper, curImage)](#Player.renderImage) ⇒ <code>HTMLImageElement</code> \| <code>null</code>
        * [.renderBook(mainWrapper, curImage)](#Player.renderBook) ⇒ <code>HTMLIFrameElement</code> \| <code>HTMLEmbedElement</code> \| <code>null</code>

<a name="new_Player_new"></a>

### new Player(element, cnf)
Конструктор


| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> | на каком элементе загружается плеер |
| cnf | <code>QooizPlayer.PlayerOptions</code> | объект конфигурации |

<a name="Player+uniq"></a>

### player.uniq
Уникальный идентификатор плеера

**Kind**: instance property of [<code>Player</code>](#Player)  
<a name="Player+id"></a>

### player.id ⇒ <code>string</code>
Геттер для уникального идентификатора плеера

**Kind**: instance property of [<code>Player</code>](#Player)  
<a name="Player+addItem"></a>

### player.addItem(image, isActivate, sourceName)
Добавить изображение в плеер

**Kind**: instance method of [<code>Player</code>](#Player)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| image | <code>HTMLImageElement</code> |  | изображение |
| isActivate | <code>boolean</code> | <code>false</code> | активировать добавляемое изображение |
| sourceName | <code>string</code> |  | ссылка на альтернативный ресурс |

<a name="Player+deleteItem"></a>

### player.deleteItem(index)
Удалить пару изображение - ресурс из плеера

**Kind**: instance method of [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | индекс удаляемой сущность |

<a name="Player.renderVideo"></a>

### Player.renderVideo(mainWrapper, curImage) ⇒ <code>HTMLVideoElement</code> \| <code>null</code>
Рендеринг видео в плеере

**Kind**: static method of [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| mainWrapper | <code>HTMLDivElement</code> | блок хранящий видео |
| curImage | <code>HTMLSpanElement</code> | загружаемое изображение |

<a name="Player.renderImage"></a>

### Player.renderImage(mainWrapper, curImage) ⇒ <code>HTMLImageElement</code> \| <code>null</code>
Рендеринг изображения в плеере

**Kind**: static method of [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| mainWrapper | <code>HTMLDivElement</code> | блок хранящий изображения |
| curImage | <code>HTMLSpanElement</code> | загружаемое изображение |

<a name="Player.renderBook"></a>

### Player.renderBook(mainWrapper, curImage) ⇒ <code>HTMLIFrameElement</code> \| <code>HTMLEmbedElement</code> \| <code>null</code>
Рендеринг книги в плеере

**Kind**: static method of [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| mainWrapper | <code>HTMLDivElement</code> | блок хранящий изображения |
| curImage | <code>HTMLSpanElement</code> | загружаемое изображение |

