(function ($) {
  $.Redactor.prototype.uploadfiles = function () {
    return {
      langs: {
        en: {
          modalTitleFiles: 'Upload files',
          descriptionFiles: 'Insert files'
        },
        pt_br: {
          modalTitleFiles: 'Upload files',
          descriptionFiles: 'upload de arquivos'
        }
      },
      /**
       * this function return files modal html structure
       *
       * @returns {string} modal html structure
       */
      getTemplate: function () {
        return String()
          + '<div class="modal-section" id="redactor-modal-uploadfiles-insert">'
            + '<section>'
              + '<label>OPS.. Ainda estamos Trabalhando nesse componente.</label>'
            + '</section>'

            + '<section>'
              + '<button id="redactor-modal-button-cancel">OK</button>'
            + '</section>'
          + '</div>';
      },
      init: function () {
        var button = this.button.add('uploadfiles', this.lang.get('modalTitleFiles'));

        this.button.setIcon(button, '<i class="fa-file-code-o"></i>');
        this.button.addCallback(button, this.uploadfiles.show);
      },
      show: function () {
        this.modal.addTemplate('uploadfiles', this.uploadfiles.getTemplate());
        this.modal.load('uploadfiles', this.lang.get('modalTitleFiles'), 700);
        this.modal.show();
      },
      insert: function () {
        var data = $('#redactor-insert-video-area').val();

        if (!data.match(/<iframe|<video/gi)) {
          data = this.clean.stripTags(data);

          this.opts.videoContainerClass = (typeof this.opts.videoContainerClass === 'undefined') ? 'video-container' : this.opts.videoContainerClass;

          // parse if it is link on youtube & vimeo
          var iframeStart = String()
            +'<div class="' + this.opts.videoContainerClass + '">'
              +'<iframe src="';
          var iframeEnd = String()
                +'" frameborder="0" allowfullscreen>'
              +'</iframe>'
            +'</div>';

          if (data.match(this.video.reUrlYoutube)) {
            data = data.replace(this.video.reUrlYoutube, iframeStart + '//www.youtube.com/embed/$1' + iframeEnd);
          } else if (data.match(this.video.reUrlVimeo)) {
            data = data.replace(this.video.reUrlVimeo, iframeStart + '//player.vimeo.com/video/$2' + iframeEnd);
          }
        }

        this.modal.close();
        // this.placeholder.hide();
        // buffer
        this.buffer.set();
        // insert
        this.air.collapsed();
        this.insert.html(data);
      }
    };
  };
})(jQuery);
