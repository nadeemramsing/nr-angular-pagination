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

            controller: PaginationController
        });

    function PaginationController() {
        debugger;
    }
})();
angular.module('NrAngularPagination').run(['$templateCache', function($templateCache) {$templateCache.put('tpl/nr-angular-pagination.html','<div class="test">\r\n    test.html\r\n</div>');}]);
"undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t}catch(e){n.innerText=t}}(document,".test {\n" +
"    opacity: 0.5;\n" +
"}");
(function () {

    'use strict';

    angular
        .module('Demo', [
            'ngMaterial',
            'NrAngularPagination'
        ])
        .controller('DemoController', DemoController);

    /* @ngInject */
    function DemoController() {

    }

})();