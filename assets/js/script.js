$(document).ready(function() {
    var socket = null;
    var ready = false;
    var clientColor = '';
    var onBottom = false;

    $("#submit").submit(function(e) {
        e.preventDefault();
        conectarSocket();
        $("#login").fadeOut();
        $("#chat").fadeIn();
        var name = $("#nickname").val();
        var time = new Date();
        $("#name").html(name);
        $("#time").html('Última mensagem: ' + time.getHours() + ':' + time.getMinutes());
        ready = true;
        socket.emit("join", name);
        Scroll();
    });

    $("#textarea").keypress(function(e) {
        if (e.which == 13) {
            var text = $("#textarea").val();
            if (text && text.replace(/\s/g, '').length) {
                $("#textarea").val('');
                var time = new Date();
                IsOnBottom();
                $(".chat").append('<li class="self"><div class="msg"><span style="color: ' + clientColor + '; font-weight: bold">' + $("#nickname").val() + ':</span><p>' + text + '</p><time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
                socket.emit("send", text);
                if (onBottom)
                    Scroll();
            }
        }
    });

    function conectarSocket() {
        socket = io.connect("https://dks-chattr-gitwebserver.herokuapp.com");

        socket.on("login", function(color) {
            if (ready) {
                clientColor = color;
            }
        });

        socket.on("update", function(msg, color) {
            if (ready) {
                IsOnBottom();
                $('.chat').append('<li class="info" style="background-color: ' + color + '">' + msg + '</li>')
                if (onBottom)
                    Scroll();
            }
        });

        socket.on("chat", function(client, msg, color) {
            if (ready) {
                var time = new Date();
                IsOnBottom();
                $(".chat").append('<li class="other"><div class="msg"><span style="color: ' + color + '">' + client + ':</span><p>' + msg + '</p><time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
                if (onBottom)
                    Scroll();
            }
        });
    }

    function IsOnBottom() {
        var objDiv = document.getElementById("pnlMsg");
        if (objDiv.scrollHeight - objDiv.scrollTop == objDiv.clientHeight)
            onBottom = true;
        else
            onBottom = false;
    }

    function Scroll() {
        var objDiv = document.getElementById("pnlMsg");
        objDiv.scrollTop = objDiv.scrollHeight;
    }
});