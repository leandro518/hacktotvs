(function () {
    'use strict';
    angular
        .module(global.config.APP_NAME)
        .controller('TasksController', Controller);

    Controller.$inject = ['$state', '$scope', 'TaskService', 'TaskModal', 'ScanService'];

    function Controller($state, $scope, TaskService, TaskModal, ScanService) {
        var controller = this;

        controller.id         = '01'
        controller.nome       = ''
        controller.rank       = 0
        controller.comis      = 0
        controller.venda      = 0
        controller.tasks      = [];
        controller.haveMore   = false;

        controller.meta       = [];
        controller.metadia    = 0;
        controller.venddia    = 0;

        controller.metames    = 0;
        controller.vendmes    = 0;

        $scope.$on('appReady', function() {
            controller.init();
        });

        $scope.$on('actionMenuClicked', function() {
            TaskModal.show()
            .then(function(newTask) {
                return TaskService.addTask(newTask);
              })
            .then(function(result){
              controller.updateTasks();
            })
            .catch(function(error){
              console.log(error);
            });
        })

        controller.init = function() {
            console.log("controller initiated");
        }

        controller.openSales = function(salesId, totVenda, totComis) {
            $state.go('tasks.detail', { salesId :  salesId ,  totVenda : totVenda , totComis : totComis} );
        }

        controller.openRanking = function(salesId) {
            $state.go('tasks.ranking', {salesId :  salesId  } );
        }

        controller.updateTasks = function() {

            TaskService.getTasksList()
            .then(function(result){

              controller.tasks = result;
              controller.totVenda = controller.tasks.tot_venda;
              controller.comisMes = controller.tasks.tot_cmes;
              controller.vendaMes = controller.tasks.tot_vmes;
              controller.nome = controller.tasks.name;
              controller.totComis = controller.tasks.tot_comis;
              controller.rank = controller.tasks.pos_rank;
            })
            .catch(function(error){
              console.log("ERROR CONTROLLER");
              console.log(error);
            })

            TaskService.getMeta()
            .then(function(result){

              controller.meta = result;
              controller.metadia = controller.meta.meta_dia;
              controller.venddia = controller.meta.vend_dia;
              controller.metames = controller.meta.meta_mes;
              controller.vendmes = controller.meta.vend_mes;

              controller.scaleDia = {
                min: 0,
                max: controller.metadia,
                vertical: false,
                ranges: [
                    {
                        from: 0,
                        to: controller.metadia * 0.30,
                        color: "#FF0000"
                    },

                    {
                        from: (controller.metadia * 0.30)+1,
                        to: controller.metadia * 0.80,
                        color: "#FFFF00"
                    },

                    {
                        from: (controller.metadia * 0.80)+1,
                        to: controller.metadia,
                        color: "#008000"
                    }

                  ]

              };

              controller.scaleMes = {
                min: 0,
                max: controller.metames,
                vertical: false,
                ranges: [
                    {
                        from: 0,
                        to: controller.metames * 0.30,
                        color: "#FF0000"
                    },

                    {
                        from: (controller.metames * 0.30)+1,
                        to: controller.metames * 0.80,
                        color: "#FFFF00"
                    },

                    {
                        from: (controller.metames * 0.80)+1,
                        to: controller.metames,
                        color: "#008000"
                    }

                  ]

              };

            })
            .catch(function(error){
              console.log("ERROR CONTROLLER");
              console.log(error);
            })



        }

        controller.enterSearchKey = function(
        ) {
            if (keyEvent.which === 13) {
                document.getElementById("search").blur();
            }
        }

        controller.scan = function ()
        {
         ScanService.scan()
           .then(function(result)
           {
             debugger;
              console.log('barCodeScan result');
              controller.picture = result;

           })
           .catch(function(error)
           {
             controller.picture = "./sem.jpg";
               console.log('barCodeScan error');
               console.log(error);
           });
      }
      controller.updateTasks();
    }
}());
