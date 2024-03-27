$(document).ready(function () {


    generateNewEmployeeId();
    employeeSelectedOptionForAdminManagement();
    readEmployeeInfoTable();
    readAcctUserInfoTable('acctUserInfo_table');
    readAcctUserInfoTable('acctUserInfo_table_copy');
    isAdmin("adminsection");



    $("input[type='tel']").on({
        click: function () {
            $(this).val('');
        },
        keyup: function () {
            formatPhone($(this));
        }
    });


    $("input[id='memberBalanceInfo']").on({
        click: function () {
            $(this).val('');
        },
        keyup: function () {
            wrapCurrency($(this));
        },
        blur: function () {
            let isNum = /^\d+$/.test($(this).val());
            if (isNum) {
                calDiscountRate($(this).val(), 'memberDiscountRateInfo');
                formatCurrency($(this));
            }
        }
    });

    $("input[id='memberIdSearchingForEditInfo']").on({
        click: function () {
            $(this).val('');
        },
        blur: function () {
            let isNum = /^\d+$/.test($(this).val());
            if (isNum) {
                formatMemberId($(this));
            }
        }
    });


    $("input[id='transactionAmountInfo']").on({
        click: function () {
            $(this).val('');
        },
        keyup: function () {
            wrapCurrency($(this));
        },
        blur: function () {
            let isNum = /^\d+$/.test($(this).val());
            if (isNum) {
                formatCurrency($(this));
            }
        }
    });

    $("input[id='employeeIdSearchingForEditInfo']").on({
        click: function () {
            $(this).val('');
        },
        blur: function () {
            let isNum = /^\d+$/.test($(this).val());
            if (isNum) {
                formatEmployeeId($(this));
            }
        }
    });
});

let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

function wrapCurrency(input) {
    var output;
    output = input.val().replace(/[^0-9]/g, '');
    input.val(output);
}

function formatCurrency(input) {
    var input_val = input.val();
    input.val(USDollar.format(input_val));
}

function convertCurrencyToNumber(currencyStr) {
    return Number(currencyStr.replace(/[^0-9.-]+/g, ""));
}

function formatMemberId(input) {
    var input_val = input.val();
    var output = 'PH' + (100000 + Number(input_val));
    input.val(output);
}

function formatEmployeeId(input) {
    var input_val = input.val();
    var output = 'PHE' + (1000 + Number(input_val));
    input.val(output);
}

function formatPhone(input) {
    var phoneValue = input.val();
    var output;
    output = wrapPhoneNumber(phoneValue);
    input.val(output);
}

function wrapPhoneNumber(phoneValue) {
    var output;
    phoneValue = phoneValue.replace(/[^0-9]/g, '');
    var area = phoneValue.substr(0, 3);
    var pre = phoneValue.substr(3, 3);
    var tel = phoneValue.substr(6, 4);
    if (area.length < 3) {
        output = "(" + area;
    } else if (area.length == 3 && pre.length < 3) {
        output = "(" + area + ")" + " " + pre;
    } else if (area.length == 3 && pre.length == 3) {
        output = "(" + area + ")" + " " + pre + " - " + tel;
    }
    return output;

}


function employeeSelectedOptionForAdminManagement() {

    var employeeInfo = firebase.database().ref('employees/').orderByKey();
    employeeInfo.on("value", function (snapshot) {
        var employeeSelectAttr = document.getElementById('addNewMemberByEmployeeInfo');
        var employeeSelectAttr1 = document.getElementById('search_employeeId_selection');
        var employeeSelectAttr2 = document.getElementById('transactionByEmployeeInfo');
        snapshot.forEach(function (childSnapshot) {
            var employeeId = childSnapshot.key;
            var employeeName = childSnapshot.child("employeeName").val();
            const opt = document.createElement("option");
            const opt1 = document.createElement("option");
            const opt2 = document.createElement("option");

            opt.value = employeeId;
            opt.text = employeeName;
            opt1.value = employeeId;
            opt1.text = employeeName;
            opt2.value = employeeId;
            opt2.text = employeeName;
            employeeSelectAttr.add(opt, null);
            employeeSelectAttr1.add(opt1, null);
            employeeSelectAttr2.add(opt2, null);
        });

    });
}

var current_employee_for_new_member;

function findMemberByIdForEditInfo() {

    var memberId = document.getElementById('memberIdSearchingForEditInfo').value.trim();

    if (memberId == null || memberId == "") {

        Swal.fire("错误提醒", "请输入会员账号", "warning");

    } else {

        var memberInfo = firebase.database().ref('members/' + memberId);
        memberInfo.once('value').then(snapshot => {
            var Data = snapshot;
            if (!snapshot.exists()) {
                Swal.fire("错误提醒", "查询的会员账号： " + snapshot.key + " 不存在", "error");
                document.getElementById('memberIdInfo').value = null;
                document.getElementById('memberNameInfo').value = null;
                document.getElementById('memberPetNameInfo').value = null;
                document.getElementById('memberPetBreedInfo').value = null;
                document.getElementById('memberPetGenderInfo').value = null;
                document.getElementById('memberJoinDateInfo').value = null;
                document.getElementById('memberPhoneInfo').value = null;
                document.getElementById('memberBalanceInfo').value = null;
                document.getElementById('memberDiscountRateInfo').value = null;
                document.getElementById('addNewMemberByEmployee').value = null;
                document.getElementById('addNewMemberNoteInfo').value = null;
            } else {
                var memberId = Data.key;
                var memberName = Data.child("memberName").val();
                var memberPetName = Data.child("memberPetName").val();
                var memberPetBreed = Data.child("memberPetBreed").val();
                var memberPetGender = Data.child("memberPetGender").val();
                var memberJoinDate = Data.child('memberJoinDate').val();
                var memberPhone = Data.child("memberPhone").val();
                var memberDiscountRate = Data.child("memberDiscountRate").val();
                var memberBalance = Data.child("memberBalance").val();
                var addNewMemberByEmployee = Data.child("employee").val();
                var addNewMemberNote = Data.child("note").val();

                current_employee_for_new_member = addNewMemberByEmployee;

                document.getElementById('memberIdInfo').value = memberId;
                document.getElementById('memberNameInfo').value = memberName;
                document.getElementById('memberPetNameInfo').value = memberPetName;
                document.getElementById('memberPetBreedInfo').value = memberPetBreed;
                document.getElementById('memberPetGenderInfo').value = memberPetGender;
                document.getElementById('memberJoinDateInfo').value = memberJoinDate;
                document.getElementById('memberPhoneInfo').value = memberPhone;
                document.getElementById('memberBalanceInfo').value = memberBalance;
                document.getElementById('memberDiscountRateInfo').value = memberDiscountRate;
                document.getElementById('addNewMemberByEmployeeInfo').value = addNewMemberByEmployee;
                document.getElementById('addNewMemberNoteInfo').value = addNewMemberNote;
            }
        });
    }
}

function findEmployeeByIdForEditInfo() {

    var employeeId = document.getElementById('employeeIdSearchingForEditInfo').value.trim();

    if (employeeId == null || employeeId == "") {
        Swal.fire("错误提醒", "请输入员工账号", "warning");
    } else {

        var memberInfo = firebase.database().ref('employees/' + employeeId);
        memberInfo.once('value').then(snapshot => {
            var Data = snapshot;
            if (!snapshot.exists()) {

                Swal.fire("错误提醒", "查询的员工账号： " + snapshot.key + " 不存在", "error");
                document.getElementById('employeeIdInfo').value = null;
                document.getElementById('employeeNameInfo').value = null;
                document.getElementById('employeePhoneInfo').value = null;
                document.getElementById('employeePositionInfo').value = null;
                document.getElementById('employeeNoteInfo').value = null;

            } else {

                var employeeId = Data.key;
                var employeeName = Data.child("employeeName").val();
                var employeePhone = Data.child("employeePhone").val();
                var employeePosition = Data.child("employeePosition").val();
                var employeeNote = Data.child("employeeNote").val();
                document.getElementById('employeeIdInfo').value = employeeId;
                document.getElementById('employeeNameInfo').value = employeeName;
                document.getElementById('employeePhoneInfo').value = employeePhone;
                document.getElementById('employeePositionInfo').value = employeePosition;
                document.getElementById('employeeNoteInfo').value = employeeNote;
            }
        });
    }
}


function findTransactionByIdForEditInfo() {

    var transactionId = document.getElementById('transactionIdSearchingForEditInfo').value.trim();

    if (transactionId == null || transactionId == "") {

        Swal.fire("错误提醒", "请输入交易查询号", "warning");

    } else {

        var transactionInfo = firebase.database().ref('transactions/' + transactionId);
        transactionInfo.once('value').then(snapshot => {

            var Data = snapshot;
            if (!snapshot.exists()) {
                Swal.fire("错误提醒", "查询的交易号： " + snapshot.key + " 不存在", "error");
                document.getElementById('transactionIdInfo').value = null;
                document.getElementById('transactionTypeInfo').value = null;
                document.getElementById('transactionMemberIdInfo').value = null;
                document.getElementById('transactionStatusInfo').value = null;
                document.getElementById('transactionDateInfo').value = null;
                document.getElementById('transactionAmountInfo').value = null;
                document.getElementById('transactionByEmployeeInfo').value = null;
                document.getElementById('transactionDiscountRateInfo').value = null;
                document.getElementById('transactionNoteInfo').value = null;

            } else {
                var transactionId = Data.key;
                var transactionType = Data.child("type").val();
                var transactionMemberId = Data.child("memberId").val();
                var transactionDate = Data.child("date").val();
                var transactionAmount = Data.child("amount").val();
                var transactionEmployeeId = Data.child('employeeId').val();
                var transactionStatus = Data.child('status').val();
                var transactionNote = Data.child("note").val();
                var transactionDiscountRate = Data.child("discountRate").val();

                document.getElementById('transactionIdInfo').value = transactionId;
                document.getElementById('transactionTypeInfo').value = transactionType;
                document.getElementById('transactionMemberIdInfo').value = transactionMemberId;
                document.getElementById('transactionDateInfo').value = transactionDate;
                document.getElementById('transactionAmountInfo').value = USDollar.format(transactionAmount);
                document.getElementById('transactionByEmployeeInfo').value = transactionEmployeeId;
                document.getElementById('transactionStatusInfo').value = transactionStatus;
                document.getElementById('transactionDiscountRateInfo').value = transactionDiscountRate;
                document.getElementById('transactionNoteInfo').value = transactionNote;
            }
        });
    }
}


function updateMemberInfo() {

    var memberId = document.getElementById('memberIdInfo').value.trim();
    if (memberId == null || memberId == "") {
        Swal.fire("错误提醒", "请输入会员账号", "warning");
    } else if(!updateMemberInfoValidation()){
        return;
    } else{

        memberName = document.getElementById('memberNameInfo').value;
        memberPetName = document.getElementById('memberPetNameInfo').value;
        memberPetBreed = document.getElementById('memberPetBreedInfo').value;
        memberPetGender = document.getElementById('memberPetGenderInfo').value;
        memberJoinDate = document.getElementById('memberJoinDateInfo').value;
        memberPhone = document.getElementById('memberPhoneInfo').value;
        memberBalance = document.getElementById('memberBalanceInfo').value;
        memberDiscountRate = document.getElementById('memberDiscountRateInfo').value;
        addNewMemberByEmployee = document.getElementById('addNewMemberByEmployeeInfo').value;
        addNewMemberNote = document.getElementById('addNewMemberNoteInfo').value;

        var memberInfo = firebase.database().ref('members/' + memberId);

        if (current_employee_for_new_member != addNewMemberByEmployee) {
            updateTransactionForEmployeeChange(memberId, addNewMemberByEmployee);
        }

        memberInfo.update({ 'memberName': memberName, 'memberPetName': memberPetName, 'memberPetBreed': memberPetBreed, 'memberPetGender': memberPetGender, 'memberJoinDate': memberJoinDate, 'memberPhone': memberPhone, 'memberBalance': memberBalance, 'memberDiscountRate': memberDiscountRate, 'employee': addNewMemberByEmployee, 'note': addNewMemberNote });

        Swal.fire("成功", "会员信息已保存", "success").then(() => {
            location.reload();
        });
    }
}


function updateEmployeeInfo() {

    var employeeId = document.getElementById('employeeIdInfo').value.trim();
    var employeeName = document.getElementById('employeeNameInfo').value;
    if (employeeId == null || employeeId == "") {
        Swal.fire("错误提醒", "请输入员工账号", "warning");
    } else if(employeeName == null || employeeName == ""){
        Swal.fire("错误提醒", "请输入员工名字", "warning");
    } else{
        var employeePhone = document.getElementById('employeePhoneInfo').value;
        var employeePosition = document.getElementById('employeePositionInfo').value;
        var employeeNote = document.getElementById('employeeNoteInfo').value;

        var employeeInfo = firebase.database().ref('employees/' + employeeId);

        employeeInfo.update({ 'employeeName': employeeName, 'employeePhone': employeePhone, 'employeePosition': employeePosition, 'employeeNote': employeeNote });

        Swal.fire("成功", "员工信息已保存", "success").then(() => {
            location.reload();
        });
    }

}




function voidTransactionInfo() {

    var transactionId = document.getElementById('transactionIdInfo').value.trim();
    var status = document.getElementById('transactionStatusInfo').value.trim();

    if (transactionId == null || transactionId == "") {
        Swal.fire("错误提醒", "请输入交易查询号", "warning");
    } else if (status === 'void') {
        Swal.fire("错误提醒", "订单已经被消除，不可以修改", "warning");
    } else {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            }, buttonsStyling: true
        });
        swalWithBootstrapButtons.fire({
            title: '确定要取消交易订单吗?',
            text: "订单号#" + transactionId,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                memberAcctHandlerForVoidTransaction(transactionId);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire('修改失败', '本次修改已取消', 'error');
            }
        });
    }
}


function updateTransactionInfo() {

    var transactionId = document.getElementById('transactionIdInfo').value.trim();
    var status = document.getElementById('transactionStatusInfo').value.trim();
    var transactionType = document.getElementById('transactionTypeInfo').value;
    var transactionDate = document.getElementById('transactionDateInfo').value;
    var transactionAmount = convertCurrencyToNumber(document.getElementById('transactionAmountInfo').value);
    var transactionMemberId = document.getElementById('transactionMemberIdInfo').value;
    var transactionDiscountRate = Number(document.getElementById('transactionDiscountRateInfo').value);
    var transactionByEmployee = document.getElementById('transactionByEmployeeInfo').value;
    var transactionNote = document.getElementById('transactionNoteInfo').value;
    var UpdatedTransactionInfoDetail = {
        'memberId': transactionMemberId,
        'amount': transactionAmount,
        'type': transactionType,
        'date': transactionDate,
        'employeeId': transactionByEmployee,
        'discountRate': transactionDiscountRate,
        'status': 'paid',
        'note': transactionNote
    };

    if (transactionId == null || transactionId == "") {
        Swal.fire("错误提醒", "请输入交易查询号", "warning");
    } else if(!updateTransactionValidation()){
        return;
    }else if (status === 'void') {
        Swal.fire("错误提醒", "订单已经被消除，不可以修改", "warning");
    } else {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            }, buttonsStyling: true
        });
        swalWithBootstrapButtons.fire({
            title: '确定要修改交易订单吗?',
            text: "订单号#" + transactionId,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                memberAcctHandlerForUpdateTransaction(transactionId, UpdatedTransactionInfoDetail);

            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire('修改失败', '本次修改已取消', 'error');
            }
        });

    }
}

function memberAcctHandlerForVoidTransaction(transactionId) {

    var transactionInfo = firebase.database().ref('transactions/' + transactionId);

    //Modify user acct back to original amount
    transactionInfo.once('value').then(snapshot => {
        if (snapshot.exists()) {
            var transactionType = snapshot.child("type").val();
            var transactionMemberId = snapshot.child("memberId").val();
            var transactionAmount = snapshot.child("amount").val();
            var transactionDiscountRate = snapshot.child("discountRate").val();
            memberAcctModify(transactionType, transactionMemberId, transactionAmount, transactionDiscountRate);
        }
    });

    // make transaction status as void
    markTransactionAsVoid(transactionId);
}

function memberAcctHandlerForUpdateTransaction(oldTransactionId, UpdatedTransactionInfoDetail) {

    var transactionInfo = firebase.database().ref('transactions/' + oldTransactionId);

    //Modify user acct back to original amount
    transactionInfo.once('value').then(snapshot => {
        if (snapshot.exists()) {
            var transactionAmount = snapshot.child("amount").val();
            var transactionType = snapshot.child("type").val();
            var transactionMemberId = snapshot.child("memberId").val();
            var transactionAmount = snapshot.child("amount").val();
            var transactionDiscountRate = snapshot.child("discountRate").val();
            memberAcctModify(transactionType, transactionMemberId, transactionAmount - UpdatedTransactionInfoDetail.amount, transactionDiscountRate);
        }
    });

    // make transaction status as void
    var transactionInfo = firebase.database().ref('transactions/');
    const newTransactionId = generateTransactionId();
    UpdatedTransactionInfoDetail.note = UpdatedTransactionInfoDetail.note + " [Ref: void transactionId: " + oldTransactionId + "]";
    transactionInfo.child(newTransactionId).set(UpdatedTransactionInfoDetail);
    transactionInfo.child(oldTransactionId).update({
        'status': 'void'
    });
    document.getElementById('transactionIdSearchingForEditInfo').value = newTransactionId;
    findTransactionByIdForEditInfo();
    Swal.fire("成功", "新订单已生成,订单号: " + newTransactionId);
}

function markTransactionAsVoid(transactionId) {
    var transactionInfo = firebase.database().ref('transactions/' + transactionId);
    transactionInfo.update({
        'status': 'void'
    });
    findTransactionByIdForEditInfo();
    Swal.fire("成功", "交易号：" + transactionId + " 已被取消", "success");
}

function memberAcctModify(transactionType, transactionMemberId, transactionAmount, transactionDiscountRate) {
    var memberInfo = firebase.database().ref('members/' + transactionMemberId);
    var backward_amount;
    memberInfo.once('value').then(snapshot => {
        var Data = snapshot;
        if (snapshot.exists()) {
            var isValidTransaction = true;
            var memberBalance = Data.child("memberBalance").val();
            if (transactionType === 'spendCredit') {
                backward_amount = memberBalance + transactionAmount;
                if (backward_amount < 0) {
                    isValidTransaction = false;
                    Swal.fire("错误提醒", "当前消费余额不足，请确认消费金额！", "warning");
                }

            } else { // add credit or new member
                backward_amount = memberBalance - transactionAmount;
            }

            if (isValidTransaction) {
                memberInfo.update({ 'memberBalance': backward_amount, 'memberDiscountRate': transactionDiscountRate });
                Swal.fire("成功", "用户：" + transactionMemberId + " 金额 $" + transactionAmount + "已经返还. 用户最新余额为：$" + backward_amount, "success");
            }

        }
    });

}


function updateTransactionForEmployeeChange(memberId, newEmployeeId) {

    var transactionInfo = firebase.database().ref('transactions/');

    transactionInfo.orderByChild('type').equalTo('newMember').on("value", function (snapshot) {

        snapshot.forEach(function (data) {

            if (data.child('memberId').val() == memberId) {
                data.ref.update({
                    "employeeId": newEmployeeId
                });
            }
        });
    });

}


function searchTransactionsForCommission() {

    var employeeId = document.getElementById('search_employeeId_selection').value;
    var startDate = document.getElementById('search_commission_start_date').valueAsDate;
    var endDate = document.getElementById('search_commission_end_date').valueAsDate;
    var tableBody = document.getElementById('commissionInfo_table');

    tableBody.innerHTML = null;

    if (employeeId == "") {
        Swal.fire("错误提醒", "请选择要查询的员工", "warning");
    }
    else if (startDate > endDate && startDate != null && endDate != null) {
        Swal.fire("错误提醒", "开始时间不能大于结束时间", "warning");
    } else {
        searchTransactionByemployeeIdAndTime(employeeId, startDate, endDate);
    }

}

function searchTransactionByemployeeIdAndTime(employeeId, startDate, endDate) {

    var commissionTotal = 0;
    var transactionInfo = firebase.database().ref('transactions/');

    transactionInfo.orderByChild('type').equalTo('newMember').on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var Data = childSnapshot;
            if (Data.child("employeeId").val() == employeeId) {
                var amount = Data.child("amount").val();
                var date = Data.child("date").val();
                var memberId = Data.child("memberId").val();
                var transactionId = Data.key;
                var tableBody = document.getElementById('commissionInfo_table');
                if (startDate == null && endDate == null) {
                    var row = '<tr>' +
                        '<td>' + employeeId + '</td>' +
                        '<td>' + memberId + '</td>' +
                        '<td>$' + amount + '</td>' +
                        '<td>' + transactionId + '</td>' +
                        '<td>' + date + '</td>' +
                        '</tr>';
                    tableBody.innerHTML += row;
                    commissionTotal += Number(amount);
                } else if (startDate != null && endDate == null && new Date(date) >= new Date(startDate)) {
                    var row = '<tr>' +
                        '<td>' + employeeId + '</td>' +
                        '<td>' + memberId + '</td>' +
                        '<td>$' + amount + '</td>' +
                        '<td>' + transactionId + '</td>' +
                        '<td>' + date + '</td>' +
                        '</tr>';
                    tableBody.innerHTML += row;
                    commissionTotal += Number(amount);

                } else if (startDate == null && endDate != null && new Date(date) <= new Date(endDate)) {
                    var row = '<tr>' +
                        '<td>' + employeeId + '</td>' +
                        '<td>' + memberId + '</td>' +
                        '<td>$' + amount + '</td>' +
                        '<td>' + transactionId + '</td>' +
                        '<td>' + date + '</td>' +
                        '</tr>';
                    tableBody.innerHTML += row;
                    commissionTotal += Number(amount);

                } else if (startDate != null && endDate != null && new Date(date) >= new Date(startDate) && new Date(date) <= new Date(endDate)) {
                    var row = '<tr>' +
                        '<td>' + employeeId + '</td>' +
                        '<td>' + memberId + '</td>' +
                        '<td>$' + amount + '</td>' +
                        '<td>' + transactionId + '</td>' +
                        '<td>' + date + '</td>' +
                        '</tr>';
                    tableBody.innerHTML += row;
                    commissionTotal += Number(amount);
                }
            }
            document.getElementById('commission_total').innerHTML = commissionTotal;

        });
    });
}


function addEmployee() {
    var employeeName = document.getElementById('employeeNameForAdding').value.trim();
    if (employeeName == null || employeeName == "") {
        Swal.fire("错误提醒", "请输入员工名字", "warning");
    } else {
        var employeeId = document.getElementById('employeeIdForAdding').value;
        var employeeName = document.getElementById('employeeNameForAdding').value;
        var employeePosition = document.getElementById('employeePositionForAdding').value;
        var employeePhone = document.getElementById('employeePhoneForAdding').value;
        var employeeInfo = firebase.database().ref('employees/' + employeeId);
        employeeInfo.set({ 'employeeName': employeeName, 'employeePosition': employeePosition, 'employeePhone': employeePhone });
        Swal.fire("成功", "会员信息已保存", "success");
        // location.reload();
    }

}



function updateAdminRole() {
    var email = document.getElementById('adminRoleEmailForUpdate').value.trim().toLowerCase();
    if (email == null || email == "") {
        Swal.fire("错误提醒", "请输入邮箱", "warning");
    } else {
        var isAdminRole = document.getElementById('isAdminRoleForUpdate').value;
        userEmailLookUpTable(email).then(function (uid) {
            if (uid != null) {
                var usersInfo = firebase.database().ref('users/' + uid);
                usersInfo.update({ 'isAdmin': isAdminRole });
                Swal.fire("成功", "信息已保存", "success");
            } else {
                Swal.fire("失败", "邮箱错误", "error");
            }
        });
    }
}



function generateNewEmployeeId() {
    firebase.database().ref('employees/').on("value", function (snapshot) {
        var employeeBasedId = 1000;
        var employeePrefix = 'PHE';
        var newEmployeeBasedId = employeeBasedId + snapshot.numChildren() + 1;
        var newEmployeeId = employeePrefix + newEmployeeBasedId;
        document.getElementById('employeeIdForAdding').value = newEmployeeId;
    })
}

function readEmployeeInfoTable() {

    var query = firebase.database().ref('employees/').orderByKey();

    query.on("value", function (snapshot) {

        var table = document.getElementById('employeeInfo_table');

        // clear up old data to reduce duplication
        table.innerHTML = null;

        snapshot.forEach(function (childSnapshot) {
            var table = document.getElementById('employeeInfo_table');
            var employeeId = childSnapshot.key;
            var employeeName = childSnapshot.child("employeeName").val();
            var employeePhone = childSnapshot.child("employeePhone").val();
            var employeePosition = childSnapshot.child("employeePosition").val();


            var row = '<tr>' +
                '<td>' + employeeId + '</td>' +
                '<td>' + employeeName + '</td>' +
                '<td>' + employeePhone + '</td>' +
                '<td>' + employeePosition + '</td>' +
                '</tr>';
            table.innerHTML += row;

        });
    });
}


function addAcctUser() {
    var uid = document.getElementById('acctUserIdForAdd').value.trim();
    var email = document.getElementById('acctUserEmailForAdd').value.trim().toLowerCase();
    var isAdminRole = document.getElementById('acctUserRoleForAdd').value;
    if (email == null || email == "") {
        Swal.fire("错误提醒", "请输入邮箱", "warning");
    } else if (uid == null || uid == "") {
        Swal.fire("错误提醒", "请输入用户ID", "warning");
    } else {
        var usersInfo = firebase.database().ref('users/' + uid);
        usersInfo.set({ 'email': email, 'isAdmin': isAdminRole });
        Swal.fire("成功", "用户已经添加", "success");
    }
}


function readAcctUserInfoTable(tableId) {

    var query = firebase.database().ref('users/').orderByKey();

    query.on("value", function (snapshot) {

        var table = document.getElementById(tableId);

        // clear up old data to reduce duplication
        table.innerHTML = null;

        snapshot.forEach(function (childSnapshot) {
            var table = document.getElementById(tableId);
            var email = childSnapshot.child("email").val();
            var isAdminRole = childSnapshot.child("isAdmin").val();
            var row = '<tr>' +
                '<td>' + email + '</td>' +
                '<td>' + isAdminRole + '</td>' +
                '</tr>';
            table.innerHTML += row;

        });
    });
}




function updateSetting() {
    var emailNotificationOn = document.getElementById('emailNotification').checked;
    var discountRateEditable = document.getElementById('discountRateEditable').checked;
    var discountRateAutoApply = document.getElementById('discountRateAutoApply').checked;
    var duplicatedPhoneCheck = document.getElementById('duplicatedPhoneCheck').checked;
    var settingInfo = firebase.database().ref('setting/');
    settingInfo.set({ 'emailNotification': emailNotificationOn, 'discountRateEditable': discountRateEditable, 'discountRateAutoApply': discountRateAutoApply, 'duplicatedPhoneCheck': duplicatedPhoneCheck });
    Swal.fire("成功", "设置已更改", "success");
}


function loadingSetting() {

    var settingInfo = firebase.database().ref('setting/');
    settingInfo.on("value", function (snapshot) {
        document.getElementById('emailNotification').checked = snapshot.child('emailNotification').val();
        document.getElementById('discountRateEditable').checked = snapshot.child('discountRateEditable').val();
        document.getElementById('discountRateAutoApply').checked = snapshot.child('discountRateAutoApply').val();
        document.getElementById('duplicatedPhoneCheck').checked = snapshot.child('duplicatedPhoneCheck').val();
    });
}