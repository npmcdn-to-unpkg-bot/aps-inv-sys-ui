 angular.module('mainModule', ['toastr' ])
    .controller('mainController', function(toastr,$scope,$http,$routeParams) {

        if($routeParams.inwardNo!=undefined) {
            var url = "http://localhost:8080/inward/" + $routeParams.inwardNo;
            $http.get(url)
                .success(function (data) {//delete if success
                    $scope.inv = data.dispatches[0].invoices[0];
                    $scope.inv.creationDate = new Date($scope.inv.creationDate).toLocaleDateString();
                    $scope.component=data.component;
                    $scope.inv.testCertificate.mm = JSON.parse("[" + data.dispatches[0].invoices[0].testCertificate.mm + "]");
                    $scope.inv.testCertificate.hv = JSON.parse("[" + data.dispatches[0].invoices[0].testCertificate.hv + "]");
                    $scope.inv.testCertificate.cut = JSON.parse("[" + data.dispatches[0].invoices[0].testCertificate.cut + "]");
                    callComponentInfo();
                    $scope.numberToWords($scope.inv.total);
                    $scope.chartConfig = initChartConfig(data.dispatches[0].invoices[0].testCertificate);
                }).error(function (data) {
                // toastr.error('Error in getting TC');
            });


        }
         // $scope.image = null;
         // $scope.imageFileName = '';


        $scope.numberToWords = function(number) {
            var fraction = Math.round(frac(number)*100);
            var f_text  = "";

            if(fraction > 0) {
                f_text = "and "+convert_number(fraction)+" paise";
            }

            $scope.inv.inWords = convert_number(number).toLowerCase() +" rupee "+f_text+" only";
        };

            function frac(f) {
                return f % 1;
            }

            function convert_number(number)
            {
                if ((number < 0) || (number > 999999999))
                {
                    return "NUMBER OUT OF RANGE!";
                }
                var Gn = Math.floor(number / 10000000);  /* Crore */
                number -= Gn * 10000000;
                var kn = Math.floor(number / 100000);     /* lakhs */
                number -= kn * 100000;
                var Hn = Math.floor(number / 1000);      /* thousand */
                number -= Hn * 1000;
                var Dn = Math.floor(number / 100);       /* Tens (deca) */
                number = number % 100;               /* Ones */
                var tn= Math.floor(number / 10);
                var one=Math.floor(number % 10);
                var res = "";

                if (Gn>0)
                {
                    res += (convert_number(Gn) + " CRORE");
                }
                if (kn>0)
                {
                    res += (((res=="") ? "" : " ") +
                    convert_number(kn) + " LAKH");
                }
                if (Hn>0)
                {
                    res += (((res=="") ? "" : " ") +
                    convert_number(Hn) + " THOUSAND");
                }

                if (Dn)
                {
                    res += (((res=="") ? "" : " ") +
                    convert_number(Dn) + " HUNDRED");
                }


                var ones = Array("", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX","SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN","FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN","NINETEEN");
                var tens = Array("", "", "TWENTY", "THIRTY", "FOURTY", "FIFTY", "SIXTY","SEVENTY", "EIGHTY", "NINETY");

                if (tn>0 || one>0)
                {
                    if (!(res==""))
                    {
                        res += " AND ";
                    }
                    if (tn < 2)
                    {
                        res += ones[tn * 10 + one];
                    }
                    else
                    {

                        res += tens[tn];
                        if (one>0)
                        {
                            res += ("-" + ones[one]);
                        }
                    }
                }

                if (res=="")
                {
                    res = "zero";
                }
                return res;
            }


        callComponentInfo = function(){

            var url = "http://localhost:8080/party/" + $scope.component.partyId;
            $http.get(url)
                .success(function (data) {//delete if success
                    $scope.party = data;
                }).error(function (data) {
                // toastr.error('Error in getting TC');
            });
        };


        $scope.save = function() {
           var tcObject = $scope.tc;

           var url = 'http://localhost:8080/tc';
           $http.put(url,tcObject)
               .success(function(data) {//delete if success
                   toastr.success('Updated TC');
                   //$scope.exportDataVariable = data;
               }).error(function(data){
                   toastr.error('Error in updating TC');
               });
        };


         //$scope.name = 'World';
         //$http.get('data.json')
         //    .success(function(data) {
         //        $scope.inv = data;
         //        $scope.chartConfig = initChartConfig(data);
         //    })
         //    .error(function (data, status, headers, config) {
         //        alert("error reading json");
         //    });



     })  .directive('chart', chartDirective);
     //
     //.controller('MainCtrl', function($scope,$http) {
     //    $scope.name = 'World';
     //    $http.get('data.json')
     //        .success(function(data) {
     //            $scope.inv = data;
     //            $scope.chartConfig = initChartConfig(data);
     //        })
     //        .error(function (data, status, headers, config) {
     //            alert("error reading json");
     //        });
     //}).controller('ImageCtrl', function($scope) {
     //    $scope.image = null
     //    $scope.imageFileName = ''
     //})

