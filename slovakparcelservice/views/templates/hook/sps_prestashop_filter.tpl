<script type="text/javascript"> 


var SlovakParcelService = window.SlovakParcelService || {};

SlovakParcelService.filter_sps_pickup_place = '{$filter_sps_pickup_place}';
SlovakParcelService.filter_sps_address = '{$filter_sps_address}';
SlovakParcelService.sps_pickup_place_carrier_id = '{$sps_pickup_place_carrier_id}';
SlovakParcelService.sps_address_carrier_id =  '{$sps_address_carrier_id}';

// filter sps shipping methods

SlovakParcelService.spsFilterInitialized = false;

SlovakParcelService.spsFilterInitialize = function  () {

	console.info("spsFilterInitialize");

	if ( SlovakParcelService.spsFilterInitialized ) {
		return;
	}
	SlovakParcelService.spsFilterInitialized = true;
	
	if ( SlovakParcelService.filter_sps_pickup_place  === '1' ) {
		var elem = document.getElementById('delivery_option_' + SlovakParcelService.sps_pickup_place_carrier_id);
		if ( elem !== null )  {
			elem  = elem.parentElement;
			while ( elem !== null && ( elem.nodeName !== 'DIV' ||  ( ! elem.classList.contains('row') || ! elem.classList.contains('delivery-option')  ) )) {
				 elem = elem.parentElement; 
			}
			//elem.setAttribute('style', 'display:none;');
			elem.remove();
		}else {
			console.info("spsFilterInitialize NO " + 'delivery_option_' + SlovakParcelService.sps_pickup_place_carrier_id);
		}
	}

	if ( SlovakParcelService.filter_sps_address  === '1' ) {
		var elem = document.getElementById('delivery_option_' + SlovakParcelService.sps_address_carrier_id);
		if ( elem !== null ){
			elem  = elem.parentElement;
			while (  elem !== null && ( elem.nodeName !== 'DIV' || ( ! elem.classList.contains('row') || ! elem.classList.contains('delivery-option')  ))) {
				 elem = elem.parentElement;
			}
			//elem.setAttribute('style', 'display:none;');
			elem.remove();
		}else {
			console.info("spsFilterInitialize NO " + 'delivery_option_' + SlovakParcelService.sps_address_carrier_id);
		}
	}
};



( function () {

	console.info("SPS do spsFilterInitialized");
	
	document.addEventListener('DOMContentLoaded', function() {

		console.info("spsFilterInitialized - DOMContentLoaded");
		SlovakParcelService.spsFilterInitialize();
	});

	
	window.addEventListener("load", function (){
		console.info("spsFilterInitialized - window load");
		SlovakParcelService.spsFilterInitialize();
	});

	//spsFilterInitialize();  // to soon
	
}) ();

</script>