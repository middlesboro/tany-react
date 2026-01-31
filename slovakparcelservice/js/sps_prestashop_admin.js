var SlovakParcelService = window.SlovakParcelService || {};

SlovakParcelService.spsUpdateData = function (token) {
    
    if ( typeof token === 'undefined'  ) {
       token = '';
    }
    
    // disable button 
    $("#sps_update_data").prop('disabled', true);
    SlovakParcelService.addMessage();
    $.ajax({
        type: "POST",
        url : "../modules/slovakparcelservice/data-update.php", 
        data : {"spstoken": token},
        success: function (data, status, html){
            if ( data['response'] )  {
                document.getElementById("datalastupdate").value = data['message'];
            }else {
                 console.log( 'data update FAILED ' + data['message'] );
            }
         },
         //enable button 
         complete : function( xhttp, status) {
            SlovakParcelService.delMessage();
            $("#sps_update_data").prop('disabled', false);
         }
     });
};

 SlovakParcelService.addMessage = function () {
    var elem = document.getElementById('sps_update_data');
    var span = document.createElement('span');
    span.id = 'sps_update_data_message';
    span.innerHTML = "&nbsp;&nbsp";
    
    var ico = document.createElement('i');
    ico.setAttribute("class", "icon-refresh icon-spin icon-fw");
    span.appendChild(ico);
    span.innerHTML = span.innerHTML + "&nbsp;&nbsp;"+   document.getElementById('update_msg').value;
    
    elem.parentNode.insertBefore(span,elem.nextSibling);
};

SlovakParcelService. delMessage = function () {
    var elem = document.getElementById('sps_update_data_message');
    elem.parentNode.removeChild(elem);
};
