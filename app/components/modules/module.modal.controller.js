;(function () {
  'use strict';

  angular.module('componentsModule')
    .controller('ModuleModalController', ModuleModalController);

  function ModuleModalController($scope,
                                 $uibModalInstance,
                                 lodash,
                                 PagesService,
                                 module,
                                 widgets,
                                 columns) {
    console.log('... ModuleModalController');

    var _ = lodash;

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

      clog('$scope.widget >>>', $scope.widget);
    }

    $scope.redactorOptions = {
      plugins: ['imagencrop', 'audioUpload']
    };

    $scope.imagencropOptions = {
      /**
       * @param redactor
       * @param data
       */
      callback: function (redactor, data) {
        var cropped = function (size, data) {
          var html = _.template($('#figure-' + size).html());

          redactor.selection.restore();
          redactor.insert.raw(html(data));
        };

        var croppedObj = {
          url: data.url,
          legend: data.legend ? data.legend : '',
          author: data.author ? data.author : ''
        };

        cropped(data.type, croppedObj);
      },
      formats: columns == 2 ? ['vertical', 'medium'] : null
    };

    $scope.audioUploadOptions = {
      /**
       * @param redactor
       * @param data
       */
      callback: function (redactor, data) {
        var html = _.template($('#audio').html());

        redactor.selection.restore();
        redactor.insert.raw(html(data));
      }
    };

    $scope.ok = function () {
      var _obj = {
        id: $scope.widget.id || null,
        title: $scope.widget.title || null,
        type: $scope.widget.type
      };

      angular.extend(_obj, $scope.widget);

      clog('OK >>>', _obj);

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
