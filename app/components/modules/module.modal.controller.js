(function () {
    'use strict';

    angular.module('componentsModule')
        .controller('ModuleModalController', ModuleModalController);
    /** ngInject */
    function ModuleModalController($scope,
        $uibModalInstance,
        PagesService,
        module,
        widgets,
        RedactorPluginService,
        $log) {
        $log.info('ModuleModalController');

        var vm = $scope;

        $log.error(widgets);

        vm.widgets = widgets;
        vm.ok = _ok;
        vm.cancel = _cancel;

        function onInit() {
            vm.widget = {
                selected: {},
                type: '',
                title: ''
            };

            $scope.$watch('widget.selected', function () {
                vm.widget.type = vm.widget.selected.type;
            });

            if (module) {
                vm.module = angular.copy(module);
                vm.widget.id = module.id;
                vm.widget.type = module.type;
                vm.widget.title = module.title;
                vm.widget.selected.type = module.type;

                angular.extend(vm.widget, PagesService.module().parseWidgetToLoad(vm.module));
            }
            vm.imagencropOptions = RedactorPluginService.getOptions('imagencrop');

            vm.audioUploadOptions = RedactorPluginService.getOptions('audioUpload');
            vm.uploadfilesOptions = RedactorPluginService.getOptions('uploadfiles');
            vm.preparePartial = PagesService.module().preparePartial;
        }

        function _ok() {
            var _obj = {
                id: vm.widget.id || null,
                title: vm.widget.title || null,
                type: vm.widget.type
            };

            angular.extend(_obj, vm.widget);

            $log.info(_obj);

            $uibModalInstance.close(_obj);
        }

        function _cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        onInit();
    }
})();
