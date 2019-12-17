$(".signup_web").click(function () {   
	var email = $('#email').val();
	var name = $('#name').val();
	var password = $('#password').val();
	if (email && name && password) {
	    $('#message').text('');
	    var form = new FormData();
		form.append("email", email);
		form.append("name", name);
		form.append("password", password);
		signup(form);
	} else {
	    $('#message').text('Please enter all the details');
	}
	  
});

function signup(form) {
    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:5000/api/signup",
        data: form,
        contentType:false,
        mimeType: "multipart/form-data",
        dataType: "json",
        processData: false,
        success: function (response) {
        	alert('Success');
        },
        failure: function (e) {
            alert('Fail');
	    	$('#message').text(e);
            console.log(e);            
            return false;
        }
    });
}

var email;
$(".login_web").click(function () {   
	email = $('#email').val();
    console.log(email);

	var password = $('#password').val();
	if (email && password) {
	    $('#message').text('');
	    var form = new FormData();
		form.append("email", email);
		form.append("password", password);
		login(form);
	} else {
	    $('#message').text('Please enter all the details');
	}
});

function login(form) {
    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:5000/api/login",
        data: form,
        contentType:false,
        mimeType: "multipart/form-data",
        dataType: "json",
        processData: false,
        success: function (response) {
            window.location = 'profile.html?email='+email;
            // document.cookie = 'name' + "=" + email + ";path=/";
        },
        failure: function (e) {
            alert('Fail');
            console.log(e);            
            return false;
        },
        complete: function(xhr, textStatus) {
            if(xhr.status == 401){
                $('#message').text('Wrong Credentials!');
            }
        } 

    });
}
  

$(".comment_web").click(function () {   
    var comment = $('#comment').val();
    
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('email');
    var email = myParam;

    if (comment && email) {
        var form = new FormData();
        form.append("comment", comment);
        form.append("email", email);
        comment_post(form); 
    }
});

function comment_post(form) {
    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:5000/api/comment",
        data: form,
        contentType:false,
        mimeType: "multipart/form-data",
        dataType: "json",
        processData: false,
        success: function (response) {
            console.log(response);
            if (response.status == 200) {
                comment_get()
            }
        },
        failure: function (e) {
            alert('Fail');
            console.log(e);            
            return false;
        }
    });
}

function comment_get(){

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/api/comment",
        contentType:false,
        dataType: "json",
        success: function (response) {
            var template = `<div class="row">
            <div class="col-md-7 offset-md-2">
                <div class="border_comment">
                    <p>{{comment}}</p>
                    <p>{{email}}</p>        
                </div>
            </div>
            </div>`;
            var data = JSON.parse(response);

            $.each(data.msg, function(index,data) { 
                var html = template; 
                console.log(data);
                localStorage.setItem('data', JSON.stringify(data));

                // replace comment and email in template with data 
                html = html.replace("{{comment}}", data.comment); 
                html = html.replace("{{email}}", data.email);  
                $('#parent').append(html); 
            });
        },
        failure: function (e) {
            alert('Fail');
            console.log(e);            
            return false;
        }
    });

}

$(document).ready(function() {
    comment_get_test();
});

function comment_get_test(){
    var template = `<div class="row">
    <div class="col-md-7 offset-md-2">
        <div class="border_comment">
            <p>{{comment}}</p>
            <p>{{email}}</p>        
        </div>
    </div>
    </div>`;
    var jsonStr = '{ "status": 200, "msg": [{ "id": 1, "comment": "hi", "email": "ak@gmail.com" }, { "id": 2, "comment": "hello", "email": "name@gmail.com" } ]}'; 
    localStorage.setItem('testObject', JSON.stringify(jsonStr));

    var retrievedObject = JSON.parse(localStorage.getItem('testObject'));
    console.log('retrievedObject: ', retrievedObject);
    
    var data = JSON.parse(jsonStr);

    $.each(data.msg, function(index,data) { 
        var html = template; 
        console.log(data);
        // replace comment and email in template with data 
        html = html.replace("{{comment}}", data.comment); 
        html = html.replace("{{email}}", data.email);  
        $('#parent').append(html); 
    });
}


