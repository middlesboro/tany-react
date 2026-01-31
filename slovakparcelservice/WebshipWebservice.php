<?php

declare(strict_types=1);

namespace SPS\Webship\Webservice;

//dependencies

require_once( __DIR__ . DIRECTORY_SEPARATOR . "WebshipWebserviceSoapAPI.php");
require_once( __DIR__ . DIRECTORY_SEPARATOR . "WebshipWebserviceSoapAPIClasses.php");

class WebshipWebserviceResponse
{
    
    public $errors;
    public $warnings;
    public $documentUrl;
    public $packagesInfo;
    
    function __construct()
    {
        $this->errors = null;
        $this->warnings = null;
        $this->documentUrl = null;
        $this->packagesInfo = array(); //array of hashes ( packages )
    }

    public function getErrors() { return $this->errors; }
    public function getWarnings() { return $this->warnings; }
    public function getDocumentUrl() { return $this->documentUrl; }
    public function getPackagesInfo() { return $this->packagesInfo; }
    public function hasErrors()
    {
        if ( empty($this->errors) )
        {
            return false;
        }
        return true;
    }
    
    public function hasWarnings()
    {
        if ( empty( $this->warnings ) )
        {
            return false;
        }
        return true;
    }

    public function hasPackagesInfo() {
        if ( empty($this->packagesInfo) ) {
            return false;
        }
        return true;
    }

    public function addWarning($warning)
    {
        if (empty($warning)){
            return;
        }
        if ( $this->hasWarnings() ) {
            $this->warnings = "\n". $warning ;
        } else {
            $this->warnings =  $warning ;
        }
    }
    
    public function addError($error)
    {
        if (empty($error)){
            return;
        }
        if ( $this->hasErrors() ) {
            $this->errors = "\n". $error;
        } else {
            $this->errors = $error;
        }
    }

    public function addPackagesInfo($info)
    {
        if (empty($info)){
            return;
        }
        $this->packagesInfo = $info;
    }

}


class WebshipWebserviceClient {
    
    public $apiUsername;
    public $apiPassword;
    public $soapApi;
    public $shipments;
    public $printingSettings;

    function __construct( string $username, string $password)
    {
        $this->apiUsername = $username;
        $this->apiPassword = $password;
        $this->soapApi = new WebshipWebserviceSoapAPI();
        $this->shipments = array();
        $this->printingSettings = null;
    }

    // add shipment to array of shipments
    public function addShipmentToList( $shipment, bool $check = false ) {

        if ( $check ) {
            $resp = $this->validateShipment($shipment);

            if (! $resp->hasErrors() )
            {
                $this->shipments[]= $shipment;
            }
            return  $resp;
        }else {
            $this->shipments[]= $shipment;
        }
    }

    //   public function setShipment
    public function createWebserviceShipment() {
        $webServiceShipment = new WebServiceShipment( null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        $webServiceShipment->units  = billingUnits::KG;
        /// ?? mandatory
        $webServiceShipment->codattribute = codAttribute::CASH;
        return   $webServiceShipment;
    }




    public function validateShipment($shipment) {

        $response = new WebshipWebserviceResponse();
        //check mandatory
        if ($shipment->deliveryaddress === null )
        {
            if ( $response->errors === null )
            {
                $response->errors = "Missing receiver address.";
            } else
            {
                $response->errors .=  " Missing receiver address.";
            }
        }
        if ( $shipment->insurvalue === null )
        {
            if ( $response->errors === null )
            {
                $response->errors = "Missing insurence value.";
            }
            else
            {
                $response->errors .=  " Missing insurence value.";
            }
        }
        if ( count (  $shipment->packages ) === 0 )
        {
            if ( $response->errors === null )
            {
                $response->errors = "Missing packages .";
            }
            else
            {
                $response->errors .= " Missing packages .";
            }
        }

        
        return $response;
    }

     /**  create sender or receiver address Objects
    *  @param string $City
    *  @param string $Zip
    *  @param string $Country
    *  @param string $Name
    *  @param string $ContactPerson
    *  @param string $mobile
    *  @param string $email
    *  @param string $phone
    *  @return  mixed  ShipmentAddress| false
    */

    private function createShipmentAddress(  $city, $zip, $country, $street, $name, $contactPerson, $mobile, $email, $phone = null) {

        $ret = new WebshipWebserviceResponse();
        // check inputs
        $inErrorMsg = '';

        if ( $city === null || trim($city) === '' )
        {
            $inErrorMsg = "Missing city";
        }
    
        if ( $zip === null || trim($zip) === '' )
        {
            if ($inErrorMsg === '' )
            {
                $inErrorMsg = "Missing zip";
            } else
            {
                $inErrorMsg .= ", zip";
            }
        }

        if ( $country === null || trim($country) === '' )
        {
            if ($inErrorMsg === '' )
            {
                $inErrorMsg = "Missing country";
            } else
            {
                $inErrorMsg .= ", country";
            }
        }

        if ($street === null || trim($street) === '' )
        {
            if ($inErrorMsg === '' )
            {
                $inErrorMsg = "Missing street";
            } else
            {
                $inErrorMsg .= ", street";
            }
        }

        if ($name === null || trim($name) === '' )
        {
            if ($inErrorMsg === '' )
            {
                $inErrorMsg = "Missing name";
            } else
            {
                $inErrorMsg .= ", name";
            }
        }

        if ($contactPerson === null || trim($contactPerson) === '' )
        {
            if ($inErrorMsg === '' )
            {
                $inErrorMsg = "Missing contact person";
            } else
            {
                $inErrorMsg .= ", contact person";
            }
        }

        if ($mobile === null || trim($mobile) === '' )
        {
            if ($inErrorMsg === '' )
            {
                $inErrorMsg = "Missing mobile";
            } else
            {
                $inErrorMsg .= ", mobile";
            }
        }

        if ($email === null || trim($email) === '' )
        {
            if ($inErrorMsg === '' )
            {
                $inErrorMsg = "Missing email";
            } else {
                $inErrorMsg .= ", email";
            }
        }
        // check phone
        $phone_parsed = null;
        if ( $phone !== null && trim($phone) !== '' )
        {
            $phone_parsed = trim($phone);
        }
        
        if ( $inErrorMsg === '' )
        {
            $ret->packagesInfo = new ShipmentAddress(trim($city), trim($zip), trim($country), trim($street), trim($name), trim($contactPerson),
              trim($mobile), trim($email), $phone_parsed );
        } else
        {
            $ret->errors = $inErrorMsg;
        }
        return $ret;
    }


    public function setShipmentEmailNotify(&$shipment)
    {
        if ( $shipment->notifytype === null ||  $shipment->notifytype === notifyType::NONOTIFY)
        {
            $shipment->notifytype = notifyType::EMAIL;
        }
        else if ($shipment->notifytype === notifyType::SMS )
        {
            $shipment->notifytype = notifyType::BOTH ;
        }
    }
	
    public function setShipmentSMSNotify(&$shipment)
    {
        if ( $shipment->notifytype === null || $shipment->notifytype === notifyType::NONOTIFY)
        {
            $shipment->notifytype = notifyType::SMS;
        }
        else if ($shipment->notifytype === notifyType::EMAIL )
        {
            $shipment->notifytype = notifyType::BOTH;
        }
    }


    public function setShipmentToPS(&$shipment)
    {
        $shipment->deliverytype = deliveryType::PS;
    }
    
    public function setShipmentToPT(&$shipment)
    {
        $shipment->deliverytype = deliveryType::PT;
    }

    public function setShipmentRemark( &$shipment, $remark)
    {
        $shipment->deliveryremark = substr($remark, 0, 150);
    }


    public function addShipmentPackage(&$shipment, $refNr, $weight)
    {
        if ($weight === null || is_numeric($weight))
        {
            $shipment->packages[] = new WebServicePackage($refNr, $weight);
        }
    }

    public function setShipmentReceiverAddress (&$shipment, $city, $zip, $country, $street, $name, $contactPerson, $mobile, $email, $phone = null)
    {
        $resp = $this->createShipmentAddress( $city, $zip, $country, $street, $name, $contactPerson, $mobile, $email, $phone = null );
        $ret = new WebshipWebserviceResponse();

        if ( ! $resp->hasErrors() )
        {
            // use packagesinfo field
            $shipment->deliveryaddress = $resp->getpackagesInfo();
        } else
        {
            $ret->errors = $resp->getErrors();
        }
        return $ret;
    }

    public function setShipmentSenderAddress (&$shipment, $city, $zip, $country, $street, $name, $contactPerson, $mobile, $email, $phone = null)
    {
        $resp = $this->createAddress( $city, $zip, $country, $street, $name, $contactPerson, $mobile, $email, $phone = null );
        $ret = new WebshipWebserviceResponse();
        if ( ! $resp->hasErrors() )
        {
            // use packagesinfo field
            $shipment->senderAddress = $resp->getpackagesInfo();
        } else
        {
            $ret->errors = $resp->getErrors();
        }
        return $ret;
    }

    // address of shipment pickup
    public function setShipmentPickupAddress (&$shipment, $city, $zip, $country, $street, $name, $contactPerson, $mobile, $email, $phone = null)
    {
        $resp = $this->createAddress( $city, $zip, $country, $street, $name, $contactPerson, $mobile, $email, $phone = null );
        $ret = new WebshipWebserviceResponse();
        if ( ! $resp->hasErrors() )
        {
            // use packagesinfo field
            $shipment->pickupAddress = $resp->getpackagesInfo();
        } else
        {
            $ret->errors = $resp->getErrors();
        }
        return $ret;
    }

    // float or int
    public function setShipmentCod(&$shipment, $sum )
    {
        $retVal = new WebshipWebserviceResponse();
        if ( ! is_numeric($sum) ){
            $retVal->errors = "Input value is not number";
        } else {
            $shipment->cod = new Cod(trim(strval($sum)));
        }
        return $retVal;
    }

    public function setShipmentInsurValue(&$shipment,$sum)
    {
        $retVal = new WebshipWebserviceResponse();
        if ( ! is_numeric($sum) ){
            $retVal->errors = "Input value is not number";
        } else {
            $shipment->insurvalue = trim(strval($sum));
        }
        return $retVal;
    }
    
    // input serviceName
    public function setShipmentServiceName(&$shipment, $serviceName)
    {
        $retVal = new WebshipWebserviceResponse();
        
        $contsarr = array_values( (new \ReflectionClass('\SPS\Webship\Webservice\serviceName'))->getConstants() );
        if ( !in_array($serviceName, $contsarr ) ) {
            $retVal->errors = "Invalid servicename";
        }else {
            $shipment->servicename = $serviceName;
        }
        return $retVal;
    }
    

    // printing Settings functions 
    public function setPrintingSettings( $fileFormat = null,  $paperFormat = null, 
         $zplResolution = null,  $pdfContentFormat = null,  $printFromPos = null ) 
    {
        
        $retVal = new WebshipWebserviceResponse();

        $arr = [ "fileFormat", "paperFormat", "zplResolution", "pdfContentFormat", "printFromPos" ];

        // check all paramameters for evalaible values 
        foreach ( $arr as $el) {

            if ( $$el == null ) {
                continue;
            }

            $el_arr = array_values( (new \ReflectionClass("\SPS\Webship\Webservice\\$el" ))->getConstants() );
            if ( !in_array( $$el, $el_arr )) {
                 if ( $retVal->errors === null ) {
                    $retVal->errors = "Invalid " . $el ;
                 } else {
                    $retVal->errors .= "\nInvalid " . $el ;
                 }
                 $$el = null;
            }
        }
    
        $this->printingSettings = new PrintingSettings($fileFormat, $paperFormat, $zplResolution, $pdfContentFormat, $printFromPos );

        return $retVal;

    }

    public function unsetPrintingSettings() {
        $this->printingSettings = null;
    }
    


    public function setPrintingSettingsFileFormat($fileFormat = null) {

        $retVal = new WebshipWebserviceResponse();

        if ( $fileFormat !== null ) {
            $arr = array_values( (new \ReflectionClass('\SPS\Webship\Webservice\fileFormat'))->getConstants() );
            if ( !in_array( $fileFormat, $arr )) {
                $retVal->errors = "Invalid fileFormat";
                return $retVal;
            }
        }

        if ( $this->printingSettings !== null ) {
            $this->printingSettings->fileFormat = $fileFormat;            
        } else {
            if ( $fileFormat !== null ) {
               return  $this->printingSettings = new PrintingSettings($fileFormat, null, null, null, null);
            }
        }  
        
        return $retVal;
    }

    public function setPrintingSettingsPaperFormat($paperFormat = null) {
        $retVal = new WebshipWebserviceResponse();

        if ($paperFormat !== null ) {
            $arr = array_values( (new \ReflectionClass('\SPS\Webship\Webservice\paperFormat'))->getConstants() );
            if ( !in_array( $paperFormat, $arr )) {
                $retVal->errors = "Invalid paperFormat";
                return $retVal;
            }
        }

        if ( $this->printingSettings !== null ) {
            $this->printingSettings->paperFormat = $paperFormat;            
        } else {
            if ($paperFormat !== null ) {
               return  $this->printingSettings = new PrintingSettings( null, $paperFormat, null, null, null);
            }
        }  
        
        return $retVal;
    }

    public function setPrintingSettingsZplResolution( $zplResolution = null) {
        $retVal = new WebshipWebserviceResponse();

        if ($zplResolution !== null ) {
            $arr = array_values( (new \ReflectionClass('\SPS\Webship\Webservice\zplResolution'))->getConstants() );
            if ( !in_array( $zplResolution, $arr )) {
                $retVal->errors = "Invalid zplResolution";
                return $retVal;
            }
        }
        if ( $this->printingSettings !== null ) {
            $this->printingSettings->zplResolution = $zplResolution;            
        } else {
            if ($zplResolution !== null ) {
               return $this->printingSettings = new PrintingSettings( null, null, $zplResolution, null, null);
            }
        }  
        
        return $retVal;
    }

    public function setPrintingSettingsPdfContentFormat( $pdfContentFormat = null) {
        $retVal = new WebshipWebserviceResponse();

        if ($pdfContentFormat !== null ) {
            $arr = array_values( (new \ReflectionClass('\SPS\Webship\Webservice\pdfContentFormat'))->getConstants() );
            if ( !in_array( $pdfContentFormat, $arr )) {
                $retVal->errors = "Invalid pdfContentFormat";
                return $retVal;
            }
        }
        if ( $this->printingSettings !== null ) {
            $this->printingSettings->pdfContentFormat = $pdfContentFormat;            
        } else {
            if ($pdfContentFormat !== null ) {
               return $this->printingSettings = new PrintingSettings( null, null, null, $pdfContentFormat, null);
            }
        }  
        
        return $retVal;
    }

    public function setPrintingSettingsPrintFromPos( $printFromPos = null) {
        $retVal = new WebshipWebserviceResponse();

        if ($printFromPos !== null ) {
            $arr = array_values( (new \ReflectionClass('\SPS\Webship\Webservice\printFromPos'))->getConstants() );
            if ( !in_array( $printFromPos, $arr )) {
                $retVal->errors = "Invalid printFromPos";
                return $retVal;
            }
        }
        if ( $this->printingSettings !== null ) {
            $this->printingSettings->printFromPos = $printFromPos;            
        } else {
            if ($printFromPos !== null ) {
               return $this->printingSettings = new PrintingSettings( null, null, null, null, $printFromPos );
            }
        }  
        
        return $retVal;
    }


    /**
     *  @return  WebshipWebserviceResponse
     */
    public function createCifShipment ()
    {
        $response = new WebshipWebserviceResponse();

        //validate
        if (  count($this->shipments)  === 0 ) {
            $response->errors = "No shipment in List";
            return $response;
        }
        if ( count($this->shipments) > 1 ) {
            $response->addWarning("More than 1 shipment in list, Only 1st shipment will be send");
        }

        $val_ret = $this->validateShipment($this->shipments[0]);
        if ( $val_ret->hasErrors() ) {
            $response->errors = $val_ret->getErrors();
        }

        if ( $response->errors !== null )
        {
            return $response;
        }
           
        $createCifShipment = new createCifShipment( $this->apiUsername, $this->apiPassword, $this->shipments[0]->packagesInfo, WebServiceShipmentType::TLAC );

        $apiResponse = $this->soapApi->createCifShipment($createCifShipment);

        // check apiresponse  ( is soap_fault )
        if ( is_soap_fault( $apiResponse ) ){
            //parse SOAP ERROR
            $response->errors = $apiResponse->faultstring;

        } else {
            // CreateCifShipmentResult
            $retVal = $apiResponse->getCreateCifShipmentReturn();
            $res = $retVal->getResult();
            // set errors and warings from response
            $response->errors = $res->getErrors();
            $response->addWarning(  $res->getWarnings());
            $response->packagesInfo  = $retVal->getPackagesInfo();
        }
        return $response;
    }

    /**
     *  @return  array WebshipWebserviceResponse| WebshipWebserviceResponse
     */
    public function createCifShipments ()
    {
        $response = new WebshipWebserviceResponse();

        //validate
        if (  count($this->shipments)  === 0 ) {
            $response->errors = "No shipments in List";
            return $response;
        }
        
        $createCifShipments = new createCifShipments( $this->apiUsername, $this->apiPassword, $this->shipments, WebServiceShipmentType::TLAC );

        $apiResponse = $this->soapApi->createCifShipments($createCifShipments);

        // check apiresponse  ( is soap_fault )
        if ( is_soap_fault( $apiResponse ) ){
            //parse SOAP ERROR
            $response->errors = $apiResponse->faultstring;

        } else {
            // array  CreateCifShipmentsResult
            $retVal = $apiResponse->getCreateCifShipmentsReturn();

            $response = array();

            for ( $i = 0 ; $i < count($retVal) ; $i++) {

                $rx = new WebshipWebserviceResponse();
                $res = $retVal[$i]->getResult();

                $rx->addError( $res->getErrors());
                $rx->addWarning( $res->getWarnings());
                $rx->addPackagesInfo( $retVal[$i]->getPackagesInfo());
                $response[] = $rx;
            }
        }
        return $response;
    }



    /**
     *  @return  WebshipWebserviceResponse
     */
    public function createAndPrintCifShipment()
    {
        $response = new WebshipWebserviceResponse();

        //validate
        if (  count($this->shipments)  === 0 ) {
            $response->errors = "No shipment in List";
            return $response;
        }
        if ( count($this->shipments)  > 1 ) {
            $response->warnings = "More than 1 shipment in list, Only 1st shipment will be send";
        }

        $val_ret = $this->validateShipment($this->shipments[0]);
        if ( $val_ret->hasErrors() ) {
            $response->errors = $val_ret->getErrors();
        }

        if ( $response->errors !== null )
        {
            return $response;
        }
         
        $createAndPrintCifShipment = new createAndPrintCifShipment( $this->apiUsername, $this->apiPassword,  $this->shipments[0] );
        $apiResponse = $this->soapApi->createAndPrintCifShipment($createAndPrintCifShipment);
        
        if ( is_soap_fault( $apiResponse ) ){
            //parse SOAP ERROR
            $response->errors = $apiResponse->faultstring;
        } else {
            // CreateCifShipmentResult
            $retVal = $apiResponse->getCreateAndPrintCifShipmentReturn();
            $res = $retVal->getResult();
            // set  response
            $response->errors = $res->getErrors();
            $response->addWarning( $res->getWarnings());
            $response->documentUrl = $retVal->getDocumentUrl();
            $response->packagesInfo = $retVal->getPackagesInfo();
        }
        return $response;
    }

    /**
    *  @return  WebshipWebserviceResponse
    */
    public function createAndPrintCifShipmentWithSettings2()
    {
        $response = new WebshipWebserviceResponse();

        //validate
        if (  count($this->shipments)  === 0 ) {
            $response->errors = "No shipment in List";
            return $response;
        }
        if ( count($this->shipments)  > 1 ) {
            $response->warnings = "More than 1 shipment in list, Only 1st shipment will be send";
        }

        $val_ret = $this->validateShipment($this->shipments[0]);
        if ( $val_ret->hasErrors() ) {
            $response->errors = $val_ret->getErrors();
        }

        if ( $response->errors !== null )
        {
            return $response;
        }
        $createAndPrintCifShipment = new createAndPrintCifShipmentWithSettings2( $this->apiUsername, $this->apiPassword,  $this->shipments[0], $this->printingSettings );
        $apiResponse = $this->soapApi->createAndPrintCifShipmentWithSettings2($createAndPrintCifShipment);


        
        if ( is_soap_fault( $apiResponse ) ){
            //parse SOAP ERROR
            $response->errors = $apiResponse->faultstring;
        } else {
            // CreateCifShipmentResult
            $retVal = $apiResponse->getCreateAndPrintCifShipmentReturn();
            $res = $retVal->getResult();
            // set  response
            $response->errors = $res->getErrors();
            $response->addWarning( $res->getWarnings());
            $response->documentUrl = $retVal->getDocumentUrl();
            $response->packagesInfo = $retVal->getPackagesInfo();
        }
        return $response;
    }

    
    /**
     *  @return  WebshipWebserviceResponse
     */
    public function printShipmentLabels()
    {
        $response = new WebshipWebserviceResponse();
        $printShipmentLabels = new printShipmentLabels( $this->apiUsername, $this->apiPassword);
        $apiResponse = $this->soapApi->printShipmentLabels($printShipmentLabels);
        if ( is_soap_fault( $apiResponse ) )
        {
            $response->errors = $apiResponse->faultstring;
        } else {
            $response->errors =  $apiResponse->getPrintShipmentLabelsReturn()->getErrors();
            $response->documentUrl = $apiResponse->getPrintShipmentLabelsReturn()->getDocumentUrl();
        }
        return $response;
    }

/**
     *  @return  WebshipWebserviceResponse
     */
    public function printLabelsWithSettings()
    {
        $response = new WebshipWebserviceResponse();
        $printShipmentLabels = new printLabelsWithSettings( $this->apiUsername, $this->apiPassword, $this->printingSettings );
        $apiResponse = $this->soapApi->printLabelsWithSettings($printShipmentLabels );
        if ( is_soap_fault( $apiResponse ) )
        {
            $response->errors = $apiResponse->faultstring;
        } else {
            $response->errors =  $apiResponse->getPrintLabelsWithSettingsReturn()->getErrors();
            $response->documentUrl = $apiResponse->getPrintLabelsWithSettingsReturn()->getDocumentUrl();
        }
        return $response;
    }

    /**
     *  @return  WebshipWebserviceResponse
     */
    public function printEndOfDay()
    {
        $response = new WebshipWebserviceResponse();
        $printEndOfDay = new printEndOfDay( $this->apiUsername, $this->apiPassword);
        $apiResponse = $this->soapApi->printEndOfDay($printEndOfDay);
        if ( is_soap_fault( $apiResponse ) )
        {
            $response->errors = $apiResponse->faultstring;
        } else {
            $response->errors = $apiResponse->getPrintEndOfDayReturn()->getErrors();
            $response->documentUrl = $apiResponse->getPrintEndOfDayReturn()->getDocumentUrl();
        }
        return $response;
    }

}


