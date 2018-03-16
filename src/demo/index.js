(function () {

    'use strict';

    angular
        .module('Demo', [
            'ngMaterial',
            'NrAngularPagination'
        ])
        .controller('DemoController', DemoController);

    /* @ngInject */
    function DemoController($scope) {
        $scope.displayRamsing = function() {
            $scope.nadeem = "Ramsing";
        }
    }

})();