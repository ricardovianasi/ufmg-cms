(function () {
    'use strict';

    angular.module('periodicalModule')
        .controller('PeriodicalNewController', PeriodicalNewController);

    /** ngInject */
    function PeriodicalNewController(
        $scope,
        $location,
        $filter,
        PeriodicalService,
        StatusService,
        NotificationService,
        MediaService,
        PermissionService,
        $rootScope,
        validationService,
        ManagerFileService,
        $log
    ) {

        var vm = $scope;
        var date = new Date();

        vm.status = [];
        vm.periodical = {};
        vm.highlight_ufmg_visible = false;
        vm.canPermission = {};
        vm.date_formats = [];

        vm.removeImage = _removeImage;
        vm.publish = _publish;
        vm.upload = _upload;

        onInit();

        function onInit() {
            $log.info('PeriodicalNewController');
            vm.canPermission = PermissionService.canPost('periodical');
            setDateFormats();
        }

        function setDateFormats() {
            vm.date_formats = [{
                label: $filter('format')('ano ({0})', date.getFullYear()),
                format: 'Y'
            }, {
                label: $filter('format')('mês/ano ({0}/{1})', date.getMonth() + 1, date.getFullYear()),
                format: 'm/Y'
            }, {
                label: $filter('format')(
                    'dia/mês/ano ({0}/{1}/{2})',
                    date.getDate(),
                    date.getMonth() + 1,
                    date.getFullYear()
                ),
                format: 'd/m/Y'
            }];
        }

        function _upload() {
            ManagerFileService
                .imageFiles()
                .open(['logo', 'free'])
                .then(function (image) {
                    vm.periodical.url = image.url;
                    vm.periodical.logo = image.id;
                });
        }

        function _removeImage() {
            vm.periodical.logo = '';
            vm.periodical.url = '';
        }

        function _publish(data) {
            if (!validationService.isValid(vm.formPeriodicals.$invalid)) {
                return false;
            }

            var _data = angular.copy(data);

            delete _data.url;
            vm.isLoading = true;
            PeriodicalService
                .newPeriodical(_data)
                .then(function () {
                    NotificationService.success('Publicação criada com sucesso.');
                    $location.path('/periodical');
                })
                .catch(console.error)
                .then(function() {
                    vm.isLoading = false;
                });
        }
    }
})();
