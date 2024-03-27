$(document).ready(function () {

    $('#export_table_members').DataTable({
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    });
    $('#export_table_transactions').DataTable({
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    });
    document.getElementById("export_table_transactions_section").style.display = "none";
    setup();
    isAdmin("adminsection");

});

function readExportTable() {

    var export_table_name = document.getElementById('search_table').value;

    if (export_table_name === "members_table") {

        document.getElementById("export_table_members_section").style.display = "block";
        document.getElementById("export_table_transactions_section").style.display = "none";
        var table = $('#export_table_members').DataTable();
        var members = firebase.database().ref('members/').orderByKey();

        members.on("value", function (snapshot) {
            table.clear().draw();
            snapshot.forEach(function (childSnapshot) {
                var memberId = childSnapshot.key;
                var data = childSnapshot;
                var name = data.child('memberName').val();
                var petName = data.child('memberPetName').val();
                var petBreed = data.child('memberPetBreed').val();
                var petGender = data.child('memberPetGender').val();
                var balance = data.child('memberBalance').val();
                var memberPhone = data.child('memberPhone').val();
                var memberDis = data.child('memberDiscountRate').val();
                var memberJoinedDate = data.child('memberJoinDate').val();
                var employeeId = data.child('employee').val();
                var note = data.child('note').val();


                if (petGender === "m") {
                    petGender = "男";
                } else if (petGender === "f") {
                    petGender = "女";
                } else {
                    petGender = "未知";
                }

                firebase.database().ref('employees/'+employeeId).once("value", function (snapshot) {     
                    var employeeName = snapshot.child('employeeName').val();
                    table.row.add([memberId, name, petName, petBreed, petGender, memberPhone, memberJoinedDate, memberDis, "$" + balance, employeeName, note]).draw();
                });


            });
        });


    } else if (export_table_name === "transactions_table") {

        document.getElementById("export_table_members_section").style.display = "none";
        document.getElementById("export_table_transactions_section").style.display = "block";

        var table = $('#export_table_transactions').DataTable();
        var transactions = firebase.database().ref('transactions/').orderByKey();

        transactions.on("value", function (snapshot) {
            table.clear().draw();
            snapshot.forEach(function (data) {
                var memberId = data.child('memberId').val();
                var transactionId = data.key;
                var employeeId = data.child('employeeId').val();
                var date = data.child('date').val();
                var amount = data.child('amount').val();
                var discountRate = data.child('discountRate').val();
                var note = data.child('note').val();
                var type = data.child('type').val();
                var status = data.child('status').val();

                if (type === "spendCredit") {
                    type = "消费";
                } else if (type === "addCredit") {
                    type = "充值";
                } else {
                    type = "开户";
                }

                firebase.database().ref('employees/'+employeeId).once("value", function (snapshot) {     
                    var employeeName = snapshot.child('employeeName').val();
                    table.row.add([memberId, transactionId, employeeName, date, type, "$" + amount, discountRate, status, note]).draw();
                });

            });
        });
    }

}

function setup() {
    this.addEventListener("mousemove", resetTimer, false);
    this.addEventListener("mousedown", resetTimer, false);
    this.addEventListener("keypress", resetTimer, false);
    this.addEventListener("DOMMouseScroll", resetTimer, false);
    this.addEventListener("mousewheel", resetTimer, false);
    this.addEventListener("touchmove", resetTimer, false);
    this.addEventListener("MSPointerMove", resetTimer, false);
    startTimer();
}


function startTimer() {
    // wait 15 minus before calling goInactive
    timeoutID = window.setTimeout(goInactive, 900000);
}

function resetTimer(e) {
    window.clearTimeout(timeoutID);
    goActive();
}

function goInactive() {
    if (firebase.auth().currentUser != null) {
        alert("Time out: your are no active within 15 minus!");
        signout();
    }
}

function goActive() {
    startTimer();
}

