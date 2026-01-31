<?php

namespace SPS\Webship\Webservice;
use SoapClient;
use SoapFault;
use Exception;


require_once( __DIR__  . DIRECTORY_SEPARATOR . "WebshipWebserviceSoapAPIClasses.php");


define("wsdlLink", "https://webship.sps-sro.sk/services/WebshipWebService?wsdl");

//define("wsdlLink", "http://webship.solver.sk/services/WebshipWebService?wsdl");

// Webship API wrapper class, See WebShip api documentation for details.
class WebshipWebserviceSoapAPI
{
    
    public $options;
    
    function __construct()
    {
        $this->options = array (
                       
            'classmap' => array(
                // WSDL => PHP
                'createCifShipmentResponse' => 'SPS\Webship\Webservice\createCifShipmentResponse',
                'createCifShipmentsResponse' => 'SPS\Webship\Webservice\createCifShipmentsResponse',
                'createAndPrintCifShipmentResponse' => 'SPS\Webship\Webservice\createAndPrintCifShipmentResponse',
                'createAndPrintCifShipmentWithSettings2Response' => 'SPS\Webship\Webservice\createAndPrintCifShipmentWithSettings2Response',
                'printShipmentLabelsResponse' => 'SPS\Webship\Webservice\printShipmentLabelsResponse',
                'printLabelsWithSettingsResponse' => 'SPS\Webship\Webservice\printLabelsWithSettingsResponse',
                'printEndOfDayResponse' => 'SPS\Webship\Webservice\printEndOfDayResponse',
                'WebServicePrintResult' => 'SPS\Webship\Webservice\WebServicePrintResult',
                'CreateCifShipmentResult' => 'SPS\Webship\Webservice\CreateCifShipmentResult',
                'CreateAndPrintCifShipmentResult' => 'SPS\Webship\Webservice\CreateAndPrintCifShipmentResult',
                'WebServiceShipmnetResult'=>'SPS\Webship\Webservice\WebServiceShipmnetResult',
                'PackageInfo' => 'SPS\Webship\Webservice\PackageInfo',
            ),
        );
    }
    
       
    public function  createCifShipment( createCifShipment $createCifShipment)
    {
        $result = "";
        try
        {
            $client =  @new SoapClient( wsdlLink, $this->options );
        } catch (SoapFault $e )
        {
            return $e;
        } catch ( Exception $e )
        {
            $result = new SoapFault( $e->getCode(), $e->getMessage(), "", $e->getTraceAsString() );
            return $result;
        }
        try {
            
            $result = $client->createCifShipment($createCifShipment);
        } catch (SoapFault $e)
        {
            return $e;
        } catch (Exception $e)
        {
            $result = new SoapFault($e->getCode(), $e->getMessage(), "", $e->getTraceAsString() );
            return  $result;
        }
        return $result;
    }


    public function createCifShipments( createCifShipments $createCifShipments )
    {
        $result = "";
        try
        {
            $client =  @new SoapClient( wsdlLink, $this->options );
        } catch (SoapFault $e )
        {
            return $e;
        } catch ( Exception $e )
        {
            $result = new SoapFault( $e->getCode(), $e->getMessage(), "", $e->getTraceAsString() );
            return $result;
        }
        try {
            $result = $client->createCifShipments($createCifShipments);
        } catch (SoapFault $e)
        {
            return $e;
        } catch (Exception $e)
        {
            $result = new SoapFault($e->getCode(), $e->getMessage(), "", $e->getTraceAsString() );
            return  $result;
        }
        return $result;
    }


    

    public function createAndPrintCifShipment( createAndPrintCifShipment $createAndPrintCifShipment)
    {
        $result = "";
        try
        {
            $client =  @new SoapClient( wsdlLink, $this->options );
        } catch (SoapFault $e )
        {
            return $e;
        } catch ( Exception $e )
        {
            $result = new SoapFault( $e->getCode(), $e->getMessage(), "", $e->getTraceAsString() );
            return $result;
        }
        try {
            
            $result = $client->createAndPrintCifShipment($createAndPrintCifShipment);
        } catch (SoapFault $e)
        {
            return $e;
        }catch (Exception $e)
        {
            $result = new SoapFault($e->getCode(), $e->getMessage(), "", $e->getTraceAsString() );
            return  $result;
        }
        return $result;
    }

    public function createAndPrintCifShipmentWithSettings2 (createAndPrintCifShipmentWithSettings2 $createAndPrintCifShipmentWithSettings2 )
    {
        $result = "";
        try
        {
            $client =  @new SoapClient( wsdlLink, $this->options );
        } catch (SoapFault $e )
        {
            return $e;
        } catch ( Exception $e )
        {
            $result = new SoapFault( $e->getCode(), $e->getMessage(), "", $e->getTraceAsString() );
            return $result;
        } 
        try {
            
            $result = $client->createAndPrintCifShipmentWithSettings2($createAndPrintCifShipmentWithSettings2);
        } catch (SoapFault $e)
        {
            return $e;
        }catch (Exception $e)
        {
            $result = new SoapFault($e->getCode(), $e->getMessage(), "", $e->getTraceAsString() );
            return  $result;
        }

        return $result;
    }



    public function  printShipmentLabels( printShipmentLabels $printShipmentLabels )
    {
        $result = "";
        try
        {
            $client =  @new SoapClient( wsdlLink, $this->options );
        } catch( SoapFault $e )
        {
            return $e;
        } catch( Exception $e )
        {
            $result = new SoapFault( $e->getCode(), $e->getMessage(), "", $e->getTraceAsString() );
            return $result;
        }
        try
        {
            $result = $client->printShipmentLabels( $printShipmentLabels );
        } catch( SoapFault $e )
        {
            return $e;
        } catch( Exception $e )
        {
            $result = new SoapFault( $e->getCode(), $e->getMessage(), "", $e->getTraceAsString() );
            return  $result;
        }
        return $result;
    }

    public function printLabelsWithSettings( printLabelsWithSettings $printLabelsWttihSettings) {
        $result = "";
        try
        {
            $client =  @new SoapClient( wsdlLink, $this->options );
        } catch( SoapFault $e )
        {
            return $e;
        } catch( Exception $e )
        {
            $result = new SoapFault( $e->getCode(), $e->getMessage(), "", $e->getTraceAsString() );
            return $result;
        }
        try
        {
            $result = $client->printLabelsWithSettings( $printLabelsWttihSettings );
        } catch( SoapFault $e )
        {
            return $e;
        } catch( Exception $e )
        {
            $result = new SoapFault( $e->getCode(), $e->getMessage(), "", $e->getTraceAsString() );
            return  $result;
        }

        return $result;
    }

    public function printEndOfDay( $printEndOfDay )
    {
        $result = "";
        try
        {
            $client =  @new SoapClient( wsdlLink, $this->options );
        } catch( SoapFault $e )
        {
            return $e;
        } catch( Exception $e )
        {
            $result = new SoapFault( $e->getCode(), $e->getMessage(), "", $e->getTraceAsString() );
            return $result;
        }
        try
        {
            $result = $client->printEndOfDay( $printEndOfDay );
        } catch( SoapFault $e )
        {
            return $e;
        } catch( Exception $e )
        {
            $result = new SoapFault( $e->getCode(), $e->getMessage(), "", $e->getTraceAsString() );
            return  $result;
        }
        return $result;
    }
}
