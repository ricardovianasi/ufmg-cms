(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('HighlightedReleaseService', HighlightedReleaseService);

    /** ngInject */
    function HighlightedReleaseService(CommonWidgetService, MediaService, ReleasesService, $timeout) {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load(ctrl, $scope) {
            ctrl.widget.content = ctrl.widget.content || {};
            ctrl.releases = {};
            _addListenerToContentImage(ctrl, $scope);
            _registerFunctions(ctrl, $scope);
            _registerRequest();
        }

        function parseToLoad(widget) {
            return {
                title: widget.title,
                content: widget.content,
            };
        }

        function parseToSave(widget) {
            let objToSave = {
                title: widget.title,
                description: widget.content.description,
                release: widget.content.release,
                specialists: [],
                image: widget.content.image ? widget.content.image.id : null,
            };

            angular.forEach(widget.content.specialists, function (specialist) {
                delete specialist.opened;
                objToSave.specialists.push(specialist);
            });
            return objToSave;
        }

        function _addListenerToContentImage(ctrl, $scope) {
            $scope.$watch('ctrlModal.widget.content.image', function () {
                if (ctrl.widget.content && ctrl.widget.content.image instanceof File) {
                    ctrl.upload(ctrl.widget.content.image);
                }
            });
        }

        function _registerRequest() {
            CommonWidgetService.request('EventHighlightedrelease', ReleasesService.getReleases, {
                field: 'postDate',
                direction: 'DESC'
            }, 'title');
        }

        function _registerFunctions(ctrl, $scope) {
            _registerUpload(ctrl);
            _registerRemoveImage(ctrl, $scope);
            _registerAddSpecialist(ctrl);
            _registerRemoveSpecialist(ctrl);
        }

        function _registerUpload(ctrl) {
            ctrl.upload = function(file) {
                MediaService.newFile(file).then(function (data) {
                    ctrl.widget.content.image = {
                        url: data.url,
                        id: data.id
                    };
                });
            };
        }

        function _registerRemoveImage(ctrl, $scope) {
            ctrl.removeImage = function() {
                $timeout(function () {
                    ctrl.widget.content.image = '';
                    $scope.$apply();
                });
            };
        }

        function _registerAddSpecialist(ctrl) {
            ctrl.addSpecialist = function () {
                if(!ctrl.widget.content.specialists) {
                    ctrl.widget.content.specialists = [];
                }
                ctrl.widget.content.specialists
                    .push({ name: '', phone: '', title_job: '', email: '', opened: true });
            };
        }

        function _registerRemoveSpecialist(ctrl) {
            ctrl.removeSpecialist = function (idx) {
                ctrl.widget.content.specialists.splice(idx, 1);
            };
        }
    }
})();
