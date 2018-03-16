(function () {

    'use strict';

    PaginationController.$inject = ["$timeout"];
    angular
        .module('NrAngularPagination', [])
        .component('pagination', {
            bindings: {
                data: '=',
                view: '=',
                callback: '&'
            },
            templateUrl: 'tpl/nr-angular-pagination.html',
            controller: PaginationController,
            controllerAs: 'vm'
        });

    function PaginationController($timeout) {
        var vm = this;

        this.$onInit = function () {
            init();
        };

        function init() {
            $timeout(function() {
                vm.callback();
            }, 5000);
        }

    }
})();
angular.module('NrAngularPagination').run(['$templateCache', function($templateCache) {$templateCache.put('tpl/nr-angular-pagination.html','<div class="test">\r\n    {{vm.data}} {{vm.view}}\r\n</div>');}]);
"undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t}catch(e){n.innerText=t}}(document,".test {\n" +
"    opacity: 0.5;\n" +
"}");
(function () {

    'use strict';

    DemoController.$inject = ["$scope"];
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