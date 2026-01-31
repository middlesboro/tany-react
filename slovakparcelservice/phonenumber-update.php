<?php 
declare(strict_types = 1);
require_once('..' . DIRECTORY_SEPARATOR . '..'  . DIRECTORY_SEPARATOR . 'config/config.inc.php');
require_once('..' . DIRECTORY_SEPARATOR . '..'  . DIRECTORY_SEPARATOR . 'init.php');


require_once (__DIR__ . DIRECTORY_SEPARATOR . 'slovakparcelservicecommon.php');
// check updated phonenumber via ajax  ( one page checkoout ) 
// country and phoennumbber 
// ret true //false 

$session =   Context::getContext()->cookie;

$response = array();
// check POST DATA

if ( isset($_POST['sps_addr_countryISO'] ) && $_POST['sps_addr_countryISO'] !== ""  &&   
    isset($_POST['sps_addr_phone'] ) && $_POST['sps_addr_phone'] !== "" ) {
    
       $countryISO =  strtoupper($_POST['sps_addr_countryISO']);
       
       if ($countryISO === "SK") {
           $response['result'] = SlovakParcelServiceCommon::MobileNumberTest($_POST['sps_addr_phone']);
       }else if ($countryISO === "CZ") {
           $response['result'] = SlovakParcelServiceCommon::MobileNumberTestCZ($_POST['sps_addr_phone']);
       }else if ($countryISO === "HU"){
           $response['result'] = SlovakParcelServiceCommon::MobileNumberTestHU($_POST['sps_addr_phone']);
       }else{
           $response['result'] = true;
       }
}else {
    $response['result'] = false;
}

if ($response['result']) {
    $session->__set('sps_phone_is_ok', 'true');
}else {
    $session->__set('sps_phone_is_ok', 'false');
}

ob_clean();
header('Content-Type: application/json');

echo json_encode($response);
exit();

?>