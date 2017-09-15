(function () {
    'use strict';

    angular.module('periodicalModule')
        .controller('PeriodicalEditController', PeriodicalEditController);

    /** ngInject */
    function PeriodicalEditController(
        $scope,
        $routeParams,
        $location,
        $filter,
        PermissionService,
        PeriodicalService,
        StatusService,
        NotificationService,
        MediaService,
        DateTimeHelper,
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
        vm.date_formats = [];

        vm.removeImage = _removeImage;
        vm.publish = _publish;
        vm.upload = _upload;

        onInit();

        function onInit() {
            $log.info('PeriodicalEditController');
            getPeriodicals();
            setDateFormats();
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

        function getPeriodicals() {
            PeriodicalService
                .getPeriodicals($routeParams.id)
                .then(function (data) {
                    vm.canPermission = PermissionService.canPut('periodical', $routeParams.id);
                    vm.periodical.id = data.data.id;
                    vm.periodical.name = data.data.name;
                    vm.periodical.logo = data.data.logo ? data.data.logo.id : '';
                    vm.periodical.url = data.data.logo ? data.data.logo.url : '';
                    vm.periodical.identifier = data.data.identifier;
                    vm.periodical.date = DateTimeHelper.dateToStr(data.data.date);
                    vm.periodical.date_format = data.data.date_format;
                    vm.periodical.status = data.data.status;

                    var scheduled_at = DateTimeHelper.toBrStandard(data.data.scheduled_at, true, true);

                    if (scheduled_at) {
                        vm.periodical.scheduled_date = scheduled_at.date;
                        vm.periodical.scheduled_time = scheduled_at.time;
                    }
                });
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


        function _removeImage() {
            vm.periodical.logo = '';
            vm.periodical.url = '';
        }

        function _publish(data) {
            if (!validationService.isValid(vm.formPeriodicals.$invalid)) {
                return false;
            }

            var _data = angular.copy(data);

            _data.scheduled_at = data.scheduled_date + ' ' + data.scheduled_time;

            delete _data.url;
            delete _data.scheduled_date;
            delete _data.scheduled_time;

            PeriodicalService
                .updatePeriodical($routeParams.id, _data)
                .then(function () {
                    NotificationService.success('Publicação atualizada com sucesso.');
                    $location.path('/periodical');
                });
        }
    }
})();
