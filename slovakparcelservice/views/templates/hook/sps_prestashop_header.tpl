{if $page.page_name == 'checkout'}

<script>
function FillBoxMachine3( deliveryPlace )
{	
    document.getElementById("bal_info_2").innerHTML = deliveryPlace.address + ', ' + deliveryPlace.zip  + ' ' + deliveryPlace.city  + ', ' + deliveryPlace.countryISO;
   
    var SlovakParcelService = window.SlovakParcelService || {};
    SlovakParcelService.selected_pp = deliveryPlace;
   
    var cod = 0;
    if (typeof deliveryPlace.cod  === 'undefined' || deliveryPlace.cod ) {
        cod = 1;
    }

    {literal} 
	// send data to server
	$.post("../modules/slovakparcelservice/deliveryplace-update.php", 
	   {"bal_name": deliveryPlace.id, 
	   "bal_info": deliveryPlace.description,
	   "bal_vpsc": "",
	   "bal_psc": deliveryPlace.zip, 
	   "bal_address": deliveryPlace.address, 
	   "bal_city": deliveryPlace.city, 
	   "bal_type": deliveryPlace.type, 
	   "bal_cod": cod,
	   "bal_countryISO": deliveryPlace.countryISO
	} );
	{/literal} 
}


var SPSwidget = window.SPSwidget || {} ;
SPSwidget.config = SPSwidget.config || {};

SPSwidget.config.callback = "FillBoxMachine3";


function showSPSwidget() {

	
	if (  SlovakParcelService.centerAddress === '' ) {
		SPSwidget.config.address = null;
	}else {
		SPSwidget.config.address = SlovakParcelService.centerAddress;
	}



	SPSwidget.config.country =  SlovakParcelService.country;
			
	// set in tpl
	if ( SlovakParcelService.pspt.toUpperCase() === 'PSPT' ) {
		SPSwidget.config.type = null;
	}else {
		// PS or PT
		SPSwidget.config.type = SlovakParcelService.pspt.toUpperCase();
	}

	SPSwidget.showMap();
}





</script>
<script src="https://balikomat.sps-sro.sk/widget/v1/widget/js/widget.js"></script>
{/if}

