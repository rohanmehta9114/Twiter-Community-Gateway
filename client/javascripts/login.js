var main = function(){
    "use strict";

    $("#login").on("click", function(){
        var username = $("#inputEmail").val(),
            pass = $("#inputPassword").val();
        if(username !== "" && pass !== ""){
            $.post("login", {user: username, pass: pass}, function(res){
                console.log(res);
                if(!res.valid){
                    alert("Invalid login");
                }else{
                    window.location = window.location+"user.html";
                }
            }); 
        } else {
            alert("Please enter a username and password");
        }               
    });
};

$(document).ready(main);