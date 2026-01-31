<?php

namespace SPS\Webship\Webservice;

//Webship API request and response data classes, enumerations. See Webship API doc for details.
class webServiceShipmentType
{
    const TLAC = 0;
    const PREPRAVA = 1;
    const VYZDVIHNUTIE = 2;
}

class notifyType
{
    const NONOTIFY = "0";
    const EMAIL    = "1";
    const SMS      = "2";
    const BOTH     = "3";
}

class billingUnits
{
    const KG   = "kg";
    const BOXA = "boxa";
    const BOXB = "boxb";
    const BOXC = "boxc";
    const WB3  = "winebox3";
    const WB6  = "winebox6";
    const WB12 = "winebox12";
}

class codAttribute
{
    const CASH  = 0;
    const VIAMO = 3;
    const CARD  = 4;
}

class deliveryType
{
    const PT = "2PT";
    const PS = "2PS";
}

class serviceName
{
    const EXPRESS = "expres";
    const T0900   = "0900";
    const T1200   = "1200";
    const EXPORT  = "export";
}

class ShipmentPickup
{
    public $pickupstartdetime;
    public $pickupenddatetime;
    
    function __contruct( $pickupstartdetime, $pickupenddatetime )
    {
        $this->pickupstartdetime = $pickupstartdetime;
        $this->pickupenddatetime = $pickupenddatetime;
    }
}

// SOAP
class Cod
{
    public $codvalue;
    public $codretbankacc;
    public $codretbankcode;
    
    function __construct( $codvalue , $codretbankacc = null, $codretbankcode = null )
    {
        $this->codvalue = $codvalue;
        $this->codretbankacc = $codretbankacc;
        $this->codretbankcode = $codretbankcode;
    }
}

// SOAP
class ShipmentAddress
{
    
    public $city;
    public $zip;
    public $country;
    public $street;
    public $name;
    public $contactPerson;
    public $mobile;
    public $email;
    public $phone;
    
    function __construct( $city, $zip, $country, $street, $name, $contactPerson, $mobile, $email, $phone = null  )
    {
        $this->city    = trim( $city );
        $this->zip     = trim( $zip );
        $this->country = trim( $country );
        $this->street  = trim( $street );
        $this->name    = trim( $name );
        $this->contactPerson = trim( $contactPerson );
        $this->mobile = trim( $mobile );
        $this->email  = trim( $email );
        if ( isset ( $phone ) )
        {
            $this->phone = trim( $phone );
        } else
        {
            $this->phone = null;
        }
    }
}

class WebServicePackage
{
    public $reffnr;
    public $weight;
    
    function __construct( string $reffnr, string $weight )
    {
        $this->reffnr = $reffnr !== null ? trim( $reffnr ) : null;
        $this->weight = $weight !== null ? trim( $weight ) : null;
    }
}

class WebServiceShipment
{
    public $cod;
    public $deliveryaddress;
    public $insurvalue;
    public $notifytype;
    public $packages;
    public $pickupaddress;
    public $productdesc;
    public $recipientpay;
    public $returnshipment;
    public $saturdayshipment;
    public $servicename;
    public $deliveryremark;
    public $shipmentpickup;
    public $tel;
    public $units;
    public $deliverytype;
    public $services;
    public $codattribute;
    
    function __construct( Cod $cod = null, ShipmentAddress  $deliveryaddress = null, $insurvalue = null, $notifytype = null, $packages = null,
                            ShipmentAddress $pickupaddress = null, $productdesc = null, bool $recipientpay = null, bool $returnshipment = null,
                            bool $saturdayshipment = null, $servicename = null, $deliveryremark = null, ShipmentPickup $shipmentpickup = null,
                            bool $tel = null, $units = null, $deliverytype = null, $services = null, $codattribute = null )
    {
        $this->cod              = $cod;                // Cod optional
        $this->deliveryaddress  = $deliveryaddress;    // ShipmentAddress
        $this->insurvalue       = $insurvalue;
        $this->notifytype       = $notifytype;         //optional
        $this->packages         = $packages;           // array WebServicePackage
        $this->pickupaddress    = $pickupaddress;      //optional ShipmentAddress
        $this->productdesc      = $productdesc;        //optional
        $this->recipientpay     = $recipientpay;       //optional
        $this->returnshipment   = $returnshipment;     //optional bool
        $this->saturdayshipment = $saturdayshipment;   //optional  bool
        $this->servicename      = $servicename;        //optional
        $this->deliveryremark   = $deliveryremark;     //optional
        $this->shipmentpickup   = $shipmentpickup;     //optional  ShipmentPickup
        $this->tel              = $tel;                //optional bool
        $this->units            = $units;
        $this->deliverytype     = $deliverytype;        //optional
        $this->services         = $services;           //optional -array ShipmentService
        $this->codattribute     = $codattribute;       // int
    }
}

// enums for pritingSettings
class fileFormat 
{
    const PDF = "pdf";
    const ZPL = "zpl";
}
class paperFormat
{
    const A4 = "a4";
    const A6 = "a6";
    const THERMAL_58 = "thermal_58";
}
class zplResolution
{
    const DPI_204 = "dpi_204";
    const DPI_300 = "dpi_300";
    const DPI_600 = "dpi_600";
}
class pdfContentFormat
{
    const PDF = "pdf";
    const BITMAP = "bitmap";
}
class printFromPos
{
    const P1 = "1";
    const P2 = "2";
    const P3 = "3";
    const P4 = "4";
}

class PrintingSettings 
{
    public $fileFormat;
    public $paperFormat;
    public $zplResolution;
    public $pdfContentFormat;
    public $printFromPos;
    
    function __construct(  $fileFormat = null,  $paperFormat = null,  $zplResolution = null, $pdfContentFormat = null,  $printFromPos = null )
    {
        $this->fileFormat = $fileFormat;
        $this->paperFormat = $paperFormat;
        $this->zplResolution = $zplResolution;
        $this->pdfContentFormat = $pdfContentFormat;
        $this->printFromPos = $printFromPos;
    }
}


// Results and Return Types

// typo in WSDL
class WebServiceShipmnetResult
{
    private $errors;
    private $warnings;
    
    public function getErrors() { return $this->errors; }
    public function getWarnings() { return $this->warnings; }
}

// SOAP Response

class PackageInfo
{
    private $refNr;
    private $shipNr;
    private $packageNo;
    
    public function getRefNr() :string { return $this->refNr; }
    public function getShipNr() :string { return $this->shipNr; }
    public function getPackageNo() :int  { return $this->packageNo; }
}

//   CIF Shipment

class createCifShipment
{
    public $name;
    public $password;
    public $webServiceShipment;
    public $webServiceShipmentType;
    
    function __construct( $name, $password, WebServiceShipment $webServiceShipment, int $webServiceShipmentType )
    {
        $this->name = $name;
        $this->password = $password;
        $this->webServiceShipment = $webServiceShipment;
        $this->webServiceShipmentType = $webServiceShipmentType;
    }
}

class createCifShipmentResponse
{
    private $createCifShipmentReturn; // CreateCifShipmentResult
    
    public function getCreateCifShipmentReturn() { return $this->createCifShipmentReturn; }
}

class CreateCifShipmentResult
{
    private $packageInfo;  // PackageInfo ->item  ; posible array  return as array
    private $result;       // WebServiceShipmnetResult
    
    public function getResult() { return $this->result; }

    // ret array of hashes
    public function getPackagesInfo () {
        if ( $this->packageInfo === null )
        {
            return null;
        }
        $ret = array();
        if ( ! is_array ( $this->packageInfo->item ) ) {
            $ret[] = [ "refNr" => $this->packageInfo->item->getRefNr(), "shipNr" => $this->packageInfo->item->getShipNr(), "packageNo" => $this->packageInfo->item->getPackageNo() ];
        } else {
            foreach( $this->packageInfo->item as $packInfo ) {
                $ret[] = [ "refNr" => $packInfo->getRefNr(), "shipNr" => $packInfo->getShipNr(), "packageNo" => $packInfo->getPackageNo() ];
            }
        }
        return $ret;
    }

}

class createCifShipments {
    
    public $name;
    public $password;
    public $webServiceShipments;
    public $webServiceShipmentType;
    
    function __construct($name, $password, array $webServiceShipments, int $webServiceShipmentType )
    {
        $this->name = $name;
        $this->password = $password;
        $this->webServiceShipments = $webServiceShipments;
        $this->webServiceShipmentType = $webServiceShipmentType;
    }
}

class createCifShipmentsResponse {

    private $createCifShipmentsReturn;   // can be array of CreateCifShipmentResult

    // always return as array
    public function getCreateCifShipmentsReturn() {
        
        if ( is_array($this->createCifShipmentsReturn )) {
            return $this->createCifShipmentsReturn;
        } else {
            return array($this->createCifShipmentsReturn);
        }
    }
}



// CIF and print
class createAndPrintCifShipment {

    public $name;
    public $password;
    public $webServiceShipment;
    
    function __construct( $name, $password, WebServiceShipment $webServiceShipment ){
        $this->name = $name;
        $this->password = $password;
        $this->webServiceShipment = $webServiceShipment;
    }
}

// Cif and print reponse
class createAndPrintCifShipmentResponse {

    private $createAndPrintCifShipmentReturn; //CreateAndPrintCifShipmentResult
    public function getCreateAndPrintCifShipmentReturn() { return $this->createAndPrintCifShipmentReturn; }
}

class CreateAndPrintCifShipmentResult {

    private $packageInfo;  // PackageInfo  item can be array
    private $result;       // WebServiceShipmnetResult   ( not typo )
    private $documentUrl;    // string

    public function getResult() { return $this->result; }
   
    public function getDocumentUrl() { return $this->documentUrl; }

    // ret array of hashes
    public function getPackagesInfo () {
        if ( $this->packageInfo === null )
        {
            return null;
        }
        $ret = array();
        if ( ! is_array ( $this->packageInfo->item ) ) {
            $ret[] = [ "refNr" => $this->packageInfo->item->getRefNr(), "shipNr" => $this->packageInfo->item->getShipNr(), "packageNo" => $this->packageInfo->item->getPackageNo() ];
        } else {
            foreach( $this->packageInfo->item as $packInfo ) {
                $ret[] = [ "refNr" => $packInfo->getRefNr(), "shipNr" => $packInfo->getShipNr(), "packageNo" => $packInfo->getPackageNo() ];
            }
        }
        return $ret;
    }
}

// createAndPrintCifShipmentWithSettings2  
class createAndPrintCifShipmentWithSettings2 {
    
    public $name;
    public $password;
    public $webServiceShipment;
    public $printingSettings;
    
    function __construct( $name, $password, WebServiceShipment $webServiceShipment, PrintingSettings $printingSettings = null ){
        $this->name = $name;
        $this->password = $password;
        $this->webServiceShipment = $webServiceShipment;
        $this->printingSettings = $printingSettings;        
    }
}

class createAndPrintCifShipmentWithSettings2Response {
    private $createAndPrintCifShipmentReturn;  // CreateAndPrintCifShipmentResult
    public function getCreateAndPrintCifShipmentReturn() { return $this->createAndPrintCifShipmentReturn;} 
}


//
class printShipmentLabels {
    
    public $aUserName;
    public $aPassword;
    
    function __construct( $aUserName, $aPassword ){
        
        $this->aUserName = $aUserName;
        $this->aPassword = $aPassword;
    }
}

class printShipmentLabelsResponse {
    
    private $printShipmentLabelsReturn; // WebServicePrintResult
    public function getPrintShipmentLabelsReturn() { return $this->printShipmentLabelsReturn; }
}


//
class printLabelsWithSettings {
    
    public $aUserName;
    public $aPassword;
    public $aPrintingSettings;
    
    function __construct( $aUserName, $aPassword, PrintingSettings $printingSettings = null ){
        
        $this->aUserName = $aUserName;
        $this->aPassword = $aPassword;
        $this->aPrintingSettings = $printingSettings;
    }
}

class printLabelsWithSettingsResponse {
    private $printLabelsWithSettingsReturn; // WebServicePrintResult 
    public function getPrintLabelsWithSettingsReturn() { return $this->printLabelsWithSettingsReturn; }
}


class printEndOfDay {
    
    public $aUserName;
    public $aPassword;
    
    function __construct( $aUserName, $aPassword ){
        
        $this->aUserName = $aUserName;
        $this->aPassword = $aPassword;
    }
}

class printEndOfDayResponse {
    
    private $printEndOfDayReturn; // WebServicePrintResult
    public function getPrintEndOfDayReturn() { return $this->printEndOfDayReturn; }
}

class WebServicePrintResult {
    
    private $errors;
    private $documentUrl;
    
    public function getErrors() { return $this->errors; }
    public function getDocumentUrl() { return $this->documentUrl; }
}



