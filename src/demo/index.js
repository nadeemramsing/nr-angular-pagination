(function () {

    'use strict';

    angular
        .module('Demo', [
            'ngMaterial',
            'NrAngularPagination'
        ])
        .controller('DemoController', DemoController);

    /* @ngInject */
    function DemoController($scope, $http, $httpParamSerializer) {

        $scope.comments = [];

        $scope.displayRamsing = displayRamsing;

        /* INIT */
        getComments({ limit: 50 });

        /* FUNCTION DECLARATIONS */
        function getComments(query) {
            var qs = qs = $httpParamSerializer(query),
                url = 'http://localhost:4000/api/comments?' + qs;

            $http.get(url).then(function (response) {
                $scope.comments = response.data;
            });

            /* fetch(url)
            .then(function (response) {
                return response.json()
            })
            .then(function (data) {
                //does not work
                $scope.comments = data;
                })
                .catch(function (err) {
                    console.error(err);
                }); */
        }

        function displayRamsing() {
            $scope.nadeem = "Ramsing";
        }
    }

})();