Draggy Droppy
=============

Draggy Droppy is a simple and straightforward jQuery drag to upload library.

## Quick Start

```html
<head>
    <link href="/path/to/draggyDroppy/dist/draggyDroppy.min.css" rel="stylesheet">
    
    <script src="/path/to/jquery.js"></script>
    
    <script src="/path/to/draggyDroppy/dist/draggyDroppy.min.js"></script>
</head>
<body>
    <div class="myCase"></div>
    
    <script>
        $('.myCase').draggyDroppy();
    </script>
</body>
```

## Defaults

Options to configure draggyDroppy can be passed in at point of requesting an area.

The default values are:

```javascript
{
    uploadUrl: '/',
    uploadParams: {},
    wrapperClass: 'draggyDropArea',
    formClass: 'draggyDropForm',
    highlightClass: 'draggyOn',
    intro: $('<p />').html('Drag and drop your files below or click "Select files".'),
    fileElemClass: 'draggyFileElem',
    accept: '*/*',
    showProgress: true,
    progressBarClass: 'draggyProgressBar',
    listClass: 'draggyList',
    multiple: true,
    triggerContent: 'Select files',
    triggerClass: 'btn btn-primary',
    showErrorMessage: true,
    errorMessageClass: 'draggyErrorReason',
    errorMessageTemplate: 'Upload failed. Response code %s.',
    onStart: function() {},
    onComplete: function() {},
    onFileFinished: function(file, responseData, statusCode){}
}
```

## Options:

* `uploadUrl`
    * Default: `/`
    * The path to use to upload the file.
* `uploadParams`
    * Default `{}`
    * A dictionary of key value pairs to send as additional `POST` parameters.
* `wrapperClass`
    * Default: `draggyDropArea`
    * Controls the outer `div` class for the area.
* `formClass`
    * Default: `draggyDropForm`
    * The class name of the form to use.
* `highlightClass`
    * Default: `draggyOn`
    * On dragging over the area, this is the class name that's appended to the `wrapperClass`
* `intro`
    * Default: `$('<p />').html('Drag and drop your files below or click "Select files".')`
    * The content for the intro on the target div.
* `fileElemClass`
    * Default: `draggyFileElem`
    * The class name for the file input.
* `accept`
    * Default: `*/*`
    * The `accept` value of the file input. For example `image/*` for just images.
* `showProgress`
    * Default: `true`
    * Whether to show the progress bar.
* `progressBarClass`
    * Default: `draggyProgressBar`
    * The class name of the progress bar.
* `listClass`
    * Default: `draggyList`
    * The class name of each list item on upload.
* `multiple`
    * Default: `true`
    * Are multiple files allowed?
* `triggerContent`
    * Default: `Select files`
    * The text or HTML value for the trigger button.
* `triggerClass`
    * Default: `btn btn-primary`
    * The class names to append to the trigger button.
* `showErrorMessage`
    * Default: `true`
    * When the upload fails, should the HTTP response code be output to the user?
* `errorMessageClass`
    * Default: `draggyErrorReason`
    * The class name for the error `p` tag.
* `errorMessageTemplate`
    * Default: `Upload failed. Response code %s.`
    * The error message format to use.
* `onStart`
    * Default: `function(){}`
    * A function that's called when files are dropped.
* `onComplete`
    * Default: `function(){}`
    * A function that's called when the queue has finished processing.
* `onFileFinished`
    * Default: `function(file, responseData, statusCode, fileListUid){}`
    * A function that's called when single file has finished uploaded (success or failure).

## Known Issues:

When dragging and dropping, the `accept` parameter is ignored.
