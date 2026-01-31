<?php

// Avoid direct access to the file
if (! defined('_PS_VERSION_'))
{
	exit();
}


class SlovakParcelServiceCommon
{
	const TABLE_NAME_SUFFIX = 'sps_prestashop';
	const CONFIG_PREFIX = 'slovakparcelservice_';

	// check if phone number has valid format
	public static function MobileNumberTest($number)
	{
		$number = preg_replace('/\s+/', '', $number);
		$number = preg_replace('/-/', '', $number);
		$number = preg_replace('/^004219|^\+4219/', '09', $number);
		
		if (strlen($number) != 10)
			return false;
			
		if (preg_match("/09[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]/", $number))
			return true;
		else
			return false;
	}
	
	public static function MobileNumberTestCZ($number){
	    
	    $number = preg_replace('/\s+/', '', $number);
	    if ( preg_match("/^((\+|00)420|)[0-9]{9}$/", $number) ) {
	        return true;
	    }
	    return false;
	}
	
	public static function MobileNumberTestHU($number){
	    
	    $number = preg_replace('/\s+/', '', $number);
	    if ( preg_match("/^(0036|\+36|06)[0-9]{9}$/",  $number) ) {
	        return true;
	    }
	    return false;
	}
	
	
	
	public static function fixZip($zip)
	{

		return preg_replace('/\s+/', '', $zip);
	}
	
}