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
            console.log('load - HighlightedReleaseService', ctrl, $scope);
            ctrl.widget.content = ctrl.widget.content || {};
            ctrl.releases = {};

            // Cover Image - Upload
            $scope.$watch('ctrlModal.widget.content.image', function () {
                if (ctrl.widget.content && ctrl.widget.content.image instanceof File) {
                    ctrl.upload(ctrl.widget.content.image);
                }
            });

            _registerFunctions(ctrl, $scope);

            CommonWidgetService.request('EventHighlightedrelease', ReleasesService.getReleases, {
                field: 'postDate',
                direction: 'DESC'
            }, 'title');
        }

        function parseToLoad(widget) {
            return {
                event: widget.event || (widget.content ? widget.content.event : null),
            };
        }

        function parseToSave(widget) {
            return {
                event: (widget.event ? widget.event.id : null) || (widget.content ? widget.content.event.id : null),
            };
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
