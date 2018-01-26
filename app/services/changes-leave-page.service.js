(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('ChangeLeavePageService', ChangeLeavePageService);

    /** ngInject */
    function ChangeLeavePageService(ModalService, $rootScope, $location) {
        let service = {
            registerWhenLeavePage: registerWhenLeavePage,
            setHasChanged: setHasChanged
        };

        let vm = this;

        onInit();

        return service;

        ////////////////

        function setHasChanged(value) {
            if(vm.currentPage) {
                vm.currentPage.hasChanged = value;
            }
        }

        function registerWhenLeavePage(url, method, scope, nameObj, evenedObj) {
            _registerPage(url, method);
            _registerOnChangePage(scope, nameObj, evenedObj);
        }
        
        function _registerPage(url, method) {
            vm.currentPage = {
                hasIntercept: true,
                hasChanged: false,
                url: url,
                method: method
            };
        }

        function _registerOnChangePage(scope, nameObj, evenedObj) {
            scope.$watch(nameObj, function(newValue, oldValue) {
                if(vm.currentPage.hasChanged) {
                    return;
                }
                let newValueCopy = evenedObj(angular.copy(newValue));
                let oldValueCopy = evenedObj(angular.copy(oldValue));
                let hasChange = !angular.equals(newValueCopy, oldValueCopy) && oldValueCopy.id;
                console.log('setHasChanged true', newValueCopy, oldValueCopy);
                if(hasChange) {
                    setHasChanged(true);
                }
            }, true);
        }

        function _initListeners() {
            _initListenerRoute();
            _initListenerHttp();
        }

        function _initListenerHttp() {
            $rootScope.$on('httpRequest', function(event, data) {
                _handleInterceptHttp(data);
            });
            
        }
        
        function _handleInterceptHttp(data) {
            let canIntercept = vm.currentPage && data.method !== 'GET' &&
            data.method === vm.currentPage.method && data.url.includes(vm.currentPage.url);
            if(canIntercept) {
                setHasChanged(false);
                console.log('_initListenerHttp', data, vm.currentPage);
            }
        }

        function _initListenerRoute() {
            $rootScope.$on('$routeChangeStart', function (event, next, current) {
                let pathNext = next.$$route.originalPath;
                _handleInterceptRouter(pathNext, event);
            });
        }

        function _handleInterceptRouter(pathNext, event) {
            if(_canShowModal(vm.currentPage)) {
                event.preventDefault();
                _openModalConfirm().then(function() {
                    vm.currentPage.hasIntercept = false;
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
            vm.currentPage = {};
            _initListeners();
        }
    }
})();