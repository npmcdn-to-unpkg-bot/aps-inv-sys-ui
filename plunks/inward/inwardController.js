angular.module('inwardModule', ['toastr' ])
.controller('inwardController', function(toastr,$scope,$http) {
  $scope.inward_fromdata="http://localhost:8080/inward/displayAll";
  $scope.inward_headers="Creation Date,Inward No, Party, Component,Material,Part No,Process,Qty Kg,Qty No,Rate Kg,Rate No";
  $scope.inward_fields="creationDate,inwardNo,party,component,material,partNo,process,qtyKgs,qtyNos,rateKg,rateNos";
  $scope.inward_button1="Dispatch";



      $scope.ok = function() {

          var selectedRec = $scope.report.selected;
          var actualRec;
          //if(_.isEqual(selectedRec.length(),1)){
              compareWithActualSelectedRecord(selectedRec);
          //}
      };
        compareWithActualSelectedRecord = function(selectedRec)
        {
                var id = selectedRec.inwardNo;
                var url = 'http://localhost:8080/inward/'+id
                $http.get(url)
                    .success(function(data) {
                        if(selectedRec.qtyKgs<= data.qtyKgs && selectedRec.qtyNos<=data.qtyNos){
                            insertRecordInDispatchAsSingle(selectedRec)
                            var newQtyKgs = data.qtyKgs-selectedRec.qtyKgs;
                            var newQtyNos = data.qtyNos-selectedRec.qtyNos;
                            data.qtyKgs=newQtyKgs;
                            data.qtyNos=newQtyNos;

                                updateInwardWithBalanceQty(data);


                        toastr.success('Update Success');
                        }
                        //$scope.parties[id-1]=data;
                    }).error(function(data){
                        toastr.error("Cannot Update quantity error");
                    });
        };

        updateInwardWithBalanceQty = function(data)
        {
            var url = 'http://localhost:8080/inward/'
            $http.put(url,data)
                .success(function(data) {
                        toastr.success('Qty Update Success in inward');
                    updateDataGrid();
                }).error(function(data){
                    toastr.error("Cannot Update");
                    updateDataGrid();
                });
            updateDataGrid();
        };


        insertRecordInDispatchAsSingle = function(rec) {
            console.log("rec : "+rec);
            var inwardRecord = {};
            inwardRecord.party=rec.party;
            inwardRecord.component=rec.component;
            inwardRecord.material = rec.material;
            inwardRecord.inwardNo=rec.inwardNo;
            inwardRecord.qtyKgs=rec.qtyKgs;
            inwardRecord.qtyNos=rec.qtyNos;
            inwardRecord.rateKg=rec.rateKg;
            inwardRecord.rateNos=rec.rateNos;
            inwardRecord.total = rec.qtyKgs * rec.rateKg + rec.qtyNos * rec.rateNos;

            var url="http://localhost:8080/dispatch";
            $http.post(url,inwardRecord)
                .success(function(data) {//delete if success
                    updateDataGrid();
                    toastr.success('Update Success');
                    $scope.report.selected=[];
                }).error(function(data){//dont if no success
                    updateDataGrid();
                    toastr.error("Cannot Update : Error in quantity entered for inward : "+rec.inwardNo);
                    $scope.report.selected=[];
                });
      };

        updateDataGrid = function() {
            $http.get('http://localhost:8080/inward/displayAll')
                .success(function(datas) {
                    $scope.exportDataVariable = datas;

                }).error(function(datas){
                });
        };

      $scope.clear = function(selectedRecord) {
        $scope.report.selected=[]
      };

	})