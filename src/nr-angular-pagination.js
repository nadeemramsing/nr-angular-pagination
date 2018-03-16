(function () {

    'use strict';

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