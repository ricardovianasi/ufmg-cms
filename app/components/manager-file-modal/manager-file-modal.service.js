(function () {
    'use strict';

    angular
        .module('serviceModule')
        .factory('ManagerFileService', ManagerFileService);

    /** ngInject */
    function ManagerFileService($uibModal, $q) {
        var moduleModal = $uibModal;
        var defer;
        var EXTENSION = [];
        var title = '';
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
            files: 'AIF,IFF,M3U,M4A,MID,MP3,MPA,WAV,WMA,MPEG'.toLowerCase()
        };
        var APRESENTATION = {
            name: 'Apresentação',
            files: 'odp,ppt,pptx'.toLowerCase()
        };
        var openModal = {
            open: open
        };

        function files() {
            title = 'Inserir arquivos';
            EXTENSION = [];
            EXTENSION.push(
                PDF,
                TEXT,
                DATA,
                APRESENTATION
            );
            return openModal;
        }

        function allFiles() {
            title = 'Inserir arquivos';
            EXTENSION = [];
            EXTENSION.push(
                ALL,
                PDF,
                IMAGE,
                TEXT,
                DATA,
                AUDIO,
                APRESENTATION
            );
            return openModal;
        }

        function pdfFiles() {
            title = 'Inserir arquivos de leitura (pdf)';
            EXTENSION = [];
            EXTENSION.push(PDF);
            return openModal;
        }

        function imageFiles() {
            title = 'Inserir imagens';
            EXTENSION = [];
            EXTENSION.push(IMAGE);
            return openModal;
        }

        function textFiles() {
            title = 'Inserir arquivos de texto';
            EXTENSION = [];
            EXTENSION.push(TEXT);
            return openModal;
        }

        function dataFiles() {
            title = 'Inserir planilhas (ex: Excel)';
            EXTENSION = [];
            EXTENSION.push(DATA);
            return openModal;
        }

        function audioFiles() {
            title = 'Inserir arquivos de audio';
            EXTENSION = [];
            EXTENSION.push(AUDIO);
            return openModal;
        }

        function apresentationFiles() {
            title = 'Inserir arquivos de apresentação (ex: Power Point)';
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
            files: files,
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
                        $scope.title = title;
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
