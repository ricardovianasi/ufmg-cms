(function () {
    'use strict';

    angular
        .module('pagesModule')
        .controller('PagesEditController', PagesEditController);

    /** ngInject */
    function PagesEditController($scope, $uibModal, $location, $routeParams, $timeout, $window, NotificationService,
        PagesService, ManagerFileService, WidgetsService, StatusService, DateTimeHelper, $q, ModalService,
        $rootScope, TagsService, validationService, Util, HandleChangeService, PermissionService, PermissionPageService) {

        let vm = $scope;

        let hasRequest = false;
        let countPage = 1;

        vm.pagesParent = [];
        vm.typesData = {};

        vm.loadMorePage = loadMorePage;
        vm.remove = remove;
        vm.publish = publish;
        vm.uploadCover = uploadCover;
        vm.removeImage = removeImage;

        activate();

        function _hasLoaded(oldValue) {
            return angular.isDefined(oldValue.id);
        }

        function _evenedObj(obj) {
            obj = HandleChangeService.removePropsCommon(obj);
            obj.tags = _evenedTag(obj.tags, 'text');
            obj.widgets.main = _evenedTagWidget(obj.widgets.main);
            obj.widgets.side = _evenedTagWidget(obj.widgets.side);
            return obj;
        }

        function _evenedTag(tags, label) {
            if(!tags) {
                return '';
            }
            if(tags.length) {
                return tags.map(function(tag) { return tag[label] ? tag[label] : tag; } );
            } else {
                return tags[label] ? [tags[label]] : [tags];
            }
        }

        function _evenedTagWidget(widgets) {
            if(widgets && widgets.length) {
                return widgets.map(function(widget) {
                    if(widget.tag) {
                        widget.tag = widget.tag.id ? 
                            _evenedTag(widget.content.tag, 'name') : _evenedTag(widget.tag, 'text');
                    } else if (widget.content && widget.content.tag) {
                        widget.tag = _evenedTag(widget.content.tag, 'name');
                    }
                    return widget;
                });
            } else {
                return [];
            }
        }

        function _getType() {
            PagesService.getType()
                .then(function (res) {
                    vm.typesData = res.data;
                });
        }

        function _loadMore(dataTemp, search) {
            var defer = $q.defer();
            var searchQuery = 'title';
            if (search || !hasRequest) {
                if (search) {
                    countPage = 1;
                    dataTemp = [];
                    dataTemp[0] = {
                        id: null,
                        title: '- Página Normal -'
                    };
                } else {
                    if (countPage === 1) {
                        dataTemp = [];
                        dataTemp[0] = {
                            id: null,
                            title: '- Página Normal -'
                        };
                    }
                    hasRequest = true;
                }
                var params = {
                    page: countPage,
                    page_size: 10,
                    order_by: {
                        field: 'title',
                        direction: 'ASC'
                    },
                    search: search
                };
                if (!params.search && countPage === 1) {
                    vm.currentElement = 0;
                }
                PagesService
                    .getPages(Util.getParams(params, searchQuery), true)
                    .then(function (res) {
                        countPage++;
                        vm.currentElement += res.data.items.length;
                        if (res.data.total > vm.currentElement && 10 >= res.data.items.length) {
                            $timeout(function () {
                                hasRequest = false;
                            }, 100);
                        }
                        for (var index = 0; index < res.data.items.length; index++) {
                            dataTemp.push(res.data.items[index]);
                        }
                        defer.resolve(dataTemp);
                    });
            }
            return defer.promise;
        }

        function loadMorePage(search) {
            _reset(vm.pagesParent);
            _loadMore(vm.pagesParent, search)
                .then(function (data) {
                    vm.pagesParent = Object.assign(vm.pagesParent, data);
                });
        }

        function _reset(data) {
            if (angular.isUndefined(data[0])) {
                countPage = 1;
                vm.currentElement = 0;
            }
        }

        function remove() {
            let msgModal = 'Você deseja excluir a página <b>' + vm.page.title + '</b>?';
            ModalService.confirm(msgModal, ModalService.MODAL_MEDIUM, { isDanger: true })
                .result.then(function () {
                    _removePage($routeParams.id);
                });
        }

        function _removePage(id) {
            PagesService.removePage(id)
                .then(function () {
                    NotificationService.success('Página removida com sucesso.');
                    $location.path('/page');
                });
        }

        function _handleWidgetsToSave(page) {
            let widgets = {
                main: WidgetsService.parseListWidgetsToSave(page.widgets.main),
                side: WidgetsService.parseListWidgetsToSave(page.widgets.side)
            };
            return widgets;
        }

        function publish(page) {
            if (!validationService.isValid(vm.formData.$invalid)) {
                return false;
            }
            vm.isLoading = true;
            page.widgetsSave = _handleWidgetsToSave(page);
            PagesService
                .updatePage($routeParams.id, page)
                .then(function () {
                    NotificationService.success('Página atualizada com sucesso.');
                })
                .catch(function(error) {console.error(error);})
                .then(function() {vm.isLoading = false;});

        }

        function uploadCover() {
            ManagerFileService
                .imageFiles()
                .open('pageCover')
                .then(function (image) {
                    vm.page.image = {
                        url: image.url,
                        id: image.id
                    };
                });
        }

        function removeImage() {
            $timeout(function () {
                vm.page.image = '';
                vm.$apply();
            });
        }

        function _getPage() {
            PagesService
                .getPage(parseInt($routeParams.id))
                .then(function (data) {
                    let page = data.data;
                    let tags = page.tags;
                    
                    vm.title = page.title;
                    vm.breadcrumb_active = page.title;
                    page.tags = TagsService.convertTagsInput(tags);
                    page.columns = !page.widgets.side.length ? 1 : 2;
                    page.scheduled_date = moment(page.post_date).format('DD/MM/YYYY');
                    page.scheduled_time = moment(page.post_date).format('hh:mm');
                    angular.extend(vm.page, page);
                    _loadPermission();
                    $scope.$broadcast('objPublishLoaded');
                });
        }

        function _loadPermission() {
            vm.isSuperPut = true;
            PermissionPageService.canTotal('PUT', 'posts').then(function(canTotal) {
                if(canTotal) {
                    vm.configPerm = PermissionPageService.setConfigPermission({ isPost: true, isAdmin: true, 
                        permissions: { putTag: true, putSuper: true } })
                    return;
                }
                if(PermissionPageService.isAuthor(vm.page)) { 
                    _setPermissionPostModules();
                    return;
                 }
                _setPermissionPutSpecial();
            });
        }

        function _setPermissionPutSpecial() {
            PermissionPageService.getPutSpecialByIdPage(vm.page.id)
                .then(function (perm) {
                    const isDefinedPermissions = angular.isDefined(perm.permissions);
                    const hasModuleToHandle = Object.keys(perm.modules || []).reduce(function (result, key) {
                        return perm.modules[key].permissions.put || perm.modules[key].permissions.post;
                    }, false);
                    vm.viewOnly = !isDefinedPermissions || 
                        (!perm.permissions.putSuper && !perm.permissions.putTag && !hasModuleToHandle);
                    vm.isSuperPut = isDefinedPermissions ? perm.permissions.putSuper : false;
                    vm.configPerm = perm;
                });
        }

        function _setPermissionPostModules() {
            PermissionPageService.getPostModules({getAsList: true}).then(function(postModules) {
                let modules = postModules && !postModules.noPrivilege ? postModules : [];
                vm.configPerm = PermissionPageService.setConfigPermission(
                    { isPost: true, isAdmin: !!postModules.isTotal,
                        permissions: { putTag: true, putSuper: true }, modules: modules }
                );
            });
        }

        function activate() {
            vm.title = 'Edição de página';
            vm.columns = PagesService.COLUMNS;
            vm.idPage = $routeParams.id;
            vm.isEdit = angular.isDefined(vm.idPage);

            vm.page = {
                image: null,
                status: StatusService.STATUS_PUBLISHED,
                columns: 2,
                tags: [],
                parent: null,
                title: null,
                widgets: {
                    main: [],
                    side: []
                }
            };
            vm.sortableOptions = {
                accept: function (sourceItemHandleScope, destSortableScope) {
                    return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
                },
                containment: '#sort-main'
            };
            _getPage();
            _getType();
            HandleChangeService.registerHandleChange('/page/', ['PUT', 'DELETE'], $scope, ['page'], _evenedObj, _hasLoaded);
        }

    }
})();
