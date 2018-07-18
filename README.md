# Player.js

A viewer in pure JavaScript. At the moment can display video, graphics and books in PDF format.

The module requires an HTML block with one of the predefined classes:
- <b> video </b> - a video player will be created;
- <b> image </b> - picture viewer;
- <b> book </b> - PDF viewer

If there is such a block, then it is very simple to create a block:

Suppose that such a block is:

```
<div class = "video"> </div>
```

then the code for creating the player object in the simplest case:

```
let player = new Player (document.querySelector ('div.video'));
```

The second parameter of the constructor can be a configuration object - an object that implements the following interface:

```
interface IPlayerOptions {

/**
* Path to the file with styles
*/
readonly styleFilePath ?: string;

/**
* Select the first item when the player is initialized
*/
readonly activate ?: boolean;

/**
* Viewer class
*/
readonly mainWrapperClass ?: string;

/**
* Block class preview
*/
readonly imageWrapperClass ?: string;

/**
* Width of the scroll buttons
*/
readonly scrollButtonsWidth ?: number;

/**
* Accuracy of clicking on the scroll buttons
*/
readonly scrollButtonsPadding ?: number;

/**
* Images with this class are not loaded into the player
*/
readonly imageStopClass ?: string;
}
```

Each resource uploaded to the viewer has a preview in the form of an image. Actually, in the form of images in the player, new elements are added, and then converted into an internal format.

You can add items to the player in the following way:

```
player.addItem (image, true);
```

Elements are always added as HTMLImageElement objects that must contain the required artibuts:

- <i> src </i> - the path to the image;
- <i> title </i> - the name of the downloadable resource;
- <b> <i> data-object-src </i> </b> - the path to the resource that represents the image (link to video, image or book).

and can contain optional attributes:
- <i> data-type </i> - this attribute allows you to specify an optional resource type, if you want to somehow divide resources by type.

This creates <i>\<span> </i> elements with backed attributes + by default the <i> class </i> attribute is set with the value <i> img </i> the internal HTML will be:

```
<i class = "material-icons"> close </i>
```

if you use the library [materializecss](https://materializecss.com), then such a markup element will add a button to remove the element of the player.

The second parameter specifies whether to override the added element to the same tale after adding or not.

Deleting an item:

```
deleteItem (index);
```

where <i> index </i> is the index of the item being deleted in the player.

<br>

If the unit processed by the module at the time of initialization of the player already contains images with the necessary attributes, they are automatically added to the player, except for those that contain the class specified by the <b> imageStopClass </b> player configuration (<i> IPlayerOptions </i>) , by default this is the <b> no-image </b> class.

[Method documentation](docs_en)
