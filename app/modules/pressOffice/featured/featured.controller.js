(function () {
    'use strict';

    angular
        .module('featuredModule')
        .controller('featuredController', featuredNewController);

    /** ngInject */
    function featuredNewController(featuredService,
        PermissionService,
        DateTimeHelper,
        dataTableConfigService,
        $filter,
        $uibModal,
        $scope,
        NotificationService,
        $location,
        $route,
        $rootScope) {
        $rootScope.shownavbar = true;

        var vm = this; // jshint ignore:line
        vm.DateTimeHelper = DateTimeHelper;
        vm.remove = _remove;
        vm.highlights = [];


        loadHighlights();

        function loadHighlights() {
            featuredService.get().then(function (res) {
                    vm.highlights = res.data || {};
                    vm.dtOptions = dataTableConfigService.init();
                    _permissions();
                },
                function (err) {
                    vm.dtOptions = dataTableConfigService.init();
                });

        }

        // Confirmation to remove
        var removeConfirmationModal;

        var ConfirmationModalCtrl = function ($scope, $uibModalInstance, title) {
            $scope.modal_title = title;

            $scope.ok = function () {
                $uibModalInstance.close();
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        };

        function _confirmationModal(size, title) {
            removeConfirmationModal = $uibModal.open({
                templateUrl: 'components/modal/confirmation.modal.template.html',
                controller: ConfirmationModalCtrl,
                backdrop: 'static',
                size: size,
                resolve: {
                    title: function () {
                        return title;
                    }
                }
            });
        }

        function _remove(id, description) {
            _confirmationModal('md', $filter('format')('Você deseja excluir o destaque "{0}"?', description));

            removeConfirmationModal.result.then(function () {
                featuredService.destroy(id).then(function () {
                    loadHighlights();
                    NotificationService.success('Destaque removido com sucesso.');
                });
            });
        }

        function _permissions() {
            _canDelete();
            _canPost();
        }

        function _canPost() {
            $scope.canPost = PermissionService.canPost('highlighted_press');
        }

        function _canDelete() {
            $scope.canDelete = PermissionService.canDelete('highlighted_press');
        }
    }
})();
