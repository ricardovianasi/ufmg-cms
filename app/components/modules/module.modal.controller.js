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
        $rootScope,
        RedactorPluginService,
        Util,
        $q,
        $log) {
        $log.info('ModuleModalController');

        var vm = $scope;

        vm.widgets = widgets;
        vm.ok = _ok;
        vm.cancel = _cancel;

        var hasRequest = false;
        var countPage = 1;
        vm.currentElement = 0;

        vm.events = [];
        vm.dataNews = [];
        vm.dataTags = [];
        vm.dataFaq = [];
        vm.dataHighlightednewsvideo = [];
        vm.dataHighlightedrelease = [];
        vm.dataPage = [];

        onInit();

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

                if (module.type === 'listnews') {
                    vm.widget.highlight_ufmg = vm.module.content.highlight_ufmg;
                }
            }

            vm.imagencropOptions = RedactorPluginService.getOptions('imagencrop');

            vm.audioUploadOptions = RedactorPluginService.getOptions('audioUpload');
            vm.uploadfilesOptions = RedactorPluginService.getOptions('uploadfiles');
            vm.preparePartial = PagesService.module().preparePartial;
        }

        vm.loadMoreEvents = function (search) {
            reset(vm.events);
            loadMore('LoadMoreEvents', vm.events, search)
                .then(function (data) {
                    vm.events = Object.assign(vm.events, data);
                });
        };

        vm.loadMoreNews = function (search) {
            reset(vm.dataNews);
            loadMore('LoadMoreNews', vm.dataNews, search)
                .then(function (data) {
                    vm.dataNews = Object.assign(vm.dataNews, data);
                });
        };

        vm.loadMoreTag = function (search) {
            reset(vm.dataTags);
            loadMore('LoadMoreTag', vm.dataTags, search)
                .then(function (data) {
                    vm.dataTags = Object.assign(vm.dataTags, data[0]);
                });
        };

        vm.loadMoreFaq = function (search) {
            reset(vm.dataFaq);
            loadMore('LoadMoreFaq', vm.dataFaq, search)
                .then(function (data) {
                    vm.dataFaq = Object.assign(vm.dataFaq, data);
                });
        };

        vm.loadHighlightednewsvideo = function (search) {
            reset(vm.dataHighlightednewsvideo);
            loadMore('EventHighlightednewsvideo', vm.dataHighlightednewsvideo, search)
                .then(function (data) {
                    vm.dataHighlightednewsvideo = Object.assign(vm.dataHighlightednewsvideo, data);
                });
        };

        vm.loadHighlightedrelease = function (search) {
            reset(vm.dataHighlightedrelease);
            loadMore('EventHighlightedrelease', vm.dataHighlightedrelease, search)
                .then(function (data) {
                    vm.dataHighlightedrelease = Object.assign(vm.dataHighlightedrelease, data);
                });
        };

        vm.loadMorePage = function (search) {
            reset(vm.dataPage);
            loadMore('LoadMorePage', vm.dataPage, search)
                .then(function (data) {
                    vm.dataPage = Object.assign(vm.dataPage, data);
                });
        };

        function reset(data) {
            if (angular.isUndefined(data[0])) {
                countPage = 1;
                vm.currentElement = 0;
            }
        }

        function loadMore(eventMonitor, dataTemp, search) {
            var defer = $q.defer();
            if (search || !hasRequest) {
                if (search) {
                    countPage = 1;
                    dataTemp = [];
                } else {
                    if (countPage === 1) {
                        dataTemp = [];
                    }
                    hasRequest = true;
                }
                Util.event(eventMonitor, {
                    countPage: countPage,
                    hasRequest: hasRequest,
                    data: dataTemp,
                    currentElement: vm.currentElement,
                    search: search
                }).then(function (data) {
                    countPage = data.countPage;
                    hasRequest = data.hasRequest;
                    vm.currentElement = data.currentElement;
                    for (var index = 0; index < data.data.length; index++) {
                        dataTemp.push(data.data[index]);
                    }
                    defer.resolve(dataTemp);
                });
            }
            return defer.promise;
        }

        function _ok() {
            var _obj = {
                id: vm.widget.id || null,
                title: vm.widget.title || null,
                type: vm.widget.type
            };

            angular.extend(_obj, vm.widget);

            $log.info('Widget Selecionado', _obj);
            $uibModalInstance.close(_obj);
            $scope.$destroy();
        }

        function _cancel() {
            $uibModalInstance.dismiss('cancel');
            $scope.$destroy();
        }
    }
})();
