(function ($) {
  $.Redactor.prototype.uploadFiles = function () {
    return {
      langs: {
        en: {
          'modalTitle': 'Upload files',
          'description': 'Insert files'
        },
        pt_br: {
          'modalTitle': 'Ainda estamos trabalhando nesse componente.',
          'description': 'upload de arquivos'
        }
      },
      getTemplate: function () {
        return '<div class="modal-section" id="redactor-modal-uploadFiles-insert">'
            + '<section>'
              + '<label>OPS.. Ainda estamos Trabalhando nesse componente.</label>'
            + '</section>'
            + '<section>'
              + '<button id="redactor-modal-button-cancel">OK</button>'
            + '</section>'
          + '</div>';
      },
      init: function () {
        var button = this.button.add('uploadFiles', this.lang.get('modalTitle'));
        this.button.setIcon(button, '<i class="fa-file-code-o"></i>');
        this.button.addCallback(button, this.uploadFiles.show);
      },
      show: function () {
        this.modal.addTemplate('uploadFiles', this.uploadFiles.getTemplate());
        this.modal.load('uploadFiles', this.lang.get('modalTitle'), 700);
        // // action button
        this.modal.show();

        // // focus
        // if (this.detect.isDesktop())
        // {
        //  setTimeout(function()
        //  {
        //    $('#redactor-insert-video-area').focus();

        //  }, 1);
        // }
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
