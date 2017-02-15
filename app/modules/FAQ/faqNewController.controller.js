(function () {
    'use strict';

    angular.module('faqModule')
        .controller('faqNewController', faqNewController);

    function faqNewController($rootScope,
        faqService,
        VIEWER,
        NotificationService,
        $location,
        $routeParams,
        $route,
        $log,
        PermissionService,
        $scope) {

        /* jshint ignore:start */
        var vm = this;
        /* jshint ignore:end */

        $rootScope.shownavbar = true;
        $log.info('faNewController');

        var id = $routeParams.faqId;

        vm.idCurrentAskEdit = '';
        vm.idCurrentCategoryEdit = '';
        vm.showCategoryAsk = false;
        vm.showAsk = false;
        vm.faq = {
            items: [],
            categories: []
        };


        vm.currentNewCategoryAsk = {
            title: '',
            items: []
        };

        $scope.sortableOptions = {
            accept: function (sourceItemHandleScope, destSortableScope) {
                return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
            },
            containment: '#sort-main'
        };

        vm.showType = _showType;
        vm.addAsk = _addAsk;
        vm.controlFormView = _controlFormView;
        vm.save = _save;
        vm.removeAsk = _removeAsk;
        vm.addCategoryAsk = _addCategoryAsk;
        vm.removeFaqCategoryAsk = _removeFaqCategoryAsk;
        vm.editCategory = _editCategory;
        vm.editCategoryAsk = _editCategoryAsk;
        vm.editAsk = _editAsk;

        _permissions();

        function _permissions() {
            if (VIEWER) {
                vm.canPost = false;
                vm.canPut = false;
                vm.canDelete = false;
            } else {
                vm.canPost = PermissionService.canPost('faq');
                vm.canPut = PermissionService.canPut('faq', id);
                vm.canDelete = PermissionService.canDelete('faq');
            }
        }

        function _getFaq() {
            if (id) {
                faqService.get(id).then(function (data) {
                    vm.faq = data.data;
                    vm.faq.categories = [];

                    var ids = [];

                    angular.forEach(data.data.items, function (v, k) {
                        if (data.data.items[k].children.length > 0) {
                            vm.faq.categories.push({
                                name: data.data.items[k].question,
                                items: data.data.items[k].children
                            });

                            ids.push(k);

                        }
                    });

                    angular.forEach(ids, function (v, k) {
                        if (ids[k] === 0) {
                            data.data.items.splice(ids[k]);
                        } else {
                            data.data.items.splice(ids[k], 1);
                        }
                    });

                    if (vm.faq.categories.length < 1)
                        _showType('ask');
                    else
                        _showType('');
                });
            }
        }

        _getFaq();

        function _showType(type) {
            if (type == 'ask') {
                vm.showCategoryAsk = false;
                vm.showAsk = true;
            } else {
                vm.showCategoryAsk = true;
                vm.showAsk = false;
            }

            vm.showNewAskForm = true;
        }

        function _addAsk(type, ask) {
            if (type === 'ask') {

                if (vm.idCurrentAskEdit === '') {
                    vm.faq.items.push(ask);
                } else {
                    vm.faq.items.splice(vm.idCurrentAskEdit, 0, ask);
                }

                vm.idCurrentAskEdit = '';
                _controlFormView(false);

            } else if (type === '' && vm.idCurrentAskEdit === '') {
                vm.currentNewCategoryAsk.items.push(ask);
            } else {
                vm.currentNewCategoryAsk.items.splice(vm.idCurrentAskEdit, 0, ask);
            }

            _cleanNewAsk();
        }

        function _controlFormView(defaultAction) {
            if (defaultAction) {
                vm.showNewAskForm = false;
                vm.showAddAsk = true;
            } else {
                vm.showNewAskForm = true;
                vm.showAddAsk = false;
            }
        }

        function _cleanNewAsk() {
            vm.newAsk = {
                question: '',
                answer: ''
            };
        }

        function _save() {
            _verifyType();

            if (id) {
                faqService.update(vm.faq).then(function (data) {
                    $route.reload();
                    _getFaq();
                    NotificationService.success('FAQ alterado com sucesso!');
                });
            } else {
                faqService.save(vm.faq).then(function (data) {
                    $location.path('/faq/edit/' + data.data.id);
                    NotificationService.success('FAQ salvo com sucesso!');
                });
            }

        }

        function _removeAsk(type, idx) {
            if (type === 'ask')
                vm.faq.items.splice(idx, 1);
            else if (type === 'category')
                vm.faq.categories.splice(idx, 1);
            else
                vm.currentNewCategoryAsk.items.splice(idx, 1);
        }

        function _addCategoryAsk() {

            if (vm.idCurrentCategoryEdit === '') {
                vm.faq.categories.push(vm.currentNewCategoryAsk);
            } else {
                vm.faq.categories.splice(vm.idCurrentCategoryEdit, 0, vm.currentNewCategoryAsk);
            }

            vm.idCurrentCategoryEdit = '';
            _cleanCurrentNewCategoryAsk();
            _controlFormView(true);
        }

        function _cleanCurrentNewCategoryAsk() {
            vm.currentNewCategoryAsk = {
                title: '',
                items: []
            };
        }

        function _verifyType() {
            if (vm.showCategoryAsk) {
                vm.faq.items = [];
            } else {
                vm.faq.categories = [];
            }
        }

        function _removeFaqCategoryAsk(parentIdx, idx) {
            vm.faq.categories[parentIdx].items.splice(idx, 1);
        }

        function _removeFaqCategory(id) {
            vm.faq.categories.splice(id, 1);
        }

        function _removeFaqCategoryAskEdit(id) {
            vm.currentNewCategoryAsk.items.splice(id, 1);
        }

        function _removeforEditAsk(id) {
            vm.faq.items.splice(id, 1);
        }

        function _editCategory(id) {
            vm.idCurrentCategoryEdit = id;
            vm.currentNewCategoryAsk = (JSON.parse(JSON.stringify(vm.faq.categories[id])));
            _removeFaqCategory(id);
            _controlFormView(false);
        }

        function _editCategoryAsk(id) {
            vm.idCurrentAskEdit = id;
            vm.newAsk = vm.currentNewCategoryAsk.items[id];
            _removeFaqCategoryAskEdit(id);
        }

        function _editAsk(id) {
            vm.idCurrentAskEdit = id;
            vm.newAsk = (JSON.parse(JSON.stringify(vm.faq.items[id])));
            _removeforEditAsk(id);
            _controlFormView(false);
        }
    }
})();
