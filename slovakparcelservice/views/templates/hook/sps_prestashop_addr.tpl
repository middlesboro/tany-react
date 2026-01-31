<span  id="slovakparcelservice_errmsg_addr_phone" style="display:none;color:red;font-style: italic;">
{$error_msg nofilter}
</span>
<span id="slovakparcelservice_errmsg_addr_cod" style="display:block;color:red;font-style: italic;" >
</span>

<script type="text/javascript">
var SlovakParcelService = window.SlovakParcelService || {};
SlovakParcelService.display_error = {$display_error};

if ( SlovakParcelService.display_error )
{ 
	document.getElementById("slovakparcelservice_errmsg_addr_phone").style.display="block";
}else
{
	document.getElementById("slovakparcelservice_errmsg_addr_phone").style.display="none";
}



</script>