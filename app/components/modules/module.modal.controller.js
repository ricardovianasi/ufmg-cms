;(function () {
  'use strict';

  angular.module('componentsModule')
    .controller('ModuleModalController', ModuleModalController);

  function ModuleModalController($scope,
                                 $uibModal,
                                 $uibModalInstance,
                                 PagesService,
                                 module,
                                 widgets) {
    console.log('... ModuleModalController');

    $scope.widgets = widgets;
    $scope.widget = {
      selected: {},
      type: '',
      title: ''
    };

    $scope.$watch('widget.selected', function () {
      $scope.widget.type = $scope.widget.selected.type;
    });

    if (module) {
      $scope.module = angular.copy(module);
      $scope.widget.id = module.id;
      $scope.widget.type = module.type;
      $scope.widget.title = module.title;
      $scope.widget.selected.type = module.type;

      angular.extend($scope.widget, PagesService.module().parseWidgetToLoad($scope.module));
    }

    var moduleModal;

    jQuery.Redactor.prototype.imagencrop = function () {
      return {
        init: function () {
          var button = this.button.add('imagencrop', 'Image-N-Crop');

          this.button.addCallback(button, this.imagencrop.show);
          this.button.setAwesome('imagencrop', 'fa-picture-o');
        },
        showEdit: function ($image) {
          console.log('show edit', $image);
        },
        show: function () {
          var _this = this;

          _this.selection.save();
          moduleModal = $uibModal.open({
            templateUrl: '/components/modal/upload-component.template.html',
            controller: 'UploadComponentController as vm',
            backdrop: 'static',
            size: 'xl'
          });

          // Insert into textarea
          moduleModal.result.then(function (data) {
            var cropped = {
              vertical: function (data) {
                var html = '&nbsp;<figure class="vertical"><img src="' + data.url + '" title="' + data.author + '" alt="' + data.legend + '"><figcaption>' + data.legend + '</figcaption></figure><br><p></p>';
                _this.selection.restore();
                _this.insert.htmlWithoutClean(html);
              },
              medium: function (data) {
                var html = '&nbsp;<figure class="medium"><img src="' + data.url + '" title="' + data.author + '" alt="' + data.legend + '"><figcaption>' + data.legend + '</figcaption></figure><br><p></p>';
                _this.selection.restore();
                _this.insert.htmlWithoutClean(html);
              },
              big: function (data) {
                var html = '&nbsp;<section class="snippet snippet--big"><figure class="big"><img src="' + data.url + '" title="' + data.author + '" alt="' + data.legend + '"><figcaption>' + data.legend + '</figcaption></figure></section><br><p></p>';
                _this.selection.restore();
                _this.insert.htmlWithoutClean(html);
              },
              wide: function (data) {
                var html = '&nbsp;<section class="snippet snippet--wide"><figure class="wide"><img src="' + data.url + '" title="' + data.author + '" alt="' + data.legend + '"><figcaption>' + data.legend + '</figcaption></figure></section><br><p></p>';
                _this.selection.restore();
                _this.insert.htmlWithoutClean(html);
              }
            };

            var croppedObj = {
              url: data.url,
              legend: data.legend ? data.legend : '',
              author: data.author ? data.author : ''
            };

            if (data.type == 'vertical') {
              cropped.vertical(croppedObj);
            } else if (data.type == 'medium') {
              cropped.medium(croppedObj);
            } else if (data.type == 'big') {
              cropped.big(croppedObj);
            } else if (data.type == 'wide') {
              cropped.wide(croppedObj);
            }
          });
        }
      };
    };

    $scope.redactorConfig = {
      lang: 'pt_br',
      replaceDivs: false,
      plugins: ['imagencrop'],
      paragraphize: false,
      linebreaks: false,
      formatting: ['p', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5'],
      buttons: [
        'html',
        'formatting',
        'bold',
        'italic',
        'deleted',
        'unorderedlist',
        'orderedlist',
        'outdent',
        'indent',
        'image',
        'file',
        'link',
        'alignment',
        'horizontalrule',
        'imagencrop'
      ],
      allowedAttr: [
        ['section', 'class'],
        ['div', 'class'],
        ['img', ['src', 'alt', 'title']],
        ['figure', 'class'],
        ['a', ['href', 'title']]
      ]
    };

    $scope.ok = function () {
      var _obj = {
        id: $scope.widget.id || null,
        title: $scope.widget.title || null,
        type: $scope.widget.type
      };

      angular.extend(_obj, $scope.widget);

      console.log('>>> ok', _obj);

      $uibModalInstance.close(_obj);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.preparePartial = function () {
      PagesService.module().preparePartial($scope);
    };
  }
})();
