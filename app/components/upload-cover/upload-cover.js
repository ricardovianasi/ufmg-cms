(function() {
    'use strict';

    // Usage:
    // 
    // Creates:
    // 

    angular
        .module('componentsModule')
        .component('uploadCoverComponent', {
            templateUrl: 'components/upload-cover/upload-cover.html',
            controller: UploadCoverController,
            controllerAs: '$ctrl',
            bindings: {
                urlImage: '=',
                selectImage: '&'
            },
        });

    /** ngInject */
    function UploadCoverController(ManagerFileService) {
        var $ctrl = this;

        $ctrl.openPickCover = openPickCover;
        $ctrl.removeImage = removeImage;
        

        ////////////////

        function removeImage() {
            $ctrl.urlImage = '';
            $ctrl.selectImage({imageSelected: undefined});
        }

        function openPickCover() {
            ManagerFileService.imageFiles()
                .open('pageCover')
                .then(function (image) {
                    $ctrl.selectImage({imageSelected: image});
                });
        }

        $ctrl.$onInit = function() { };
        $ctrl.$onChanges = function(changesObj) { };
        $ctrl.$onDestroy = function() { };
    }
})();