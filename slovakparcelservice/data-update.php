<?php

declare(strict_types = 1);

if ( ! defined('SPS_UPDATE_INCLUDE') ) {

    require_once('..' . DIRECTORY_SEPARATOR . '..'  . DIRECTORY_SEPARATOR . 'config/config.inc.php');
    require_once('..' . DIRECTORY_SEPARATOR . '..'  . DIRECTORY_SEPARATOR . 'init.php');
}

require_once (__DIR__ . DIRECTORY_SEPARATOR . 'ZipCityChecker.php');
require_once (__DIR__ . DIRECTORY_SEPARATOR . 'slovakparcelservicecommon.php');


use SPS\Webship\ZipCityChecker\ZipCityChecker;

if ( ! defined('SPS_UPDATE_INCLUDE') ) {
    
    // ajax call POST ( from Admin GUI )
    if ( isset( $_POST['spstoken'] ) ) {
        
        if ( $_POST['spstoken'] !== Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'dataupdatetoken' ) ) {
            sendResponse(false, "Invalid token" );
        }
    // call via cron token is SPS token 
    }else if ( !isset( $_GET['spstoken'] ) ||  $_GET['spstoken'] !== Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'dataupdatetoken' ) ) {
        sendResponse(false, "Invalid token" );
    }
}

// doing update 
$timestamp = time();

$data = file_get_contents('https://webship.sps-sro.sk/pscDownload');
if ($data  === false ) {
    sendResponse( false, "Data download failed" );
}

// proccess data 
// split by new lines
$csv_arr =  str_getcsv($data,"\n","\"","\\");
foreach($csv_arr as &$arr  ) {
    $arr = str_getcsv($arr, ";" ,"\"","\\" );
}

// 1st row is header
if ( count( $csv_arr) <= 1 ) {
    
    if ( defined('SPS_UPDATE_INCLUDE')) {
        return "No data" ;
    }else {
        sendResponse( false, "No data" );
    }
}
  $db =  \Db::getInstance();
  $result = $db->execute("START TRANSACTION");
  
  if ( !$result ) {
      sendResponse( false, "DB ERROR" );
  }
  
  $result = $db->execute("SELECT * from " . ZipCityChecker::$table_zipcity . " order by zip asc, city asc FOR UPDATE"  );
  if ( !$result ) {
      sendResponse( false, "DB ERROR" );
  }
  
  $result = $db->execute("truncate table " . pSQL( ZipCityChecker::$table_zipcity) );
  
  if ( !$result ) {
      $db->execute("ROLLBACK" );
      sendResponse( false, "DB ERROR" );
  }
  
  for ( $i = 1 ; $i < count( $csv_arr) ; $i++ ) {
      
      $city_nospace = preg_replace('/\s+/', '',  $csv_arr[$i][1] );
      
//       $result = $db->insert( 'slovakparcelservice_zipcity', [
//           'zip'            => pSQL(preg_replace('/\s+/', '', $csv_arr[$i][0])), 
//           'city'           => pSQL($csv_arr[$i][1]), 
//           'city_noaccent'  => pSQL(ZipCityChecker::deaccent( $csv_arr[$i][1])), 
//           'city_nospace'   => pSQL($city_nospace), 
//           'city_nos_noacc' => pSQL(ZipCityChecker::deaccent( $city_nospace))
//       ]);
      
      $result = $db->execute( "INSERT INTO " . ZipCityChecker::$table_zipcity . " ( zip, city, city_noaccent, city_nospace, city_nos_noacc ) " .
          " VALUES( '" . pSQL(preg_replace('/\s+/', '', $csv_arr[$i][0])) ."' , " .
          "'" . pSQL($csv_arr[$i][1]) . "', " .
          "'" . pSQL(ZipCityChecker::deaccent( $csv_arr[$i][1])) . "', " .
          "'" . pSQL($city_nospace) . "', " .
          "'" . pSQL(ZipCityChecker::deaccent( $city_nospace)) . "' ) " .
          " ON DUPLICATE KEY update city_nospace = '" . pSQL($city_nospace) ."'"
      );
      
      if ( !$result ) {
          $db->execute("ROLLBACK" );
          sendResponse( false, "DB ERROR" );
      }
      
  }
  
  $db->execute("COMMIT" );
  Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'datalastupdate', strval($timestamp));
  
  // only via webservice
  if (! defined('SPS_UPDATE_INCLUDE')) {
      
      $dt = new DateTime('@'. strval($timestamp));
      $tz = new DateTimeZone( "Europe/Bratislava");
      $dt = $dt->setTimezone($tz);
      sendResponse( true, $dt->format("d. m. Y  H:i:s T") );
  }
  
  

function sendResponse ($status, $msg ) {
    
    if ( defined('SPS_UPDATE_INCLUDE') ) {
        return "msg";
    }else {
        ob_clean();
        header('Content-Type: application/json');
        $resp = array();
        $resp['response'] = $status;
        $resp['message']  = $msg;
    
        echo json_encode($resp);
        exit();
    }
}







  
    
    
    
