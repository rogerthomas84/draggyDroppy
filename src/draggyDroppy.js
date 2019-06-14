/**
 * Roger Thomas
 * GitHub - https://github.com/rogerthomas84
 */

/**
 *
 * @param options {{listClass: string, fileElemClass: string, showErrorMessage: boolean, formClass: string, errorMessageTemplate: string, showProgress: boolean, onComplete: onComplete, multiple: boolean, onFileFinished: onFileFinished, accept: string, uploadParams: {}, wrapperClass: string, onStart: onStart, uploadUrl: string, intro: (*|jQuery), highlightClass: string, triggerClass: string, triggerContent: string, progressBarClass: string, errorMessageClass: string}}
 */
$.fn.draggyDroppy = function(options) {
    if (typeof options === 'undefined') {
        options = {};
    }

    /**
     * The default options to use.
     */
    let defaults = {
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
        onFileFinished: function(file, responseData, statusCode, fileListUid){}
    };
    $.extend(defaults, options);

    // The number of finished files (regardless of status)
    let finished = 0;
    // The number of lifetime queued files (regardless of status)
    let queued = 0;

    /**
     * Generate a unique identifier.
     *
     * @returns {string|string}
     */
    let generateIdentifier = function(){
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
        let charactersLength = characters.length;
        for (let i=0;i<32;i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };

    /**
     * Create the draggyDroppy interface.
     *
     * @param opts {{listClass: string, fileElemClass: string, showErrorMessage: boolean, formClass: string, errorMessageTemplate: string, showProgress: boolean, onComplete: onComplete, multiple: boolean, onFileFinished: onFileFinished, accept: string, uploadParams: {}, wrapperClass: string, onStart: onStart, uploadUrl: string, intro: (*|jQuery), highlightClass: string, triggerClass: string, triggerContent: string, progressBarClass: string, errorMessageClass: string}}
     * @returns {*|jQuery}
     */
    let generateHtml = function(opts) {
        let fileId = 'draggyInput' + generateIdentifier();
        let form = $('<form />').addClass(opts.formClass);
        if (opts.intro !== null) {
            form.html(opts.intro);
        }
        form.append(
            $('<input />').attr(
                'type', 'file'
            ).attr(
                'id', fileId
            ).addClass(
                opts.fileElemClass
            ).prop(
                'multiple', opts.multiple
            ).attr(
                'accept', opts.accept
            )
        );
        form.append(
            $('<label />').addClass(opts.triggerClass).attr('for', fileId).html(opts.triggerContent)
        );

        let outer = $('<div />').addClass(opts.wrapperClass).html(form);
        if (opts.showProgress === true) {
            outer.append(
                $('<progress />').addClass(opts.progressBarClass).attr('max', '100').attr('value', '0')
            );
        }
        outer.append(
            $('<div />').addClass(opts.listClass)
        );
        return outer;
    };

    this.html(generateHtml(defaults));

    let dropArea = $('.' + defaults.wrapperClass);
    dropArea.on('dragenter dragover dragleave drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
    });
    $('body').on('dragenter dragover dragleave drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
    });
    dropArea.on('dragenter dragover', function() {
        $(this).addClass(defaults.highlightClass);
    });
    dropArea.on('dragleave', function() {
        $(this).removeClass(defaults.highlightClass);
    });
    dropArea.on('drop', function(e) {
        $(this).removeClass(defaults.highlightClass);
        draggyDropped(e);
    });
    $('.' + defaults.fileElemClass).on('change', function(e) {
        e.preventDefault();
        let files = $(this).prop('files');
        if (files.length > 0) {
            manuallySelected(files);
        }
    });

    /**
     * When manually selected a file (or files) this method is called to process.
     *
     * @param files {File[]}
     */
    function manuallySelected(files) {
        defaults.onStart();
        queued += files.length;
        handleFiles(files)
    }

    /**
     * On dropping files on the target, this is called.
     *
     * @param e {jQuery.Event}
     */
    function draggyDropped(e) {
        defaults.onStart();
        let dt = e.originalEvent.dataTransfer;
        let files = dt.files;
        let nf = [];
        for (let i=0;i<files.length;i++){
            nf.push(files.item(i));
        }
        queued += nf.length;

        handleFiles(nf)
    }

    /**
     * Initialise the progress bar.
     */
    function startProgress() {
        $('.' + defaults.progressBarClass).val(0);
        if (finished > 0) {
            isProgress();
        }
    }

    /**
     * When progress is made (IE a file completed (regardless of status)) this is called.
     */
    function isProgress() {
        let number = (finished/queued)*100;
        $('.' + defaults.progressBarClass).val(number);
        if (finished === queued) {
            defaults.onComplete();
        }
    }

    /**
     * Handle the processing of the file, including creating a list item and calling upload.
     *
     * @param files {File[]}
     */
    function handleFiles(files) {
        if (defaults.showProgress === true) {
            startProgress();
        }
        for (let i=0;i<files.length;i++) {
            let uid = 'draggyListIdentifier' + generateIdentifier();
            uploadFile(files[i], i, uid);
            previewFile(files[i], i, uid);
        }
    }

    /**
     * Add a file to the
     *
     * @param file {File}
     * @param num {int}
     * @param uid {string}
     */
    function previewFile(file, num, uid) {
        $('.' + defaults.listClass).append(
            $('<div />').addClass('draggyItem').html(file.name).attr('data-uid', uid)
        );
    }

    /**
     * Perform the AJAX request to upload this file.
     *
     * @param file {File}
     * @param i {int}
     * @param uid {string}
     */
    function uploadFile(file, i, uid) {
        let url = defaults.uploadUrl;
        let xhr = new XMLHttpRequest();
        let formData = new FormData();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        xhr.addEventListener('readystatechange', function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                finished++;
                if (defaults.showProgress === true) {
                    isProgress();
                }
                $('.draggyItem[data-uid="' + uid + '"]').addClass('draggyItemSuccess');
                defaults.onFileFinished(file, xhr.responseText, xhr.status, uid);
            }
            else if (xhr.readyState === 4 && xhr.status !== 200) {
                finished++;
                if (defaults.showProgress === true) {
                    isProgress();
                }
                let elem = $('.draggyItem[data-uid="' + uid + '"]').addClass('draggyItemError');
                defaults.onFileFinished(file, xhr.responseText, xhr.status, uid);
                if (defaults.showErrorMessage === true) {
                    let errorMessage = defaults.errorMessageTemplate;
                    if (errorMessage.indexOf('%s') !== -1) {
                        errorMessage = errorMessage.replace('%s', xhr.status);
                    }
                    elem.append('<p class="' + defaults.errorMessageClass + '">' + errorMessage + '</span>');
                }
            }
        });

        formData.append('file', file);
        for (let p in defaults.uploadParams) {
            // hasOwnProperty check is to prevent IDE from complaining.
            if (defaults.uploadParams.hasOwnProperty(p)) {
                formData.append(p, defaults.uploadParams[p]);
            }
        }
        xhr.send(formData)
    }
};
