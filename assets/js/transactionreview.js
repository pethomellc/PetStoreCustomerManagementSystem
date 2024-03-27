function searchTransactions() {

    var memberId = document.getElementById('search_transaction_memberId').value;
    var startDate = document.getElementById('search_transaction_starDate').valueAsDate;
    var endDate = document.getElementById('search_transaction_endDate').valueAsDate;
    var tableBody = document.getElementById('transaction_table');

    tableBody.innerHTML = null;
    if (memberId != "" && startDate == null && endDate == null) {
        searchTransactionByMemberId(memberId);
    } else if (memberId == "") {
        if (startDate > endDate && startDate != null && endDate != null) {
            Swal.fire("错误提醒", "开始时间不能大于结束时间", "warning");
        } else {
            searchTransactionByDate(startDate, endDate);
        }
    } else {
        searchTransactionByIdAndDate(memberId, startDate, endDate);
    }
}



function searchTransactionByMemberId(memberId) {

    var TransactionInfo = firebase.database().ref('transactions/').orderByChild('memberId').equalTo(memberId);


    TransactionInfo.on("value", function (snapshot) {

        var table = document.getElementById('transaction_table');

        if (!snapshot.exists()) {

            Swal.fire("错误提醒", "查询的会员账号： " + memberId + " 不存在", "error");

        } else {

            snapshot.forEach(function (childSnapshot) {
                var Data = childSnapshot;

                var transactionDate = Data.child("date").val();
                var transactionType = Data.child("type").val();
                var transactionAmount = Data.child("amount").val();
                var transactionDiscountRate = Data.child("discountRate").val();
                var transactionStatus = Data.child("status").val();
                var transactionNote = Data.child("note").val();
                var transactionEmployee = Data.child("employeeId").val();
                var transactionTypeConv;
                if (transactionType == 'spendCredit') {
                    transactionTypeConv = "消费";
                } else if (transactionType == 'addCredit') {
                    transactionTypeConv = "充值";
                } else {
                    transactionTypeConv = "开户";
                }

                var query = firebase.database().ref('employees/'+transactionEmployee);

                query.on("value", function (snapshot) {
                    
                    var employeeName = snapshot.child('employeeName').val();
            
                    memberInfoLookUpTable(memberId).then(function (result) {

                        if(transactionNote===null || transactionNote ===''){
                            transactionNote='未备注';
                        }
            
                        var row = '<tr>' +
                            '<td>' + memberId + '</td>' +
                            '<td>' + result['memberName'] + '</td>' +
                            '<td>' + result['memberPetName'] + '</td>' +
                            '<td>' + result['memberPhone'] + '</td>' +
                            '<td>' + transactionDate + '</td>' +
                            '<td>' + transactionTypeConv + '</td>' +
                            '<td>$' + transactionAmount + '</td>' +
                            '<td>' + transactionDiscountRate + '</td>' +
                            '<td>' + employeeName + '</td>' +
                            '<td>' + transactionStatus + '</td>' +
                            '<td><i class="fa fa-search" onclick="Swal.fire('+"'备注详情',"+"'"+transactionNote+"'"+')">查看备注</i></td>' +
                            '</tr>';
                
                        table.innerHTML += row;
                    });
                
                });

            });
        }
    });

}



function searchTransactionByDate(startDate, endDate) {

    var transactionInfo = firebase.database().ref('transactions/');

    transactionInfo.on("value", function (snapshot) {

        snapshot.forEach(function (childSnapshot) {

            var date = childSnapshot.child("date").val();

            if (startDate != null && endDate == null && new Date(date) >= new Date(startDate)) {

                generateTransactionTable(childSnapshot);

            } else if (startDate == null && endDate != null && new Date(date) <= new Date(endDate)) {

                generateTransactionTable(childSnapshot);

            } else if (startDate != null && endDate != null && new Date(date) >= new Date(startDate) && new Date(date) <= new Date(endDate)) {

                generateTransactionTable(childSnapshot);

            } else if (startDate == null && endDate == null) {

                generateTransactionTable(childSnapshot);

            }

        });
    });

}



function searchTransactionByIdAndDate(memberId, startDate, endDate) {

    var TransactionInfo = firebase.database().ref('transactions/').orderByChild('memberId').equalTo(memberId);


    TransactionInfo.on("value", function (snapshot) {


        if (!snapshot.exists()) {

            Swal.fire("错误提醒", "查询的会员账号： " + memberId + " 不存在", "error");

        } else if (startDate > endDate && startDate != null && endDate != null) {
            Swal.fire("错误提醒", "开始时间不能大于结束时间", "warning");
        } else {

            snapshot.forEach(function (childSnapshot) {

                var date = childSnapshot.child("date").val();

                if (startDate != null && endDate == null && new Date(date) >= new Date(startDate)) {
    
                    generateTransactionTable(childSnapshot);
    
                } else if (startDate == null && endDate != null && new Date(date) <= new Date(endDate)) {
    
                    generateTransactionTable(childSnapshot);
    
                } else if (startDate != null && endDate != null && new Date(date) >= new Date(startDate) && new Date(date) <= new Date(endDate)) {
    
                    generateTransactionTable(childSnapshot);
    
                } else if (startDate == null && endDate == null) {
    
                    generateTransactionTable(childSnapshot);
    
                }

            });
        }
    });

   

}

function generateTransactionTable(data) {

    var table = document.getElementById('transaction_table');
    var memberId = data.child("memberId").val();
    var transactionDate = data.child("date").val();
    var transactionType = data.child("type").val();
    var transactionAmount = data.child("amount").val();
    var transactionDiscountRate = data.child("discountRate").val();
    var transactionStatus = data.child("status").val();
    var transactionEmployee = data.child("employeeId").val();
    var transactionNote = data.child("note").val();
    var transactionTypeConv;
    if (transactionType == 'spendCredit') {
        transactionTypeConv = "消费";
    } else if (transactionType == 'addCredit') {
        transactionTypeConv = "充值";
    } else {
        transactionTypeConv = "开户";
    }
;
    var query = firebase.database().ref('employees/'+transactionEmployee);

    employeeName = query.on("value", function (snapshot) {

        var employeeName = snapshot.child('employeeName').val();

        memberInfoLookUpTable(memberId).then(function (result) {

            if(transactionNote===null || transactionNote ===''){
                transactionNote='未备注';
            }
            var row = '<tr>' +
                '<td>' + memberId + '</td>' +
                '<td>' + result['memberName'] + '</td>' +
                '<td>' + result['memberPetName'] + '</td>' +
                '<td>' + result['memberPhone'] + '</td>' +
                '<td>' + transactionDate + '</td>' +
                '<td>' + transactionTypeConv + '</td>' +
                '<td>$'+ transactionAmount + '</td>' +
                '<td>' + transactionDiscountRate + '</td>' +
                '<td>' + employeeName + '</td>' +
                '<td>' + transactionStatus + '</td>' +
                '<td><i class="fa fa-search" onclick="Swal.fire('+"'备注详情',"+"'"+transactionNote+"'"+')">查看备注</i></td>' +
                '</tr>';    
            table.innerHTML += row;
        });
    
    });
}

jQuery(document).ready(function ($) {

    $("input[id='search_transaction_memberId']").on({
        click: function () {
            $(this).val('');
        },
        blur: function () {
            let isNum = /^\d+$/.test($(this).val());
            if(isNum){
                formatMemberId($(this));
            }
        }
    });

    isAdmin("adminsection");
});

function formatMemberId(input) {
    var input_val= input.val();
    var output = 'PH'+(100000+Number(input_val));
    input.val(output);
}


function getEmployeeNameById(employeeId){
    var employeeName; 
    var query = firebase.database().ref('employees/'+employeeId);

    employeeName = query.on("value", function (snapshot) {
        employeeName = snapshot.child('employeeName').val();
    });
    return employeeName;
}