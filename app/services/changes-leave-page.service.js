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

        function registerWhenLeavePage(url, methods, scope, nameObj, evenedObj, hasLoaded) {
            _registerPage(url, methods);
            hasLoaded = hasLoaded ? hasLoaded : function () { return true; };
            evenedObj = evenedObj ? evenedObj : function (obj) { return obj; };
            _registerOnChangePage(scope, nameObj, evenedObj, hasLoaded);
        }
        
        function _registerPage(url, methods) {
            vm.currentPage = {
                hasIntercept: true,
                hasChanged: false,
                url: url,
                methods: methods
            };
        }

        function _registerOnChangePage(scope, nameObj, evenedObj, hasLoaded) {
            scope.$watch(nameObj, function(newValue, oldValue) {
                if(vm.currentPage.hasChanged) {
                    return;
                }
                let newValueCopy = evenedObj(angular.copy(newValue));
                let oldValueCopy = evenedObj(angular.copy(oldValue));
                let hasChange = !angular.equals(newValueCopy, oldValueCopy) && hasLoaded(oldValue);
                console.log('setHasChanged ?', newValueCopy, oldValueCopy, hasChange);
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
            if(_canIntercept(data)) {
                setHasChanged(false);
                console.log('_initListenerHttp', data, vm.currentPage);
            }
        }

        function _canIntercept(data) {
            let isGet = data.method === 'GET';
            if(isGet) {
                return false;
            }
            let isMethodIntercept = vm.currentPage.methods.findIndex(function (method) { return method === data.method; }) !== -1;
            let isUrlIntercept = data.url.includes(vm.currentPage.url);
            let can = vm.currentPage && isMethodIntercept && isUrlIntercept;
            return can;
        }

        function _initListenerRoute() {
            $rootScope.$on('$routeChangeStart', function (event, next) {
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
            let titleModal = 'Existem alterações <b> não salvas </b> nesta página, ' + 
                'se você sair elas serão perdidas. Você tem certeza?';
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