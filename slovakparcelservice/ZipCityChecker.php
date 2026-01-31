<?php

declare(strict_types=1);

namespace SPS\Webship\ZipCityChecker;


// TODO remove spaces from source city and compare with columns  city_nospace  city_nos_noacc
// if more then 1 result check  what match accent /unaccnet i fmore unaccent , compare orig source ( spaces )
// if 0 reslt get all ciry for zip


class ZipCityChecker {
    
    public static $table_zipcity =  _DB_PREFIX_ . 'slovakparcelservice_zipcity';
    
   // public static $table_zipformat =  _DB_PREFIX_ . 'slovakparcelservice_zipformat';
    
    public static $table_countries =  _DB_PREFIX_ . 'slovakparcelservice_countries';
    
    private function __construct() {}
    
    public static function checkZipCity($zip, $city ) {
        
      //  $inst = new ZipCityChecker;
        $zip = pSQL(preg_replace('/\s+/', '', $zip));
        $city = pSQL( mb_convert_case($city,  MB_CASE_UPPER, "UTF-8") );
        $city_trim = pSQL( preg_replace('/\s+/', '', $city));
        $city_noacc = pSQL(ZipCityChecker::deaccent($city));
        $city_trim_noacc = pSQL(ZipCityChecker::deaccent($city_trim));
        
        $ret_arr = array();
        $ret_arr['result'] = false;
        $ret_arr['options'] = array();
       
        $sql= "select city as city , BINARY city = '".$city ."'  as acc_spaces,".
                " BINARY city_noaccent = '". $city_noacc ."' as noacc , ".
                " BINARY city_nospace = '".$city_trim ."' as nospaces ," .
                " BINARY city_nos_noacc  = '". $city_trim_noacc  ."' as noacc_nospaces  " .
                " from " .  self::$table_zipcity . " where zip = '". $zip ."' and ".
                " ( BINARY city = '".$city ."' or BINARY city_noaccent = '". $city_noacc ."'  or " .
                "  BINARY city_nospace = '". $city_trim . "' or BINARY city_nos_noacc  = '". $city_trim_noacc  . "' )"  ;
        
        $res = \Db::getInstance()->executeS($sql);
        
        if ($res === FALSE || count ( $res ) === 0 ) {
            
            $ret_arr['result'] = false;
            $ret_arr['options'] = self::getCitiesForZip($zip);
            
            // get list of options for zip
        }else if (count ( $res ) === 1 ){
            $ret_arr['result'] = true;
            $ret_arr['options'][] = self::prettyPrint($res[0]['city']);
            
        }else {
            //more then 1 result iter over find exact match  not possisble to have more then 1 same cities with same zip
            for ( $i = 0 ; $i < count($res) ; $i++ ) {
                if ( $res[$i]['acc_spaces'] === 1 ) {
                    $ret_arr['result'] = true;
                    break;
                }
            }
            
            // priority "space noaccet" vs = nospace accent ???
            // try to find space noacc - count
            $idx_noacc = array();
            $idx_nospaces = array();
            $idx_noacc_nospace = array();
            for ( $i = 0 ; $i < count($res) ; $i++ ) {
                if ( $res[$i]['noacc'] === 1 ) {
                    $idx_noacc[] = $i;
                }
                if ( $res[$i]['nospaces'] === 1 ) {
                    $idx_nospaces[] = $i;
                }
                if ( $res[$i]['noacc_nospaces'] === 1 ) {
                    $idx_noacc_nospace[] = $i;
                }
            }
            if( count($idx_noacc) === 1 ) {
                $ret_arr['result'] = true;
                $ret_arr['options'][] = self::prettyPrint($res[$idx_noacc[0]]['city']);
               
            } else if ( count( $idx_nospaces) === 1 ) {
                $ret_arr['result'] = true;
                $ret_arr['options'][] = self::prettyPrint($res[$idx_nospaces[0]]['city']);
                
            } else if ( count( $idx_noacc_nospace) === 1 ) {
                $ret_arr['result'] = true;
                $ret_arr['options'][] = self::prettyPrint($res[$idx_noacc_nospace[0]]['city']);
               
            } else {
            
                // Simple solution for  no  "acc space" match
                $ret_arr['result'] = false;
                $ret_arr['options'] = self::getCitiesForZip($zip);
            }
        }
        return  $ret_arr;
    }
      
    
    
    private static function getCitiesForZip($zip) {
        global $wpdb;
        
        $res = \Db::getInstance()->executeS("select city as city from `" .  self::$table_zipcity . "` where zip = '". pSQL($zip) ."'");
        
        $ret_arr = array();
        
        if ( $res !== FALSE && count($res) > 0 ) {
            foreach( $res as $res_item) {
                $ret_arr[] = self::prettyPrint($res_item['city']);
            }
        }
        return $ret_arr;
    }

    
    /**
     *  2.col in DB dont change number of spaces , handle nonspace names with -
     */
    private static function prettyPrint ($city) {
        
        $expl_arr = explode(" ", $city);
        
        for ( $i = 0 ; $i <  count($expl_arr ); $i++ ) {
            
            $ex_arr = explode("-", $expl_arr[$i] );
            
            if ( count($ex_arr) > 1 ) {
                for ($j = 0 ; $j < count($ex_arr); $j++) {
                
                    $ex_arr[$j] = mb_convert_case($ex_arr[$j],  MB_CASE_TITLE, "UTF-8");
                }
                $expl_arr[$i] = implode("-", $ex_arr);
            }else {
                $expl_arr[$i] =  mb_convert_case($expl_arr[$i],  MB_CASE_TITLE, "UTF-8");
            }
        }
        return implode(" ", $expl_arr);
    }
    
    
    public static function deaccent($str) {
        $noaccent_map = array (
            'Á' => 'A',
            'Ä' => 'A',
            'Č' => 'C',
            'Ď' => 'D',
            'É' => 'E',
            'Í' => 'I',
            'Ĺ' => 'L',
            'Ľ' => 'L',
            'Ň' => 'N',
            'Ó' => 'O',
            'Ô' => 'O',
            'Ŕ' => 'R',
            'Š' => 'S',
            'Ť' => 'T',
            'Ú' => 'U',
            'Ý' => 'Y',
            'Ž' => 'Z'
        );
        
        $out_str= '';
        
        $str_arr = preg_split('//u', $str, -1, PREG_SPLIT_NO_EMPTY);
        
        for ( $i = 0 ; $i < count($str_arr) ; $i ++ ) {
            
            if ( array_key_exists($str_arr[$i], $noaccent_map) ) {
                
                $out_str .= $noaccent_map[$str_arr[$i]];
            }else {
                $out_str .= $str_arr[$i];
            }
        }
        return $out_str;
    }
    
    // return array ( res,min,max, alphanum )
    public static function checkZipFormat( $country, $zip ) {
        
        $zip = preg_replace('/\s+/', '', $zip);
        $row = \Db::getInstance()->getRow( "select * from " . self::$table_countries . " where iso_code = '" . pSQL( $country). "'" );
        if ( !empty($row) ){
            $strmatch = null;
            if ( ! $row['zip_is_alphanum']) {
                $strmatch =   "/^[0-9]{" . strval($row['zip_minlength'] ) . "," .  strval($row['zip_maxlength'] ) ."}$/";
            }else {
                $strmatch =  "/^[0-9a-zA-Z]{" . strval($row['zip_minlength'] ) . "," .  strval($row['zip_maxlength'] ) ."}$/";
            }
            
            if ( preg_match($strmatch, $zip)) {
                return array( "res" => true);
            }else {
                return array( "res" => false, "min" => $row['zip_minlength'], "max"=> $row['zip_maxlength'], "alphanum" => $row['zip_is_alphanum']  );
            }
        }else {
            //should never happen because of filter
            return array( "res" => false);
        }
    }
    // ret arra of iso_code_2
    public static function getCountriesAlphaCodes() {
        
        $ret = array();
        $res =  \Db::getInstance()->executeS("select iso_code as country from " . self::$table_countries );
        
        if ( $res !== false && count($res) > 0 ) {
            foreach( $res as $res_item){
                $ret[] = $res_item['country'];
            }
        }
        return $ret;
    }
    
    
    public static function getCodForCountry($country) {
        
        $row = \Db::getInstance()->getRow( "select cod from " . self::$table_countries . " where iso_code = '". pSQL($country) . "'" );
        
        if ( empty($row) ){
            return false;
        }
        if ($row['cod'] ){
            return true;
        }
        return false;
    }
    
    public static function getNotyfiForCountry($country) {
        
        $row = \Db::getInstance()->getRow( "select notify from " . self::$table_countries . " where iso_code = '". pSQL($country). "'");
        
        if ( empty($row) ){
            return false;
        }
        if ($row['notify'] ){
            return true;
        }
        return false;
    }
    
    public static function getCurrencyForCountry($country) {
      
        $row = \Db::getInstance()->getRow( "select currency from " .  self::$table_countries . " where iso_code = '" . pSQL($country) ."'" );
        if ( empty($row) ){
            return '';
        }
        if ($row['currency'] ){
            return $row['currency'];
        }
        return '';
    }
    
    
}