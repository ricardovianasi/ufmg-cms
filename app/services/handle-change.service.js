(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('HandleChangeService', HandleChangeService);

    /** ngInject */
    function HandleChangeService(ModalService, $rootScope, $location) {
        let service = {
            registerHandleChange: registerHandleChange,
            setHasChanged: setHasChanged,
            removePropsCommon: removePropsCommon
        };

        let vm = this;

        onInit();

        return service;

        ////////////////

        function removePropsCommon(obj) {
            if(!obj) {
                return obj;
            }
            delete obj.widgetsSave;
            delete obj.scheduled_date;
            delete obj.scheduled_time;
            delete obj.status;
            delete obj.id;
            return obj;
        }

        function setHasChanged(value) {
            if(vm.currentPage) {
                vm.currentPage.hasChanged = value;
            }
        }

        function registerHandleChange(url, methods, scope, nameObjs, evenedObj, hasLoaded) {
            _registerPage(url, methods);
            hasLoaded = hasLoaded ? hasLoaded : function () { return true; };
            evenedObj = evenedObj ? evenedObj : function (obj) { return obj; };
            _registerWatchsOnChange(scope, nameObjs, evenedObj, hasLoaded);
        }
        
        function _registerPage(url, methods) {
            vm.currentPage = {
                hasIntercept: true,
                hasChanged: false,
                url: url,
                methods: methods
            };
        }

        function _registerWatchsOnChange(scope, nameObjs, evenedObj, hasLoaded) {
            nameObjs.forEach(function (name) { _registerObjWatch(scope, name, evenedObj, hasLoaded); });
        }
        
        function _registerObjWatch(scope, nameObj, evenedObj, hasLoaded) {
            scope.$watch(nameObj, function(newValue, oldValue) {
                if(vm.currentPage.hasChanged) {
                    return;
                }
                let newValueCopy = evenedObj(angular.copy(newValue));
                let oldValueCopy = evenedObj(angular.copy(oldValue));
                let hasChange = !angular.equals(newValueCopy, oldValueCopy) && hasLoaded(oldValue);
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
            }
        }

        function _canIntercept(data) {
            if(data.method === 'GET') {
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