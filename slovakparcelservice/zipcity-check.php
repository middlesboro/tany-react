<?php
declare(strict_types = 1);

if ( ! defined('SPS_UPDATE_INCLUDE') ) {
    require_once('..' . DIRECTORY_SEPARATOR . '..'  . DIRECTORY_SEPARATOR . 'config/config.inc.php');
    require_once('..' . DIRECTORY_SEPARATOR . '..'  . DIRECTORY_SEPARATOR . 'init.php');
}

    

require_once (__DIR__ . DIRECTORY_SEPARATOR . 'slovakparcelservicecommon.php');

require_once (_PS_MODULE_DIR_ . 'slovakparcelservice' . DIRECTORY_SEPARATOR . 'ZipCityChecker.php');

use SPS\Webship\ZipCityChecker\ZipCityChecker;



$module = Module::getInstanceByName('slovakparcelservice');

$response = array();
$message = '';
$data = '';

if (  !isset($_POST['sps_city']) || $_POST['sps_city'] === '' 
    ||  !isset($_POST['sps_zip'])  ||  $_POST['sps_zip'] === ''
    ||  !isset($_POST['sps_ispp'])  ||  $_POST['sps_ispp'] === ''
    ) {
    // missing data 
    $response['ret'] = 2;
    
}else {
    
    $ret_val = 0;
    if ( Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'zipcitycheck') !== 'off' ) {

        $ret = ZipCityChecker::checkZipCity( $_POST['sps_zip'], $_POST['sps_city']);
        
        if ( ! $ret['result'] ) {
            $ret_val=1;
            
            // addr 
            if ( $_POST['sps_ispp'] === '0' ) {
                
                if (  count($ret['options']) > 0 ) {
                    $message = $module->l('No zip city match, please use one of these cities for shipping :');
                    
                    $data = "<pre style=\"padding:0;\">" . $ret['options'][0] ;
                    for( $i = 1 ; $i < count( $ret['options'] ); $i++) {
                        $data .=  "<br>" . $ret['options'][$i];
                    }
                    $data .= "</pre>";
                } else {
                    $message = $module->l('No city for zip, please check zip');
                }
            }else {
                // pp
                $message  = $module->l('Selected balikovo') .  $module->l(' contains invalid data. Please select other one.');
            }
        }
    }
}

$response['ret'] = $ret_val;
$response['msg'] = $message;
$response['data'] = $data;

ob_clean();
echo json_encode($response);
exit();