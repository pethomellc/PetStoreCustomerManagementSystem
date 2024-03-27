const firebaseConfig = {
    apiKey: "xxx",
    authDomain: "xxx",
    databaseURL: "xxx",
    projectId: "xxx",
    storageBucket: "xxx",
    messagingSenderId: "xxx",
    appId: "xxx",
    measurementId: "xxx"
};

firebase.initializeApp(firebaseConfig);
let authDomain = "xxx";

//////////////////////////////////////////////////////////---------LOGIN/REGISTER---------/////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function login() {
    var email = document.getElementById("signin_email").value;
    var password = document.getElementById("signin_psw").value;

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(function () {

            return firebase.auth().signInWithEmailAndPassword(email, password)
                .then(function (user) {
                    window.location.href = authDomain + "/layouts/home.html";
                })
                .catch(function (error) {
                    var errorMessage = error.message;
                    document.getElementById('login-error').innerHTML = "<Strong>Error: <Strong>" + errorMessage;
                    document.getElementById('login-error-bar').style.display = "block";

                });
        })
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            Swal.fire({
                title: "Error!",
                text: errorCode + ":" + errorMessage,
                icon: "error"
            });

        });

}

function isAdmin(id) {
    var isAdminRole = window.sessionStorage.getItem('isAdminRole');
    var userEmail = window.sessionStorage.getItem('userEmail');
    document.getElementById("userEmail").innerHTML = userEmail;

    if (isAdminRole === "true") {
        document.getElementById(id).style.display = "block";
    } else {
        document.getElementById(id).style.display = "none";
    }
}

function signout() {

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: "success",
        title: "Signed out successfully"
    }).then(() => {
        firebase.auth().signOut().then(function () {
            Swal.fire({
                title: "Sign Out",
                text: 'You sign out successfully ',
                icon: "success"
            });
        }).catch(function (error) {
            var errorMessage = error.message;
            Swal.fire({
                title: "Error!",
                text: errorMessage,
                icon: "error"
            });
        });
    });
}


firebase.auth().onAuthStateChanged(function (user) {
    if (user === null && (window.location == authDomain + "/layouts/home.html" ||
        window.location == authDomain + "/layouts/transactionreview.html" ||
        window.location == authDomain + "/layouts/membermanagement.html" ||
        window.location == authDomain + "/layouts/export.html" ||
        window.location == authDomain + "/layouts/admin.html")) {

        window.location.href = authDomain + "/index.html";

    } else if (window.location == authDomain + "/layouts/home.html" ||
        window.location == authDomain + "/layouts/transactionreview.html" ||
        window.location == authDomain + "/layouts/membermanagement.html" ||
        window.location == authDomain + "/layouts/export.html" ||
        window.location == authDomain + "/layouts/admin.html") {
        firebase.database().ref('users/' + user.uid).on('value', function (snapshot) {
            if (snapshot.exists()) {
                var isAdmin = snapshot.child('isAdmin').val();
                var email = snapshot.child('email').val();
                window.sessionStorage.setItem("isAdminRole", isAdmin);
                window.sessionStorage.setItem("userEmail", email);
                document.getElementById("adminsection").style.display = "block";
                if (isAdmin === "false" && window.location == authDomain + "/layouts/admin.html") {
                    window.location.href = authDomain + "/layouts/home.html";
                    document.getElementById("adminsection").style.display = "none";
                }
            } else {
                if (window.location == authDomain + "/layouts/admin.html") {
                    window.location.href = authDomain + "/layouts/home.html";
                }
                document.getElementById("adminsection").style.display = "none";
            }
            //initial the setting right after login
            var isAdminRole = window.sessionStorage.getItem('isAdminRole');
            var userEmail = window.sessionStorage.getItem('userEmail');
            document.getElementById("userEmail").innerHTML = userEmail;
            if (isAdminRole === "true") {
                document.getElementById("adminsection").style.display = "block";
            } else {
                document.getElementById("adminsection").style.display = "none";
            }
        });
    }
});

function sendEmail(message) {
    firebase.database().ref('emailNoticeConfig/').on("value", function (snapshot) {
        var publicKey = snapshot.child('publicKey').val();
        emailjs.init(publicKey);
        var serviceId = snapshot.child('serviceId').val();
        var templateId = snapshot.child('templateId').val();
        var toName = snapshot.child('toName').val();
        var fromName = snapshot.child('fromName').val();
        var replyTo = snapshot.child('replyTo').val();
        emailjs.send(serviceId, templateId, {
            to_name: toName,
            from_name: fromName,
            message: message,
            reply_to: replyTo,
        });
    });
}



function memberInfoLookUpTable(memberId) {

    var memberInfo = firebase.database().ref('members/' + memberId);
    return memberInfo.once('value').then(snapshot => {
        let memberInfoJson = null;
        if (!snapshot.exists()) {
            Swal.fire("错误提醒", "查询的会员账号不存在", "error");
        } else {
            var memberId = snapshot.key;
            var memberName = snapshot.child("memberName").val();
            var memberPetName = snapshot.child("memberPetName").val();
            var memberPhone = snapshot.child("memberPhone").val();
            var memberDiscountRate = snapshot.child("memberDiscountRate").val();
            var memberBalance = snapshot.child("memberBalance").val();

            memberInfoJson = '{ "memberId":"' + memberId + '",'
                + '"memberName":"' + memberName + '",'
                + '"memberPetName":"' + memberPetName + '",'
                + '"memberPhone":"' + memberPhone + '",'
                + '"memberDiscountRate":"' + memberDiscountRate + '",'
                + '"memberBalance":"' + memberBalance + '"'
                + '}';
        }
        return JSON.parse(memberInfoJson);
    });

}


function memberPhoneLookUpTable(phoneNumber) {

    var memberInfo = firebase.database().ref('members/');
    return memberInfo.orderByChild('memberPhone').equalTo(phoneNumber).once("value").then(snapshot => {

        var isExistPhoneNumber = false;

        snapshot.forEach(function (data) {
            if (data.child('memberPhone').val() == phoneNumber) {
                isExistPhoneNumber = true;
            }

        });

        return isExistPhoneNumber;

    });

}

function userEmailLookUpTable(email) {
    return firebase.database().ref('users/').orderByChild('email').equalTo(email).once("value").then(snapshot => {
        var uid;
        snapshot.forEach(function (data) {
            if (data.child('email').val() == email) {
                uid = data.key;
            }
        });
        return uid;
    });
}


function calDiscountRate(input, elementId) {
    var discountRate = 1;
    if (input >= 300 && input < 500) {
        discountRate = 0.9;
    } else if (input >= 500 && input < 800) {
        discountRate = 0.85;
    } else if (input >= 800 && input < 1500) {
        discountRate = 0.8;
    } else if (input >= 1500 && input < 3000) {
        discountRate = 0.75;
    } else if (input >= 3000) {
        discountRate = 0.7;
    }
    var settingInfo = firebase.database().ref('setting/');
    settingInfo.on("value", function (snapshot) {
        var isEnable = snapshot.child('discountRateAutoApply').val();
        if (isEnable) {
            document.getElementById(elementId).value = discountRate;
        }
    });
}

function convertCurrencyToNumber(currencyStr) {
    return Number(currencyStr.replace(/[^0-9.-]+/g, ""));
}

function generateTransactionId() {
    return 't' + new Date().getTime();
}