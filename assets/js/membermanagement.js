$(document).ready(function () {

    emailjs.init('xvV7CVzEmcHnWPBZt');//publcic key 

    $("input[type='tel']").on({
        click: function () {
            $(this).val('');
        },
        keyup: function () {
            formatPhone($(this));
        }
    });

    $("input[id='memberBalance']").on({
        click: function () {
            $(this).val('');
        },
        keyup: function () {
            wrapCurrency($(this));  
        },
        blur: function () {
            let isNum = /^\d+$/.test($(this).val());
            if(isNum){
                calDiscountRate($(this).val(), 'memberDiscountRate');
                formatCurrency($(this));
            }
        }
    });

    $("input[id='add_credit_member_balance']").on({
        click: function () {
            $(this).val('');
        },
        keyup: function () {
            wrapCurrency($(this));
        },
        blur: function () {
            let isNum = /^\d+$/.test($(this).val());
            if(isNum){
                calDiscountRate($(this).val(), 'add_credit_discountRate');
                formatCurrency($(this));
            }
        }
    });

    $("input[id='member_spend_credit_balance_original']").on({
        click: function () {
            $(this).val('');
        },
        keyup: function () {
            wrapCurrency($(this));
        },
        blur: function () {
            let isNum = /^\d+$/.test($(this).val());
            var originalAmount = Number($(this).val());
            if(isNum){
                var settingInfo = firebase.database().ref('setting/');
                settingInfo.on("value", function (snapshot) {
                    var isEnable =snapshot.child('discountRateAutoApply').val();
                    if(isEnable){
                        var discountRate = document.getElementById('memberDiscountRateSearchedForSpendCredit').value;
                        let USDollar = new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                        });
                        document.getElementById('member_spend_credit_balance').value = USDollar.format((originalAmount * Number(discountRate)));
                    }
                });
                formatCurrency($(this));
            }
        }
    });

    $("input[id='member_spend_credit_balance']").on({
        click: function () {
            $(this).val('');
        },
        keyup: function () {
            wrapCurrency($(this));
        },
        blur: function () {
            let isNum = /^\d+$/.test($(this).val());
            if(isNum){
                formatCurrency($(this));
            }
        }
    });

    $("input[id='memberIdSearchingForAddCredit']").on({
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

    $("input[id='memberIdSearchingForSpendCredit']").on({
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


    $("input[id='search_member_value']").on({
        keyup: function () {
            var searchType = document.getElementById('search_member_catagory').value;
            if(searchType ==='searchByMemberPhone'){
                formatPhone($(this));
            }
        },
        click: function () {
            var searchType = document.getElementById('search_member_catagory').value;
            if(searchType ==='searchByMemberId' || searchType ==='searchByMemberPhone'){
                $(this).val('');
            }  
        },
        blur: function () {
            var searchType = document.getElementById('search_member_catagory').value;
            if(searchType ==='searchByMemberId'){
                let isNum = /^\d+$/.test($(this).val());
                if(isNum){
                    formatMemberId($(this));
                }
            }  
        }
    });

    var currentTZ = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York' });
    var nyDate = currentTZ.format(new Date());
    document.getElementById('memberJoinDate').valueAsDate = new Date(nyDate);
    document.getElementById('add_credit_date').valueAsDate = new Date(nyDate);
    document.getElementById('spend_credit_date').valueAsDate = new Date(nyDate);
    generateNewMemberId();
    employeeSelectedOptionForMemberManagement();
    discountRateEnable();
    isAdmin("adminsection");

});

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

function wrapCurrency(input) {
    var output;
    output = input.val().replace(/[^0-9]/g, '');
    input.val(output);
}


function formatCurrency(input) {
    var input_val= input.val();
    let USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    input.val(USDollar.format(input_val));
}

function formatMemberId(input) {
    var input_val= input.val();
    var output = 'PH'+(100000+Number(input_val));
    input.val(output);
}


function searchCatagoryReselect() {
    var catagory = document.getElementById('search_member_catagory').value;
    document.getElementById('search_member_value').value = "";
    if (catagory == "searchByMemberPhone") {
        document.getElementById('search_member_value').placeholder = "Enter Number Only";
    } else if (catagory == "searchByMemberId") {
        document.getElementById('search_member_value').placeholder = "PH1xxxxx";
    } else if (catagory == "searchByMemberPetName") {
        document.getElementById('search_member_value').placeholder = "Enter Pet Name";
    } else if (catagory == "searchByMemberName") {
        document.getElementById('search_member_value').placeholder = "Enter Member Name";
    }
}


function findMemberByIdForVIPManagement(searchCategoryType) {

    var memberId = document.getElementById('memberIdSearchingFor' + searchCategoryType).value.trim();
    document.getElementById('memberIdSearchedFor' + searchCategoryType).value = null;
    document.getElementById('memberNameSearchedFor' + searchCategoryType).value = null;
    document.getElementById('memberPetNameSearchedFor' + searchCategoryType).value = null;
    document.getElementById('memberPhoneSearchedFor' + searchCategoryType).value = null;
    document.getElementById('memberBalanceSearchedFor' + searchCategoryType).value = null;
    document.getElementById('memberDiscountRateSearchedFor' + searchCategoryType).value = null;

    if (memberId == null || memberId == "") {
        Swal.fire("错误提醒", "请输入会员账号", "warning");
    } else {
        memberInfoLookUpTable(memberId).then(function (result) {
            if (result != null) {
                document.getElementById('memberIdSearchedFor' + searchCategoryType).value = memberId;
                document.getElementById('memberNameSearchedFor' + searchCategoryType).value = result['memberName'];
                document.getElementById('memberPetNameSearchedFor' + searchCategoryType).value = result['memberPetName'];
                document.getElementById('memberPhoneSearchedFor' + searchCategoryType).value = result['memberPhone'];
                document.getElementById('memberBalanceSearchedFor' + searchCategoryType).value = result['memberBalance'];
                document.getElementById('memberDiscountRateSearchedFor' + searchCategoryType).value = result['memberDiscountRate'];
            }
        });
    }
}


function addCreditForMember() {

    var memberId = document.getElementById('memberIdSearchedForAddCredit').value.trim();
    var creditAmount = convertCurrencyToNumber(document.getElementById('add_credit_member_balance').value.trim());
    var originalDiscountRate = Number(document.getElementById('memberDiscountRateSearchedForAddCredit').value.trim());


    if (memberId == null || memberId == "") {
        Swal.fire("错误提醒", "请先查询用户信息，确保充值用户正确", "warning");
    } else if(!addCreditValidation()){
        return;
    } else {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            }, buttonsStyling: true
        });
        swalWithBootstrapButtons.fire({
            title: '确定充值?',
            text: "请确定为会员# " + memberId + " :充值 $" + creditAmount,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                var memberId = document.getElementById('memberIdSearchedForAddCredit').value.trim();
                var memberBalance = document.getElementById('memberBalanceSearchedForAddCredit').value.trim();
                var addCreditDate = document.getElementById('add_credit_date').value.trim();
                var addCreditEmployee = document.getElementById('add_credit_employeeName').value.trim();
                var newDiscountRate = Number(document.getElementById('add_credit_discountRate').value.trim());

                var addCreditNote = document.getElementById('add_credit_note').value;
                var newBalance = parseInt(memberBalance) + parseInt(creditAmount);
                var memberInfo = firebase.database().ref('members/' + memberId);
                memberInfo.update({
                    'memberBalance': newBalance,
                    'memberDiscountRate': newDiscountRate
                });
                const transactionId = generateTransactionId();
                var transactionInfo = firebase.database().ref('transactions/' + transactionId);
                transactionInfo.set({
                    'memberId': memberId,
                    'amount': creditAmount,
                    'discountRate': originalDiscountRate,
                    'type': 'addCredit',
                    'date': addCreditDate,
                    'employeeId': addCreditEmployee,
                    'status' : 'paid',
                    'note': addCreditNote
                });
                var message = "操作类型：充值，会员号：" + memberId + ",金额：" + creditAmount + ",员工：" + addCreditEmployee + ",日期：" + addCreditDate + ",最新会员折扣： "+ newDiscountRate;
                sendEmailEnable(message);
                swalWithBootstrapButtons.fire("充值成功", "会员: " + memberId + " 已充值 $" + creditAmount + ". 请重新查询最新信息", "success").then(() => {
                    location.reload();
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire('充值失败', '本次充值已取消', 'error');
            }
        });
    }
}



function spendCreditForMember() {

    var memberId = document.getElementById('memberIdSearchedForSpendCredit').value.trim();
    var creditAmount = convertCurrencyToNumber(document.getElementById('member_spend_credit_balance').value.trim());

    if (memberId == null || memberId == "") {
        Swal.fire("错误提醒", "请先查询用户信息，确保充值用户正确", "warning");
    } else if (!spendCreditValidation()) {
        return;    
    } else {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            }, buttonsStyling: true
        });

        swalWithBootstrapButtons.fire({
            title: '确定消费?',
            text: "请确定为会员# " + memberId + " :消费 $" + creditAmount,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {

                var memberId = document.getElementById('memberIdSearchedForSpendCredit').value.trim();
                var memberBalance = document.getElementById('memberBalanceSearchedForSpendCredit').value.trim();
                var memberDiscountRate = Number(document.getElementById('memberDiscountRateSearchedForSpendCredit').value.trim());
                var newBalance = parseInt(memberBalance) - parseInt(creditAmount);

                if (newBalance < 0) {
                    swalWithBootstrapButtons.fire("余额不足", "会员: " + memberId + " 余额 $" + memberBalance + ". 请先充值！", "warning");
                } else {
                    var memberInfo = firebase.database().ref('members/' + memberId);
                    memberInfo.update({
                        memberBalance: newBalance,
                    })

                    var spendCreditDate = document.getElementById('spend_credit_date').value.trim();
                    var spendCreditEmployee = document.getElementById('spend_credit_employeeName').value.trim();
                    var spendCreditNote = document.getElementById('spend_credit_note').value;

                    const transactionId = generateTransactionId();
                    var transactionInfo = firebase.database().ref('transactions/' + transactionId);
                    transactionInfo.set({
                        'memberId': memberId,
                        'amount': creditAmount,
                        'type': 'spendCredit',
                        'date': spendCreditDate,
                        'employeeId': spendCreditEmployee,
                        'discountRate': memberDiscountRate,
                        'status' : 'paid',
                        'note': spendCreditNote
                    });
                    var message = "操作类型：消费，会员号：" + memberId + ",金额：" + creditAmount + ",员工：" + spendCreditEmployee + ",日期：" + spendCreditDate;
                    sendEmailEnable(message);
                    swalWithBootstrapButtons.fire("消费成功", "会员: " + memberId + " 已消费 $" + creditAmount + ". 请重新查询最新信息", "success").then(() => { location.reload() });
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire('消费失败', '本次消费已取消', 'error');
            }
        });
    }
}


function addNewMember() {
    if(!addNewMemberValidation()){
        return;
    }
    var memberId = document.getElementById('memberId').value.trim();
    var memberName = document.getElementById('memberName').value.trim();
    var memberPetName = document.getElementById('memberPetName').value.trim();
    var memberPetBreed = document.getElementById('memberPetBreed').value.trim();
    var memberPetGender = document.getElementById('memberPetGender').value.trim();
    var memberJoinDate = document.getElementById('memberJoinDate').value.trim();
    var memberPhone = document.getElementById('memberPhone').value.trim();
    var memberBalance = convertCurrencyToNumber(document.getElementById('memberBalance').value.trim());
    var memberDiscountRate = Number(document.getElementById('memberDiscountRate').value.trim());
    var addNewMemberByEmployee = document.getElementById('addNewMemberByEmployee').value.trim();
    var addNewMemberNote = document.getElementById('addNewMemberNote').value.trim();

    var memberInfoDetails = { 'memberName': memberName, 'memberPetName': memberPetName, 'memberPetBreed': memberPetBreed, 'memberPetGender': memberPetGender, 'memberJoinDate': memberJoinDate, 'memberPhone': memberPhone, 'memberBalance': memberBalance, 'memberDiscountRate': memberDiscountRate, 'employee': addNewMemberByEmployee, 'note': addNewMemberNote };

    if (duplicatedPhoneCheckEnable()) {

        memberPhoneLookUpTable(memberPhone).then(function (isExistPhoneNumber) {
            if (isExistPhoneNumber) {
                Swal.fire("提醒", "电话号码已存在", "warning");
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger'
                    }, buttonsStyling: true
                });

                swalWithBootstrapButtons.fire({
                    title: '确定办理新会员?',
                    text: "会员# " + memberId + "电话号码已存在，请确定仍然办理新会员。",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        saveMemberInfo(memberId, memberInfoDetails);
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        swalWithBootstrapButtons.fire('办理失败', '本次办理已取消', 'error');
                    }
                });
            } else{
                saveMemberInfo(memberId, memberInfoDetails);
            }
        });
    }
    else {
        saveMemberInfo(memberId, memberInfoDetails);
    }
}

function saveMemberInfo(memberId, memberInfoDetails ) {

    firebase.database().ref('members/' + memberId).set(memberInfoDetails);

    const transactionId = generateTransactionId();
    var memberBalance = memberInfoDetails.memberBalance;
    var addNewMemberByEmployee = memberInfoDetails.employee;
    var memberJoinDate = memberInfoDetails.memberJoinDate;
    var addNewMemberNote = memberInfoDetails.note;
    var memberDiscountRate = memberInfoDetails.memberDiscountRate;

    var transactionInfoDetail = {
        'memberId': memberId,
        'amount': memberBalance,
        'type': 'newMember',
        'date': memberJoinDate,
        'employeeId': addNewMemberByEmployee,
        'discountRate': memberDiscountRate,
        'status': 'paid',
        'note': addNewMemberNote
    };

    saveTransactionInfo(transactionId,transactionInfoDetail);
    var message = "操作类型：开户，会员号：" + memberId + ",金额：" + memberBalance + ",员工：" + addNewMemberByEmployee + ",日期：" + memberJoinDate +", 折扣："+memberDiscountRate;
    sendEmailEnable(message);
    Swal.fire("办理成功", "新会员已经加入: " + memberId, "success").then(() => {
        location.reload()
    });
}

function saveTransactionInfo(transactionId, transactionInfoDetail){
    var transactionInfo = firebase.database().ref('transactions/' + transactionId);
    transactionInfo.set(transactionInfoDetail);

}


function searchMemberByCatagory() {

    var searchType = document.getElementById('search_member_catagory').value.trim();
    var searchValue = document.getElementById('search_member_value').value.trim();
    if (searchValue == null || searchValue == "") {
        Swal.fire("错误提醒", "查询内容不能为空", "warning");
    } else {
        if (searchType == 'searchByMemberId') {
            searchMemberByCatagoryMemberId(searchValue);
        }
        else if (searchType == 'searchByMemberName') {
            searchMemberByCatagoryMemberName(searchValue);
        }
        else if (searchType == 'searchByMemberPetName') {
            searchMemberByCatagoryPetName(searchValue);
        }
        else if (searchType == 'searchByMemberPhone') {
            searchMemberByCatagoryPhoneNumber(searchValue);
        }
    }
}


function searchMemberByCatagoryMemberId(memberId) {

    document.getElementById('memberInfo_table').innerHTML = null;

    var memberInfo = firebase.database().ref('members/' + memberId);
    memberInfo.once('value').then(snapshot => {
        console.log('User data: ', snapshot.key);
        var Data = snapshot;
        if (!snapshot.exists()) {
            Swal.fire("错误提醒", "查询的会员账号： " + snapshot.key + " 不存在", "error");
        } else {
            var memberId = Data.key;
            var memberName = Data.child("memberName").val();
            var memberPetName = Data.child("memberPetName").val();
            var memberJoinDate = Data.child("memberJoinDate").val();
            var memberPhone = Data.child("memberPhone").val();
            var memberDiscountRate = Data.child("memberDiscountRate").val();
            var memberBalance = Data.child("memberBalance").val();


            var tableBody = document.getElementById('memberInfo_table');

            var row = '<tr>' +
                '<td>' + memberId + '</td>' +
                '<td>' + memberName + '</td>' +
                '<td>' + memberPetName + '</td>' +
                '<td>' + memberJoinDate + '</td>' +
                '<td>' + memberPhone + '</td>' +
                '<td>$' + memberBalance + '</td>' +
                '<td>' + memberDiscountRate + '</td>' +
                '</tr>';
            tableBody.innerHTML += row;
        }
    });


}


function searchMemberByCatagoryMemberName(memberName) {

    document.getElementById('memberInfo_table').innerHTML = null;
    var membersSet = firebase.database().ref('members/').orderByKey();
    membersSet.on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var memberId = childSnapshot.key;
            var Data = childSnapshot;
            var memberNameInDb = Data.child("memberName").val();

            if (String(memberNameInDb).toUpperCase().includes(String(memberName).toUpperCase())) {

                var memberId = Data.key;
                var memberNameInDb = Data.child("memberName").val();
                var memberPetName = Data.child("memberPetName").val();
                var memberJoinDate = Data.child("memberJoinDate").val();
                var memberPhone = Data.child("memberPhone").val();
                var memberDiscountRate = Data.child("memberDiscountRate").val();
                var memberBalance = Data.child("memberBalance").val();

                var tableBody = document.getElementById('memberInfo_table');
                var row = '<tr>' +
                    '<td>' + memberId + '</td>' +
                    '<td>' + memberNameInDb + '</td>' +
                    '<td>' + memberPetName + '</td>' +
                    '<td>' + memberJoinDate + '</td>' +
                    '<td>' + memberPhone + '</td>' +
                    '<td>$' + memberBalance + '</td>' +
                    '<td>' + memberDiscountRate + '</td>' +
                    '</tr>';
                tableBody.innerHTML += row;

            }

        });
    });

    if (document.getElementById('memberInfo_table').innerHTML == "") {
        Swal.fire("错误提醒", "查询的会员名字： " + memberName + " 不存在", "error");
    }
}


function searchMemberByCatagoryPetName(petName) {

    document.getElementById('memberInfo_table').innerHTML = null;
    var membersSet = firebase.database().ref('members/').orderByKey();
    membersSet.on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var memberId = childSnapshot.key;
            var Data = childSnapshot;
            var petNameInDb = Data.child("memberPetName").val();

            if (String(petNameInDb).toUpperCase().includes(String(petName).toUpperCase())) {

                var memberId = Data.key;
                var memberName = Data.child("memberName").val();
                var memberPetNameInDb = Data.child("memberPetName").val();
                var memberJoinDate = Data.child("memberJoinDate").val();
                var memberPhone = Data.child("memberPhone").val();
                var memberDiscountRate = Data.child("memberDiscountRate").val();
                var memberBalance = Data.child("memberBalance").val();

                var tableBody = document.getElementById('memberInfo_table');
                var row = '<tr>' +
                    '<td>' + memberId + '</td>' +
                    '<td>' + memberName + '</td>' +
                    '<td>' + memberPetNameInDb + '</td>' +
                    '<td>' + memberJoinDate + '</td>' +
                    '<td>' + memberPhone + '</td>' +
                    '<td>$' + memberBalance + '</td>' +
                    '<td>' + memberDiscountRate + '</td>' +
                    '</tr>';
                tableBody.innerHTML += row;

            }

        });
    });

    if (document.getElementById('memberInfo_table').innerHTML == "") {
        Swal.fire("错误提醒", "查询的宠物名字： " + petName + " 不存在", "error");
    }
}


function searchMemberByCatagoryPhoneNumber(phoneNumber) {

    phoneNumber = wrapPhoneNumber(phoneNumber);
    document.getElementById('memberInfo_table').innerHTML = null;
    var membersSet = firebase.database().ref('members/').orderByKey();
    membersSet.on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var memberId = childSnapshot.key;
            var Data = childSnapshot;
            var phoneNumberInDb = Data.child("memberPhone").val();

            if (String(phoneNumberInDb).toUpperCase() === String(phoneNumber).toUpperCase()) {

                var memberId = Data.key;
                var memberName = Data.child("memberName").val();
                var memberPetName = Data.child("memberPetName").val();
                var memberJoinDate = Data.child("memberJoinDate").val();
                var memberPhoneInDb = Data.child("memberPhone").val();
                var memberDiscountRate = Data.child("memberDiscountRate").val();
                var memberBalance = Data.child("memberBalance").val();

                var tableBody = document.getElementById('memberInfo_table');
                var row = '<tr>' +
                    '<td>' + memberId + '</td>' +
                    '<td>' + memberName + '</td>' +
                    '<td>' + memberPetName + '</td>' +
                    '<td>' + memberJoinDate + '</td>' +
                    '<td>' + memberPhoneInDb + '</td>' +
                    '<td>$' + memberBalance + '</td>' +
                    '<td>' + memberDiscountRate + '</td>' +
                    '</tr>';
                tableBody.innerHTML += row;

            }

        });
    });

    if (document.getElementById('memberInfo_table').innerHTML == "") {
        Swal.fire("错误提醒", "查询的电话号码： " + phoneNumber + " 不存在", "error");
    }
}



function generateNewMemberId() {

    firebase.database().ref('members/').on("value", function (snapshot) {
        var memberBasedId = 100000;
        var memberPrefix = 'PH';
        var newMemberBasedId = memberBasedId + snapshot.numChildren() + 1;
        var newMemberId = memberPrefix + newMemberBasedId;
        document.getElementById('memberId').value = newMemberId;

    })
}

function employeeSelectedOptionForMemberManagement() {

    var employeeInfo = firebase.database().ref('employees/').orderByKey();

    employeeInfo.on("value", function (snapshot) {

        var addNewMemberSelectAttr = document.getElementById('addNewMemberByEmployee');
        var addCreditEmployeeSelectAttr = document.getElementById('add_credit_employeeName');
        var spendCreditEmployeeSelectAttr = document.getElementById('spend_credit_employeeName');

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
            addNewMemberSelectAttr.add(opt, null);
            addCreditEmployeeSelectAttr.add(opt1, null);
            spendCreditEmployeeSelectAttr.add(opt2, null);
        });
    });
}

function discountRateEnable() {
    var settingInfo = firebase.database().ref('setting/');
    settingInfo.on("value", function (snapshot) {
        var isEnable =snapshot.child('discountRateEditable').val();
        document.getElementById('memberDiscountRate').readOnly = !isEnable;
    });
}

function sendEmailEnable(message) {

    var settingInfo = firebase.database().ref('setting/');
    settingInfo.on("value", function (snapshot) {
        var isEnable =snapshot.child('emailNotification').val();
        if(isEnable){
            sendEmail(message);
        }
    });
}

function duplicatedPhoneCheckEnable() {
    var settingInfo = firebase.database().ref('setting/');
    var isDuplicatedPhoneCheckEnable = false;
    settingInfo.on("value", function (snapshot) {
        isDuplicatedPhoneCheckEnable = snapshot.child('duplicatedPhoneCheck').val();
    });
    return isDuplicatedPhoneCheckEnable;
}