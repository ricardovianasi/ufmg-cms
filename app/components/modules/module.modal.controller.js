;(function () {
  'use strict';

  angular.module('componentsModule')
    .controller('ModuleModalController', ModuleModalController);

  /**
   * @param $scope
   * @param $uibModalInstance
   * @param PagesService
   * @param module
   * @param widgets
   * @param RedactorPluginService
   *
   * @constructor
   */
  function ModuleModalController($scope,
                                 $uibModalInstance,
                                 PagesService,
                                 module,
                                 widgets,
                                 RedactorPluginService) {
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

    $scope.imagencropOptions = RedactorPluginService.getOptions('imagencrop');

    $scope.audioUploadOptions = RedactorPluginService.getOptions('audioUpload');
    $scope.uploadfilesOptions = RedactorPluginService.getOptions('uploadfiles');

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

    $scope.preparePartial = PagesService.module().preparePartial;
  }
})();
