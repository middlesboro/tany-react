<!-- Block balikomaty -->

<div id="slovakparcelshop-wrapper" style="max-width: inherit;" >
	<table style="width:100%;">
	<tr>
		<td  style="overflow: hidden; width: 180px; text-align: left;">{$select_message_2}</td>
		<td id="bal_info_2" style="overflow: hidden;text-align: left;"></td>
		<td><button id="slovakparcelshop-map-show" style="float: right;" type="button">{$button_map_open}</button></td>
	</tr></table>
	<span id="slovakparcelservice_errmsg_pp_phone"  style="display:none;color:red;font-style: italic;">{$error_msg nofilter} </span>
	<span id="slovakparcelservice_errmsg_pp_cod" style="display:block;color:red;font-style: italic;" >
	
</span>
	<script type="text/javascript"> 

		var SlovakParcelService = window.SlovakParcelService || {};

		SlovakParcelService.requestedMachineInfo = '{$requestedMachineInfo}';
		SlovakParcelService.centerAddress='{$centerAddress}';
		SlovakParcelService.balikomat_carrier = '{$balikomat_carrier}';
		SlovakParcelService.has_error = {$has_error};
		SlovakParcelService.pspt = '{$pspt}';
		SlovakParcelService.country = '{$country_iso}';
		
	</script>
	
	<script type="text/javascript">
	// add listener to radiobutton
	
	var SlovakParcelService = window.SlovakParcelService || {};
	
	SlovakParcelService.balikomatyCallbacksInitialized = false ;

	SlovakParcelService.initializeCallbacks = function () {

		if ( document.getElementById("slovakparcelshop-map-show") === null ) {

			return;
		}
		
		if ( SlovakParcelService.balikomatyCallbacksInitialized ) {
			return;
		}
		SlovakParcelService.balikomatyCallbacksInitialized = true;

		
		// if pp is not selected 
		if ( SlovakParcelService.requestedMachineInfo.length === 0 )
		{
			document.getElementById("bal_info_2").innerHTML  =  '<div style="color:red;font-style: italic;">{$select_message_3}</div>';
		} else {
			document.getElementById("bal_info_2").innerHTML  =  SlovakParcelService.requestedMachineInfo;
		}
		if ( SlovakParcelService.has_error )
		{ 
			document.getElementById("slovakparcelservice_errmsg_pp_phone").style.display="block";
		}else
		{
			document.getElementById("slovakparcelservice_errmsg_pp_phone").style.display="none";
		}

		document.getElementById("slovakparcelshop-map-show").addEventListener("click",  showSPSwidget );

	};

	
	

	( function() {

		console.log("SPS Callbacks");

		document.addEventListener('DOMContentLoaded', function() {

			console.log("SPS Callbacks - DOMContentLoaded");
			SlovakParcelService.initializeCallbacks();
			
		});
	
		window.addEventListener("load", function (){
			console.log("SPS Callbacks - window load");
			SlovakParcelService.initializeCallbacks();
		});

		SlovakParcelService.initializeCallbacks();
		
	})();
	</script>
</div>





<!-- /Block balikomaty -->
