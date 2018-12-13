$(document).ready(() => {    
    $("#submit").click(function(){
        var id = $('#spielID').val();
        $.get(`http://localhost:3000/api/neuesSpiel/${id}`, (data) => {
            if(data === "Spiel erfolgreich erstellt.") {
                for(var row = 1; row <= 8; row++) {
                    var column = "";
                    for(var col = 1 ; col <= 8; col++) {
                        column += `<td id='${row}${col}'></td>`;
                    };                $('#chessboard').append(`<tr>${column}</tr>`);
                    $('#newGame').hide();
                };
            };
        });
    });
});