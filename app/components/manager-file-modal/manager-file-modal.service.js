(function () {
    'use strict';

    angular
        .module('serviceModule')
        .factory('ManagerFileService', ManagerFileService);

    /** ngInject */
    function ManagerFileService(
        $uibModal,
        $q) {
        var moduleModal = $uibModal;
        var defer;
        var EXTENSION = [];
        var PDF = {
            name: 'PDF',
            files: 'pdf'.toLowerCase()
        };
        var ALL = {
            name: 'Todos',
            files: 'all'.toLowerCase()
        };
        var IMAGE = {
            name: 'Imagem',
            files: 'jpg,jpeg,png'.toLowerCase()
        };
        var TEXT = {
            name: 'Texto',
            files: 'doc,docx,txt,odt,rtf'.toLowerCase()
        };
        var DATA = {
            name: 'Planilha',
            files: 'xls,xlsx,ods,csv'.toLowerCase()
        };
        var AUDIO = {
            name: 'Audio',
            files: 'AIF,IFF,M3U,M4A,MID,MP3,MPA,WAV,WMA'.toLowerCase()
        };
        var VIDEO = {
            name: 'Video',
            files: '3G2,3GP,ASF,AVI,FLV,M4V,MOV,MP4,MPG,RM,SRT,SWF,VOB,WMV'.toLowerCase()
        };
        var APRESENTATION = {
            name: 'Apresentação',
            files: 'odp,ppt,pptx'.toLowerCase()
        };
        var openModal = {
            open: open
        };

        function allFiles() {
            EXTENSION = [];
            EXTENSION.push(
                ALL,
                PDF,
                IMAGE,
                TEXT,
                DATA,
                AUDIO,
                VIDEO,
                APRESENTATION
            );
            return openModal;
        }

        function pdfFiles() {
            EXTENSION = [];
            EXTENSION.push(PDF);
            return openModal;
        }

        function imageFiles() {
            EXTENSION = [];
            EXTENSION.push(IMAGE);
            return openModal;
        }

        function textFiles() {
            EXTENSION = [];
            EXTENSION.push(TEXT);
            return openModal;
        }

        function dataFiles() {
            EXTENSION = [];
            EXTENSION.push(DATA);
            return openModal;
        }

        function audioFiles() {
            EXTENSION = [];
            EXTENSION.push(AUDIO);
            return openModal;
        }

        function videoFiles() {
            EXTENSION = [];
            EXTENSION.push(VIDEO);
            return openModal;
        }

        function apresentationFiles() {
            EXTENSION = [];
            EXTENSION.push(APRESENTATION);
            return openModal;
        }

        function getExtension() {
            return EXTENSION;
        }

        return {
            close: close,
            open: open,
            getExtension: getExtension,
            allFiles: allFiles,
            pdfFiles: pdfFiles,
            imageFiles: imageFiles,
            textFiles: textFiles,
            dataFiles: dataFiles,
            audioFiles: audioFiles,
            videoFiles: videoFiles,
            apresentationFiles: apresentationFiles
        };

        function close(data) {
            if (data) {
                defer.resolve(data);
            } else {
                defer.reject(false);
            }
            return;
        }

        function open(formatsValues) {
            var formats = [];
            defer = new $q.defer();
            if (angular.isString(formatsValues)) {
                formats[0] = formatsValues;
            } else if (angular.isArray(formatsValues)) {
                formats = formatsValues;
            } else {
                formats = ['vertical', 'medium', 'big', 'wide'];
            }
            $('html').addClass('full-modal');
            moduleModal
                .open({
                    template: '<manager-file-modal></manager-file-modal>',
                    backdrop: 'static',
                    size: 'xl',
                    controller: function ($uibModalInstance, $scope) {
                        $scope.formats = formats;
                        $scope.close = function () {
                            $uibModalInstance.close();
                        };
                    }
                })
                .result
                .finally(function () {
                    $('html').removeClass('full-modal');
                });
            return defer.promise;
        }
    }
})();
