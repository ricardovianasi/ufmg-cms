;(function () {
  'use strict';

  angular.module('componentsModule')
    .controller('ModuleModalController', ModuleModalController);

  function ModuleModalController($scope,
                                 $uibModalInstance,
                                 lodash,
                                 PagesService,
                                 module,
                                 widgets) {
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
    }

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
      formats: ['vertical', 'medium']
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
