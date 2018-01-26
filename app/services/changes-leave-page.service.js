(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('ChangeLeavePageService', ChangeLeavePageService);

    /** ngInject */
    function ChangeLeavePageService(ModalService, $rootScope, $location) {
        let service = {
            registerWhenLeavePage: registerWhenLeavePage
        };

        let vm = this;

        onInit();

        return service;

        ////////////////

        function registerWhenLeavePage(nameCtrl, scope, keyOnChange) {
            _registerPage(nameCtrl);
            _registerOnChange(nameCtrl, scope, keyOnChange);
        }
        
        function _registerPage(nameCtrl) {
            vm.pagesRegistered[nameCtrl] = {
                hasIntercept: true,
                hasChanged: false
            };
        }

        function _registerOnChange(nameCtrl, scope, keyOnChange) {
            scope.$on(keyOnChange, function() {
                console.log('change aaa');
                vm.pagesRegistered[nameCtrl].hasChanged = true;
            })
        }

        function _initListener() {
            $rootScope.$on('$routeChangeStart', function (event, next, current) {
                let nameCtrlCurrent = current.$$route.controller;
                let pathNext = next.$$route.originalPath;
                _handleIntercept(nameCtrlCurrent, pathNext, event);
            });
        }

        function _handleIntercept(nameCtrlCurrent, pathNext, event) {
            if(_canShowModal(vm.pagesRegistered[nameCtrlCurrent])) {
                event.preventDefault();
                _openModalConfirm().then(function() {
                    vm.pagesRegistered[nameCtrlCurrent].hasIntercept = false;
                    _goRoute(pathNext);
                }).catch(function () { });
            }
        }

        function _goRoute(path) {
            $location.path(path);
        }

        function _openModalConfirm() {
            let titleModal = 'Existe alterações <b> não salvas </b> nesta página, se você sair elas serão perdidas. Você tem certeza?'
            return ModalService.confirm(titleModal, ModalService.MODAL_MEDIUM, { isDanger: true }).result;
        }

        function _canShowModal(pageRegister) {
            return pageRegister && pageRegister.hasIntercept && pageRegister.hasChanged; 
        }

        function onInit() {
            vm.pagesRegistered = {};
            _initListener();
        }
    }
})();