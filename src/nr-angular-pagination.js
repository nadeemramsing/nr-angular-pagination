(function () {

    'use strict';

    angular
        .module('NrAngularPagination', [])
        .component('pagination', {
            bindings: {
                data: '=',
                view: '='
            },
            templateUrl: 'tpl/nr-angular-pagination.html',
            controller: PaginationController,
            controllerAs: 'vm'
        });

    function PaginationController() {
        var vm = this;

        this.$onInit = function () {
            debugger;
        }

    }
})();