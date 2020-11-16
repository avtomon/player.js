# Player.js

Viewer on pure JavaScript. At the moment it can display video, graphics and books in PDF format.

#### Installation

`
composer reqire avtomon/player.js
`
<br>

#### Description

The module requires an HTML block with one of the predefined classes:
- <b > video</b > - video player will be created;
- <b > image</b > - image viewer;
<b>book</b> - the viewer of books in PDF format

If there is such a block, it is very easy to create a block:

Suppose that such a block is:

```
<div class= "video" ></div>
```

then the code for creating the player object in the simplest case:

```
let player = new Player (document.querySelector('div.video'));
```

The second parameter of the constructor can be a configuration object-the object implementing the following interface:

```
interface IPlayerOptions {

/**
     * Path to file with styles
     */
    readonly styleFilePath?: string;

/**
     * Select the first item when initializing the player
     */
    readonly activate?: boolean;

/**
     * Class of viewing unit
     */
    readonly mainWrapperClass?: string;

/**
     * Class block preview
     */
    readonly imageWrapperClass?: string;

/**
     * Width of the scroll buttons
     */
    readonly scrollButtonsWidth?: number;

/**
     * Error of click on scroll buttons
     */
     readonly scrollButtonsPadding?: number;

/**
      * Images with this class are not loaded into the player
      */
      readonly imageStopClass?: string;
}
```

Each resource loaded into the viewer has a preview in the form of an image. Actually, in the form of images, new elements are added to the player and then converted into an internal format.

You can add elements to the player in the following way:

```
player.addItem(image, true);
```

Elements are always added in the form of the HTMLImageElement object, which should contain the necessary most were:

- <I > src</i> - image path;
- <I > title</i> - name of the downloaded resource;
- <b><I>data-object-src</I></b > - path to the resource that represents the image (link to video, picture or book).

and may contain optional attributes:
- <I > data-type</I > -this attribute can be used to specify an optional resource type if you want to divide resources by types.

This creates <i>\<span></I> elements with the back attributes + by default, the <I>class</i> attribute is set to <I > img</i> the internal HTML code will be:

```
<I class= "material-icons" >close</i>
```

if you use the library [materializecss](https://materializecss.com), then such a markup element will add a player element delete button.

The second parameter specifies whether to move to the added element of the same tale after adding or not.

Delete items:

```
deleteItem(index);
```

where <I > index</i> is the index of the deleted item in the player.

<br>

If supported by the module unit at the time of initialisatie player already contains the image with necessary attributes, they are automatically added to the player, with the exception of those that contain the class specified by the Directive <b>imageStopClass</b> configuration of the player (<i>IPlayerOptions</i>), the default class is <b>no-image</b>.

<br>

<b > note:</b> 
If you plan to develop the project yourself and build it with the <I>script build.sh</i> you will need to install < b>Gulp</b> and its plugins specified in the <I>script init.sh</i> in the global scope, and why run the <I>script init.sh</i> for linking. Or install all dependencies directly into the project.

<br>

[Method documentation](docs_ru)
