"use strict";


jQuery(document).ready(function ($) {

    $('#navbar-collapse').find('a[href*=#]:not([href=#])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: (target.offset().top - 40)
                }, 1000);
                if ($('.navbar-toggle').css('display') != 'none') {
                    $(this).parents('.container').find(".navbar-toggle").trigger("click");
                }
                return false;
            }
        }
    });
	

	readMembershipOverviewTable();
	 
	checkScrolling($('.membershipOverviewTable'));


	$(window).on('resize', function(){
		window.requestAnimationFrame(function(){checkScrolling($('.membershipOverviewTable'))});
	});
	$('.membershipOverviewTable').on('scroll', function(){ 
		var selected = $(this);
		window.requestAnimationFrame(function(){checkScrolling(selected)});
	});

	function checkScrolling(tables){
		tables.each(function(){
			var table= $(this),
				totalTableWidth = parseInt(table.children('.cd-pricing-features').width()),
		 		tableViewport = parseInt(table.width());
			if( table.scrollLeft() >= totalTableWidth - tableViewport -1 ) {
				table.parent('li').addClass('is-ended');
			} else {
				table.parent('li').removeClass('is-ended');
			}
		});
	}

    $(window).scroll(function(){
        if ($(this).scrollTop() > 600) {
            $('.scrollup').fadeIn('slow');
        } else {
            $('.scrollup').fadeOut('slow');
        }
    });
    $('.scrollup').click(function(){
        $("html, body").animate({ scrollTop: 0 }, 1000);
        return false;
    });	

    isAdmin("adminsection");

});

function login_modal(){
	// Get the modal
	var login_modal = document.getElementById('login_modal');

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == login_modal) {
			login_modal.style.display = "none";
		}
	}
}

function membershipOverviewSearch() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("inputForPetNames");
  filter = input.value.toUpperCase();
  table = document.getElementById("membershipOverviewTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}



function readMembershipOverviewTable() {

    var query = firebase.database().ref('members/').orderByKey();

    query.on("value", function (snapshot) {

        var table = document.getElementById('membershipOverviewTable');

        // clear up old data to reduce duplication
        table.innerHTML = '<tr class="header"> <th style="width:25%;">宠物名</th> <th style="width:25%;">电话</th> <th style="width:25%;">会员折扣</th> <th style="width:25%;">余额</th></tr>';

        snapshot.forEach(function (childSnapshot) {
            var table = document.getElementById('membershipOverviewTable');
            var Data = childSnapshot;

            var memberPetName = Data.child("memberPetName").val();
            var memberPhone = Data.child("memberPhone").val();
            var memberDiscountRate = Data.child("memberDiscountRate").val();
            var memberBalance = Data.child("memberBalance").val();

            var row = '<tr>' +
                '<td>' + memberPetName + '</td>' +
                '<td>' + memberPhone + '</td>' +
                '<td>' + memberDiscountRate + '</td>' +
                '<td>$' + memberBalance + '</td>' +
                '</tr>';
            table.innerHTML += row;

        });
    });
}

