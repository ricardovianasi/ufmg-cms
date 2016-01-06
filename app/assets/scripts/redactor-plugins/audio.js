(function($)
{
  $.Redactor.prototype.audio = function()
  {
    return {
       langs: {
        en: {
          "modalTitle": "Soundcloud",
          "description": "insert soundcloud link"
        }
      },
      getTemplate: function()
      {
        return String()
        + '<div class="modal-section" id="redactor-modal-audio-insert">'
          + '<section>'
            + '<label>' + this.lang.get('description') + '</label>'
            + '<input id="soundCloudLink" style="width: 100%;">'
          + '</section>'
          + '<section>'
            + '<button id="redactor-modal-button-action">Insert</button>'
            + '<button id="redactor-modal-button-cancel">Cancel</button>'
          + '</section>'
        + '</div>';
      },
      getSettings: {
        CLIENT_ID: 'b938f7d89a1136a2290545587e03e980',
        RESOLVE_URL: 'https://api.soundcloud.com/resolve.json'
      },
      getPlayer: function(uri){
        return '<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=' + uri + '&amp;color=ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false"></iframe>';
      },
      init: function()
      {
        var button = this.button.add('soundcloud', this.lang.get('title'));
        this.button.addCallback(button, this.audio.show);
        this.button.setIcon(button, '<i class="fa fa-soundcloud"></i>');
      },
      show: function()
      {
        this.modal.addTemplate('audio', this.audio.getTemplate());

        this.modal.load('audio', this.lang.get('modalTitle'), 700);

        // action button
        this.modal.getActionButton().text(this.lang.get('insert')).on('click', this.audio.insert);
        this.modal.show();

      },
      insert: function()
      {
        var url = this.audio.getSettings.RESOLVE_URL;
        var client_id = this.audio.getSettings.CLIENT_ID;
        var soundCloudLink = $('#soundCloudLink').val();

        $.ajax({
          method: "GET",
          url: url,
          data: { url: soundCloudLink, client_id: client_id }
        }).done(function( res ) {
          console.log( res );

          var data = this.audio.getPlayer(res.uri);
          this.modal.close();
          // this.placeholder.hide();

          // buffer
          this.buffer.set();

          // insert
          this.air.collapsed();
          this.insert.html(data);
        });



      }

    };
  };
})(jQuery);
