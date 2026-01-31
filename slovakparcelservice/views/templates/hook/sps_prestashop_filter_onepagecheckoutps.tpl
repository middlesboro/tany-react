<script type="text/javascript">

	console.info("SPS OnePageCheckout START");

    var SlovakParcelService = window.SlovakParcelService || {};

    SlovakParcelService.sps_address_carrier_id = '{$sps_address_carrier_id}';
    SlovakParcelService.sps_pickup_place_carrier_id = '{$sps_pickup_place_carrier_id}';
    
    SlovakParcelService.filter_sps_pickup_place = '{$filter_sps_pickup_place}';
    SlovakParcelService.filter_sps_address = '{$filter_sps_address}';
    
    SlovakParcelService.codpayments = {$codpayments nofilter};
    SlovakParcelService.pp = JSON.parse('{$pp  nofilter}');
    SlovakParcelService.selected_pp = SlovakParcelService.selected_pp || null;

    SlovakParcelService.sps_pickup_place_active = {$sps_pickup_place_active};
    SlovakParcelService.sps_addr_active = {$sps_addr_active};

     
    // country withour EUR and cod in EUR is disabled 
    SlovakParcelService.noeurcountry = {$noeurcountry};
    

    // errmsg texts
    SlovakParcelService.errmsg_pp_codplace = '{$errmsg_pp_codplace}';
    SlovakParcelService.errmsg_cod = '{$errmsg_cod}';
    SlovakParcelService.errmsg_noeurcountry =  '{$errmsg_noeurcountry}';
       
    if ( SlovakParcelService.pp.id !== "" ) {
        SlovakParcelService.selected_pp = SlovakParcelService.pp;
    } 


	SlovakParcelService.validator_added = SlovakParcelService.validator_added || false;

    
    SlovakParcelService.validatePhoneNumber = function ( phone_number, iso_code ) { 

        {literal}   // to dont eat {} by smarty 
        const regex_ar = { 'SK' : /^(\+421|00421|0)9[0-9]{8}$/, 'CZ' : /^((\+|00)420|)[0-9]{9}$/, 'HU': /^(0036|\+36|06)[0-9]{9}$/ };
        {/literal}
        
        phone_number = phone_number.replace(/\s+/g,"").replace(/-/g,"");
    
        if ( iso_code in regex_ar ) {
            return regex_ar[iso_code].test(phone_number) ;
        }
        return true;
    };

    SlovakParcelService.filter_sps_pickup_place_f = function () {

    	if ( SlovakParcelService.filter_sps_pickup_place  === '1' && SlovakParcelService.sps_pickup_place_active  ) {
    		var elem = document.getElementById('delivery_option_' + SlovakParcelService.sps_pickup_place_carrier_id);
    		if ( elem !== null )  {
    			elem  = elem.parentElement;
    			while ( elem !== null && ( elem.nodeName !== 'DIV' ||  ( ! elem.classList.contains('delivery_option_' + SlovakParcelService.sps_pickup_place_carrier_id) || ! elem.classList.contains('delivery-option')  ) )) {
    				 elem = elem.parentElement; 
    			}
    			//elem.setAttribute('style', 'display:none;');
    			elem.remove();
    		}else {
    			console.info("spsFilterInitialize NO " + 'delivery_option_' + SlovakParcelService.sps_pickup_place_carrier_id);
    		}
    	}
    };

    SlovakParcelService.filter_sps_address_f = function () {

        if ( SlovakParcelService.filter_sps_address  === '1' &&  SlovakParcelService.sps_addr_active) {
    		var elem = document.getElementById('delivery_option_' + SlovakParcelService.sps_address_carrier_id);
    		if ( elem !== null ) {
    			elem  = elem.parentElement;
    			while (  elem !== null && ( elem.nodeName !== 'DIV' || ( ! elem.classList.contains('delivery_option_' + SlovakParcelService.sps_address_carrier_id) || ! elem.classList.contains('delivery-option')  ))) {
    				 elem = elem.parentElement;
    			}
    			//elem.setAttribute('style', 'display:none;');
    			elem.remove();
    		}else {
    			console.info("spsFilterInitialize NO " + 'delivery_option_' + SlovakParcelService.sps_address_carrier_id);
    		}
    	}
    };

// SlovakParcelService.zipcityCheck = async function (zip,city, ispp) {
// 	{literal} 
// 	// send data to server
// 		$.ajax({
// 				type: 'POST',
// 			url : "../modules/slovakparcelservice/zipcity-check.php", 
// 				data :{"sps_ispp": sps_ispp,  "sps_zip": sps_zip, "sps_city": sps_city  },
// 				success:
// 				error:

// 			);
// 	{/literal} 

// };
    


SlovakParcelService.spsFilterInitialize = function () {

	SlovakParcelService.filter_sps_pickup_place_f();
	SlovakParcelService.filter_sps_address_f();

	if ( ( SlovakParcelService.filter_sps_address  === '1' &&  SlovakParcelService.sps_addr_active && ! SlovakParcelService.sps_pickup_place_active  )
			|| ( SlovakParcelService.filter_sps_pickup_place  === '1' && SlovakParcelService.sps_pickup_place_active && ! SlovakParcelService.sps_addr_active  ) 
			|| ( SlovakParcelService.filter_sps_pickup_place  === '1' && SlovakParcelService.sps_pickup_place_active &&  SlovakParcelService.filter_sps_address  === '1' &&  SlovakParcelService.sps_addr_active ) 
		) {
		// all filtered do nothing
		return;
	}

	if ( SlovakParcelService.validator_added ) {
		return;
	}
	SlovakParcelService.validator_added = true;

	// waif for OPC_External_Validation
	// add custom vallidator

	(async() => {
	  while(!window.hasOwnProperty("OPC_External_Validation")) 
	      await new Promise(resolve => setTimeout(resolve, 100));
	  
	  while(!OPC_External_Validation.hasOwnProperty("validations")) 
	      await new Promise(resolve => setTimeout(resolve, 100));
	    
	  // we have validations
	  while(typeof OPC_External_Validation.validations['review:placeOrder'] === 'undefined' )
	     await new Promise(resolve => setTimeout(resolve, 100));
	       
	  OPC_External_Validation.validations['review:placeOrder'].push(function () {

		  
		  console.info("SPS validator START");
		    
	        // if selected SPS addre , balikovo , etc 
	        // id delivery_phone 
	        // id delivery_phone_mobile
	        // delivery_option_120   get numbers of SPS carriers  // radio check if checked
	        
	        //payment   id=payment-option-1.2,//   name="payment-option"     value="ps_"
	        
	        // delivery_id_country   check selected option for   data-iso-code="SK" "CZ" "HU"
	        if ( ( document.getElementById("delivery_option_" + SlovakParcelService.sps_address_carrier_id) && document.getElementById("delivery_option_" + SlovakParcelService.sps_address_carrier_id).checked  ) || 
	             ( document.getElementById("delivery_option_" + SlovakParcelService.sps_pickup_place_carrier_id) && document.getElementById("delivery_option_" + SlovakParcelService.sps_pickup_place_carrier_id).checked )  ) {

	            // check phone number 
	            var  phone_num =  document.getElementById("delivery_phone_mobile").value;
	            var  selected_id  = document.getElementById("delivery_id_country");
	            
	            var iso_code =  selected_id.options[selected_id.selectedIndex].getAttribute("data-iso-code"); 

	            var phone_num_valid = SlovakParcelService.validatePhoneNumber (phone_num, iso_code );

	            if ( ! phone_num_valid ) {
	                        
	                if ( document.getElementById("slovakparcelservice_errmsg_pp_phone") ) {
	                    document.getElementById("slovakparcelservice_errmsg_pp_phone").style.display = "block";
	                }
	                if ( document.getElementById("slovakparcelservice_errmsg_addr_phone") ) {
	                    document.getElementById("slovakparcelservice_errmsg_addr_phone").style.display = "block";
	                }
	            }else {
	            
	                if ( document.getElementById("slovakparcelservice_errmsg_pp_phone") ) {
	                    document.getElementById("slovakparcelservice_errmsg_pp_phone").style.display = "none";
	                }
	                if ( document.getElementById("slovakparcelservice_errmsg_addr_phone") ) {
	                    document.getElementById("slovakparcelservice_errmsg_addr_phone").style.display = "none";
	                }
	            }

	            // check payment option vs cart value or cod support on sleected pp 
	            var payment_valid = true;
	            var payment_cod_support = true;
	            var payment_country_eur = true;

	            // if payment not  selected do nothing 
	            if ( document.querySelector("input[type='radio'][name=payment-option]:checked") === null ) {
	                return true; // do nothing 
	            }

	            // check if  delivery pp is selected - only if pp carrier is selected 
	            var pp_selected = true;
                if ( document.getElementById("delivery_option_" + SlovakParcelService.sps_pickup_place_carrier_id) && document.getElementById("delivery_option_" + SlovakParcelService.sps_pickup_place_carrier_id).checked && SlovakParcelService.selected_pp === null ) {
                
                    pp_selected = false; 
                }

                var data_valid = true;
                var data_resp = null;
	            // check addr/pp data 
	            if ( iso_code === "SK" ) {

					if ( document.getElementById("delivery_option_" + SlovakParcelService.sps_address_carrier_id) && document.getElementById("delivery_option_" + SlovakParcelService.sps_address_carrier_id).checked  ){
						var sps_ispp = 0; 
					}else {
						var sps_ispp = 1; 
					}

					if (! sps_ispp ) {
						var sps_zip = document.getElementById("delivery_postcode").value;
			            var sps_city = document.getElementById("delivery_city").value;
					}else if (pp_selected ) {
							// deliveu pp is selected
						var sps_zip =  SlovakParcelService.selected_pp.zip;
				        var sps_city = SlovakParcelService.selected_pp.city;
					}
						
					if ( !sps_ispp || ( sps_ispp && pp_selected ) ) {

						
						{literal} 
						// send data to server
							$.ajax({
 								type: 'POST',
								url : "../modules/slovakparcelservice/zipcity-check.php", 
			   					data :{"sps_ispp": sps_ispp,  "sps_zip": sps_zip, "sps_city": sps_city  },
			   					async:false,
			   					success: function (result,status,xhr)  {data_resp = JSON.parse(result) ;},
				   				error:  function (xhr,status,error) { data_resp = {ret:-1 , msg: "Connection ERROR" , data : ""}}  

							});
						{/literal} 

						if (data_resp.ret !== 0 ) {
							data_valid = false;
						}  
					}
				}

	            
	            var payment_selected =  document.querySelector("input[type='radio'][name=payment-option]:checked").value;


	            if ( SlovakParcelService.codpayments.includes(payment_selected) ) {
	            
	                var price_str =   document.getElementById("total_price").innerHTML ;
	                // find last non digit ->decimal point/comma , temp replace decimal point/comma to pipe , remove al dots/commas and replace | to dot  
	                price_str = price_str.replace(/[^\d,\.]+/g, '').replace(/([,\.])(\d+)$/g, "|$2").replace(/[,\.]/g,"").replace(/\|/g, ".");
	                
	                var price = parseFloat(price_str);
	                
	                if ( iso_code === 'SK' ) {
	                    if ( price > 5000 ) {
	                        payment_valid = false;
	                        
	                    }
	                }else if ( price > 3300 ) {
	                    payment_valid = false;
	                }
	                
	                // if pp is selected or not  supports cod
	                if ( document.getElementById("delivery_option_" + SlovakParcelService.sps_pickup_place_carrier_id).checked && SlovakParcelService.selected_pp !== null && 
	                   ( typeof SlovakParcelService.selected_pp.cod  !== 'undefined' && ! SlovakParcelService.selected_pp.cod )) {
	                   
	                    payment_cod_support = false ;
	                }

                    if ( SlovakParcelService.noeurcountry ) {
                    	payment_country_eur = false;
                    }
	            }

	            //show err msg         
	            var errmsg_id = ''
	            // find which SPS carrier is selected 
	            if ( document.getElementById("delivery_option_" + SlovakParcelService.sps_address_carrier_id) && document.getElementById("delivery_option_" + SlovakParcelService.sps_address_carrier_id).checked  ){
	                errmsg_id = "slovakparcelservice_errmsg_addr_cod";
	            }
	            if ( document.getElementById("delivery_option_" + SlovakParcelService.sps_pickup_place_carrier_id) && document.getElementById("delivery_option_" + SlovakParcelService.sps_pickup_place_carrier_id).checked ){
	                errmsg_id =  "slovakparcelservice_errmsg_pp_cod";
	            }
	            
	            // gen error_msg
	            var err_msg = '';
	            if ( ! payment_valid ) {
	                err_msg = SlovakParcelService.errmsg_cod;
	            }
	            
	            if (! payment_cod_support) {
		            if ( err_msg == '' ) {
	                    err_msg = SlovakParcelService.errmsg_pp_codplace;
	                
	                } else {
	                    err_msg += "<br><br>" + SlovakParcelService.errmsg_pp_codplace;
	                }
	            }

                if (!  payment_country_eur ) {

                	if ( err_msg == '' ) {
                		 err_msg = SlovakParcelService.errmsg_noeurcountry;
                	}else {
                		 err_msg += "<br><br>" + SlovakParcelService.errmsg_noeurcountry;
                	}
                }

                if ( ! data_valid && data_resp !== null) {
                	if ( err_msg == '' ) {
                		 err_msg = data_resp.msg + data_resp.data;
                	}else {
                		 err_msg += "<br><br>" + data_resp.msg + data_resp.data;
                	}
                }

	            document.getElementById(errmsg_id).innerHTML = err_msg;
	            
	            if ( ! phone_num_valid || ! payment_valid  || ! payment_cod_support || ! pp_selected  || ! payment_country_eur  || ! data_valid) {
	                return false;
	            }
	            return true;
	        }  // SPS selected end

	        return true;
	        
	    } ); // end validation function 
	    
	})();   // end async

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

		SlovakParcelService.spsFilterInitialize();

		
	}) ();

</script>