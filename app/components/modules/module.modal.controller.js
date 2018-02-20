(function () {
    'use strict';

    angular.module('componentsModule')
        .controller('ModuleModalController', ModuleModalController);
    /** ngInject */
    function ModuleModalController($scope, $uibModalInstance, module,
        $rootScope, RedactorPluginService, $timeout, Util, $q, $log, WidgetModuleService, WidgetsService, TagsService) {

        let vm = this;
        let hasRequest = false;
        let countPage = 1;

        vm.ok = ok;
        vm.cancel = cancel;
        vm.isDevelopment = isDevelopment;
        vm.loadMoreEvents = loadMoreEvents;
        vm.loadMoreNews  = loadMoreNews;
        vm.loadMoreTag = loadMoreTag;
        vm.loadMoreFaq = loadMoreFaq;
        vm.loadHighlightednewsvideo = loadHighlightednewsvideo;
        vm.loadHighlightedrelease = loadHighlightedrelease;
        vm.loadMorePage = loadMorePage;
        vm.onWidgetSelected = onWidgetSelected;
        vm.canInsert = canInsert;
        vm.getPathPartial = getPathPartial;
        vm.preparePartial = preparePartial;

        activate();

        function onWidgetSelected(item){
            vm.widget.type = item.type;
        }

        function canInsert() {
            return vm.widget.title !== '' && angular.isDefined(vm.widget.type);
        }

        function getPathPartial() {
            return 'components/modal/widget-partials/' + vm.widget.type + '/' + vm.widget.type + '.html';
        }

        function ok() {
            let _obj = {
                id: vm.widget.id || null,
                title: vm.widget.title || null,
                type: vm.widget.type
            };

            angular.extend(_obj, vm.widget);

            $log.info('Widget Selecionado', _obj);
            $uibModalInstance.close(_obj);
            $scope.$destroy();
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
            $scope.$destroy();
        }

        function isDevelopment() {
            let index = vm.widgetsInDevelopment.findIndex(function(typeInDev) { return typeInDev === vm.widget.type; });
            return index >= 0;
        }

        function loadMoreEvents(search) {
            _reset(vm.events);
            _loadMore('LoadMoreEvents', vm.events, search)
                .then(function (data) {
                    vm.events = Object.assign(vm.events, data);
                });
        }

        function loadMoreNews(search) {
            _reset(vm.dataNews);
            _loadMore('LoadMoreNews', vm.dataNews, search)
                .then(function (data) {
                    vm.dataNews = Object.assign(vm.dataNews, data);
                });
        }

        function loadMoreTag(search) {
            if(!search || search.length <= 3){
                return;
            }
            let params = {
                search: search,
                direction: 'ASC'
            };
            TagsService.getTagsWithParams(params)
                .then(function (data) {
                    vm.dataTags = data.data.items[0];
                    console.log(vm.dataTags);
                });
            // _reset(vm.dataTags);
            // _loadMore('LoadMoreTag', vm.dataTags, search)
            //     .then(function (data) {
            //         vm.dataTags = Object.assign(vm.dataTags, data[0]);
            //     });
        }

        function loadMoreFaq(search) {
            _reset(vm.dataFaq);
            _loadMore('LoadMoreFaq', vm.dataFaq, search)
                .then(function (data) {
                    vm.dataFaq = Object.assign(vm.dataFaq, data);
                });
        }

        function loadHighlightednewsvideo(search) {
            _reset(vm.dataHighlightednewsvideo);
            _loadMore('EventHighlightednewsvideo', vm.dataHighlightednewsvideo, search)
                .then(function (data) {
                    vm.dataHighlightednewsvideo = Object.assign(vm.dataHighlightednewsvideo, data);
                });
        }

        function loadHighlightedrelease(search) {
            _reset(vm.dataHighlightedrelease);
            _loadMore('EventHighlightedrelease', vm.dataHighlightedrelease, search)
                .then(function (data) {
                    vm.dataHighlightedrelease = Object.assign(vm.dataHighlightedrelease, data);
                });
        }

        function loadMorePage(search) {
            _reset(vm.dataPage);
            _loadMore('LoadMorePage', vm.dataPage, search)
                .then(function (data) {
                    vm.dataPage = Object.assign(vm.dataPage, data);
                });
        }

        function _reset(data) {
            if (angular.isUndefined(data[0])) {
                countPage = 1;
                vm.currentElement = 0;
            }
        }

        function _loadMore(eventMonitor, dataTemp, search) {
            let defer = $q.defer();
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

        function _loadModule() {
            if (module) {
                vm.module = angular.copy(module);
                vm.widget.id = module.id;
                vm.widget.type = module.type;
                vm.widget.title = module.title;
                vm.widget.selected.type = module.type;

                angular.extend(vm.widget, WidgetModuleService.getWidget(vm.widget.type).parseToLoad(vm.module));

                $timeout(function () {
                        var html = $.parseHTML(vm.widget.text);
                        $('#redactor-only').append(html);
                    }, 300);
            }
        }

        function preparePartial(scope) {
            let currentWidget = scope.$parent.ctrlModal.widget;
            if (WidgetModuleService.getWidget(currentWidget.type)) {
                WidgetModuleService.getWidget(currentWidget.type).load(scope.$parent.ctrlModal, scope.$parent);
            }
        }

        function _initRedactorOptions() {
            vm.imagencropOptions = RedactorPluginService.getOptions('imagencrop');
            vm.audiouploadOptions = RedactorPluginService.getOptions('audioUpload');
            vm.uploadfilesOptions = RedactorPluginService.getOptions('uploadfiles');
        }

        function _initProps() {
            vm.widgetsInDevelopment = ['mainhighlight', 'comhub', 'comservice', 'comlastedition', 'contactform',
                'instagramlastimage', 'lasttvprograms', 'relatedevents', 'comradiovideo', 'contactcard', 'rector',
                'eventcalendar', 'gridgallery', 'highlightedrelease'];
            vm.currentElement = 0;
            vm.widget = { selected: {}, type: undefined, title: '' };

            vm.events = [];
            vm.dataNews = [];
            vm.dataTags = [];
            vm.dataFaq = [];
            vm.dataHighlightednewsvideo = [];
            vm.dataHighlightedrelease = [];
            vm.dataPage = [];
        }

        function _loadListWidgets() {
            vm.loadingWidgets = true;
            WidgetsService.getWidgets()
                .then(function(data) { vm.widgets = data.data; })
                .catch(function(error) { console.error(error); })
                .then(function() { vm.loadingWidgets = false; });
        }

        function activate() {
            _loadListWidgets();
            _initProps();
            _loadModule();
            _initRedactorOptions();
        }
    }
})();
