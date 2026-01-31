<?php
if (! defined('_PS_VERSION_'))
{
	exit();
}

use  SPS\Webship\Webservice\WebshipWebserviceClient;
use  SPS\Webship\Webservice\WebshipWebserviceResponse;
use SPS\Webship\ZipCityChecker\ZipCityChecker;
use SPS\Webship\Webservice\serviceName;

require_once (_PS_MODULE_DIR_ . 'slovakparcelservice' . DIRECTORY_SEPARATOR .  'slovakparcelservicecommon.php');
require_once (_PS_MODULE_DIR_ . 'slovakparcelservice' . DIRECTORY_SEPARATOR . 'WebshipWebservice.php');

class AdminSlovakParcelServiceBackofficeController extends ModuleAdminController
{
	protected $statuses_array = array();
	
	// 0 ADDR, 1 PS, 2 PT
	protected $shipment_type_array = array( 0 => 'ADDR', 1 => 'PS', 2 => 'PT' );

	public function __construct ()
	{
		$this->bootstrap = true;
		// prefix auto added 
		$this->table =  SlovakParcelServiceCommon::TABLE_NAME_SUFFIX;
		// $this->allow_export = true;
		

		parent::__construct();

		// disable row click ( edit)
		$this->list_no_link = true;
		
		// for displaying orders  odrer_carrier.tracking_number  is   ( shipment number )
		
//	    case when a.`type` != 0 then  a.`bal_countryISO` else \'\' end as `pickup_country`,

		$this->_select = ' 
		a.`order_id` as order_id ,
		ord.`reference` as `ref` ,
		ord.`date_add` as `added`, 
		ord.`total_paid_tax_incl` as `total_paid`,
		ord.`payment` as `payment`,
		a.`bal_name`,
	    a.`bal_countryISO` as `pickup_country`,
		osl.`name` AS `osname`,
		os.`color`,
		case when  a.`type` = 0 then \'ADDR\'  when a.`type` = 1 then \'PS\' when a.`type` = 2 then \'PT\' end as `xtype`,
		orc.`tracking_number`,
        a.`bal_address`,
        a.`bal_psc`,
        a.`bal_city`,
		a.`label_url`,
		a.`protocol_url`,
		a.`id_sps_prestashop` as sps_id,
		IFNULL( a.`label_url`, \'\' )  as label_url2';  //convert NULL to empty sring - so callback function is executed

		// use right join so order have to exists in orders table to be shown
		
		$this->_join = ' inner JOIN `' . _DB_PREFIX_ . 'orders` ord ON (ord.`id_order` =  a.`order_id` ) ' .
			'LEFT JOIN `' . _DB_PREFIX_ . 'order_state` os ON (os.`id_order_state` = ord.`current_state`) '.
			'LEFT JOIN `' . _DB_PREFIX_ . 'order_state_lang` osl ON (os.`id_order_state` = osl.`id_order_state` AND osl.`id_lang` = ' .
				(int) $this->context->language->id . ')' .
			// for tracking number ( shipment number )
			'LEFT JOIN `' . _DB_PREFIX_ . 'order_carrier` orc ON ( a.`order_id` = orc.`id_order` )' ;
				
		$this->_orderBy = 'order_id';
		$this->_orderWay = 'DESC';

		// add order status texts for select
		$statuses = OrderState::getOrderStates(
				(int) $this->context->language->id);
		foreach ($statuses as $status)
		{
			$this->statuses_array[$status['id_order_state']] = $status['name'];
		}

		$this->actions_available = array(
			'view',
			'delete'
		);

		// data for renderList
		$this->fields_list = [
			'order_id' => [
			    'title' => $this->module->l('Order Id'),
				'class' => 'fixed-width-xs'
			],
			'ref' => [
			    'title' => $this->module->l('Ref. number'),
				'class' => 'fixed-width-xs',
			    'filter_key' => 'ord!reference',
			],
			'xtype' => [
			    'title' => $this->module->l('Shipment Type'),
 				'type' => 'select',
			    'list' => $this->shipment_type_array,
 		        'filter_key' => 'a!type',
 				'filter_type' => 'int'
				
			],
			'bal_name' => [
			 'title' => 'balíkovo',
				'class' => 'fixed-width-xs',
			    'callback' => 'createPpInfo',
			    'filter_key' => 'a!bal_name'
			],
		    
		    'pickup_country' => [
		        'title' => $this->module->l('Pickup country'),
		        'class' => 'fixed-width-xs',
		        'align' => 'center',
                'filter_key' => 'a!bal_countryISO',
		        'type' => 'text'
		    ],
		    
		    
			'total_paid' => array(
				'title' => $this->module->l('Total'),
				'align' => 'text-right',
				'type' => 'price',
				'currency' => true,
				'callback' => 'setOrderCurrency',
				'badge_success' => true
			),

			'payment' => array(
				'title' => $this->module->l('Payment')
			    
			),
			// order_status
			'osname' => [
				'title' => $this->module->l('Status'),
				'type' => 'select',
				'color' => 'color',
				'list' => $this->statuses_array,
				'filter_key' => 'os!id_order_state',
				'filter_type' => 'int',
				'order_key' => 'osname'
			],
			'added' => [
				'title' => $this->module->l('Added'),
				'type' => 'datetime',
			    'filter_key' => 'ord!date_add',
			],
			'tracking_number' => [
				'title' => $this->module->l('Shipment Number'),
				'class' => 'fixed-width-xs'
			],
			'label_url2' => [
				//'title' => $this->module->l('PDF'),
			    'title' => 'PDF',
				'callback' => 'createDownloadUrl',
				'search' => false			
			]
//,
// 			'protocol_url' => [
// 				'title' => $this->module->l('Protocol PDF'),
// 				'callback' => 'createDownloadUrl',
// 				'search' => false
// 			],
// 			'sps_id' => [
// 				'title' => $this->module->l('Export Data'),
// 				'callback' => 'exportDataUrl',
// 				'search' => false,
// 				'orderby' => false,
// 				'remove_onclick' => true
// 			],
// 		    'sps_id2' => [
// 		        'title' => "all in one",
// 		        'search' => false,
// 		        'callback' => 'allInOne',
		        
		        
// 		    ]
		    
		    

		];

		// add bulk action for export -> function processBulkExport
		$this->bulk_actions = array(
			'export' => array(
				'text' => $this->module->l('Export data to Webship for selected orders')
			)
		);
		
		// get from session
		$session =  \PrestaShop\PrestaShop\Adapter\SymfonyContainer::getInstance()->get('session');
	
		if( !empty($session->get('sps_errors') ) ) {
			$this->errors =  $session->get('sps_errors');
			$session->remove('sps_errors');
		}

		if( !empty($session->get('sps_warnings')) ) {
			$this->warnings =  $session->get('sps_warnings');
			$session->remove('sps_warnings');
		
		}
		if( !empty($session->get('sps_informations')) ) {
			$this->informations =  $session->get('sps_informations');
			$session->remove('sps_informations');
		}
		
	}
	
	public function createPpInfo($name, $row) {
	    
	    if ( ! empty($name) )
	    {
	        return $name . "<br>" . $row["bal_address"] ."<br>" . $row["bal_psc"] . " " . $row["bal_city"];
	    }
	}
	

	public function createDownloadUrl($url, $tr )
	{
	    $output = "";
	    
	   
	    
	    
	    if (  empty($url) ) {
	        
	        // check export state settings 
	       // PrestaShopLogger::addLog("tr " . var_export($tr,true) ); 
	        
	        if ( Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'exportstatusescheck' ) === 'on' ) {
	            
	            $order = new Order($tr['order_id']);
	            $stats = array();
	            $statuses  = Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'exportstatuses' );
	            if (is_string($statuses)) {
	                $stats = json_decode($statuses);
	            }
	            if ( in_array(strval($order->current_state), $stats ) ) {
	             
	                // export   $tr['id_sps_prestashop']
	                $output = '<button type="submit" name="exportdata"   class="btn btn-default" value="' . strval($tr['id_sps_prestashop']) . '"  form="form-sps_prestashop"  >' .
	   	                $this->module->l( 'Export Data')   . '</button>';
	            }
	        }else {
	            
	            // export   $tr['id_sps_prestashop']
	            $output = '<button type="submit" name="exportdata"   class="btn btn-default" value="' . strval($tr['id_sps_prestashop']) . '"  form="form-sps_prestashop"  >' .
	   	            $this->module->l( 'Export Data')   . '</button>';
	        }
	        		
	    }else {
	        // label 
			$output =   '<span class="btn-group-action"><span class="btn-group"> 
			           <a class="btn btn-default" href="' .  self::$currentIndex. '&token=' . $this->token . '&downloadpdf='.  urlencode($url) .'" >' . $this->module->l('Download Label') . '</a></span></span>';
		}
		
		// protocol
		if ( $tr['protocol_url'] !== null  ) {
		    $output .=    '<span class="btn-group-action"><span class="btn-group">
			           <a class="btn btn-default" href="' .  self::$currentIndex. '&token=' . $this->token . '&downloadpdf='.  urlencode($tr['protocol_url']) .'" >' . $this->module->l('Download Protocol') . '</a></span></span>';
		
		}
		
		
		return $output;
	}

// 	public function exportDataUrl($id)
// 	{
// 		if ( ! empty($id) )
// 		{
// 			return   '<span class="btn-group-action"><span class="btn-group"> 
// 			           <a class="btn btn-default" href="' .  self::$currentIndex. '&token=' . $this->token . '&exportdata='.  urlencode($id) .'">'. $this->module->l('Export Data') . '</a></span></span>';
// 		}
// 	}

	public static function setOrderCurrency ($echo, $tr)
	{
		$order = new Order($tr['order_id']);

		$currency = new Currency($order->id_currency);
		return Context::getContext()->currentLocale->formatPrice($echo, $currency->iso_code);
	}

	// page header
	public function initPageHeaderToolbar ()
	{
		parent::initPageHeaderToolbar();

		// Add export buttons in page header
		if (empty($this->display))
		{
// 			$this->page_header_toolbar_btn['printlabels'] = array(
// 				'href' => self::$currentIndex . '&printlabels&token=' . $this->token,
				
// 				'desc' => $this->trans('Print Labels', array(),
// 						'Admin.Orderscustomers.Feature'),
// 				'icon' => 'process-icon-new'				
// 			);

			$this->page_header_toolbar_btn['endofday'] = array ( 
				'href' => self::$currentIndex . '&endofday&token=' . $this->token,
				'desc' => $this->module->l('Print Protocol'),
				'icon' => 'process-icon-export'

			);

			$this->page_header_toolbar_btn['help'] = array(
				'href' => "https://www.solver.sk",
				'desc' => $this->module->l('Manual'),
				'icon' => 'process-icon-help',
				'target' => "_blank"
			);
		}
	}

	// process
	public function postProcess ()
	{
		parent::postProcess();

		// end of day button 
		if ( Tools::isSubmit('endofday') )
		{
			// call webship api endof day 
			// update all orders with shimnent number and with pdf_URL withoud 
			$username = Configuration::get( SlovakParcelServiceCommon::CONFIG_PREFIX . 'apiusername');
			$password = Configuration::get( SlovakParcelServiceCommon::CONFIG_PREFIX . 'apipassword');
			$webshipClient = new WebshipWebserviceClient($username, $password );

			$resp = $webshipClient->printEndOfDay();
			if ( $resp->hasErrors() ) {
				$this->errors[] = $this->module->l('End Of Day returned ERROR : ') . $resp->getErrors() ;
			}else 
			{
				Db::getInstance()->update($this->table, [ 'protocol_url'  =>  pSQL($resp->getDocumentUrl()) ], ' label_url is not null and protocol_url is null' );
			}
			
			if ( count($this->errors) > 0) {
				
				$session = \PrestaShop\PrestaShop\Adapter\SymfonyContainer::getInstance()->get('session');
				$session->set('sps_errors', $this->errors);
			}
			
			Tools::redirectAdmin($this->context->link->getAdminLink ('AdminSlovakParcelServiceBackoffice'));
		}

		// click on order row  // 'update' + DB table   ---- LINK  NOT WORKING  
		// intreference with download PDF 
		if (Tools::isSubmit('updatesps_prestashop'))
		{
			return;
		// do nothing
		// 	$values = Db::getInstance()->getRow(
		// 			'SELECT * FROM `'  . _DB_PREFIX_ . $this->table . '` a ' .
		// 			' WHERE  a.`id_sps_prestashop` = ' .
		// 			pSQL(Tools::getValue('id_sps_prestashop')));
		// 	Tools::redirectAdmin(
		// 			$this->context->link->getAdminLink('AdminOrders') .
		// 			"&id_order=" . $values['order_id'] . "&vieworder");
			
		// 	// Tools::redirectAdmin( $this->context->link->getAdminLink('AdminOrders' ,true,[], ["id_order" => $values['order_id'] ] ) );
		}

		// add button in table header - do nothing 
		if (Tools::isSubmit('addsps_prestashop'))
		{
			return;
		}



		if ( Tools::isSubmit('downloadpdf') )
		{
			$url =  urldecode( Tools::getValue('downloadpdf'));
			$path_parts = parse_url($url);

			// split qury params to array 
			$params = explode('&',$path_parts['query']);

			$filename = '';
		
			//search params that begins with filename=
			foreach($params as $param)
			{
				if ( strncmp( $param, 'filename=', 9) === 0  )
				{
					$filename = substr($param, 9);
					break;
				}
			}	

			// HACK  - DEL   IN PROD 
			//$url = 'http://webship.solver.sk/' . substr($url, 26);
			// END HACK

			$data = file_get_contents($url);
			if ( $data === false ){
			    $this->errors[] = $this->module->l("Cannot download PDF from ") .$url ;
				return;
			}

			// clean buffer
			if (ob_get_level() && ob_get_length() > 0) {
				ob_clean();
			}
			
			$fd = fopen('php://output', 'wb');
			header('Content-Description: File Transfer');
			
			// TODO set correct TYPE for ZPL
			header('Content-Type: application/pdf' );
			header('Cache-Control: no-store, no-cache');
			header('Content-Length: ' . strlen($data));
			header('Content-Disposition: attachment; filename='.  $filename );
			fwrite($fd,$data);
			@fclose($fd);
			die;
		}

		
		if ( Tools::isSubmit('exportdata')) {
			$id =  urldecode( Tools::getValue('exportdata'));
			
			$sps_printing = array() ;
			$sps_printing['settings'] = urldecode( Tools::getValue( 'sps_printingsettings'));
			$sps_printing['format'] = urldecode( Tools::getValue( 'sps_printingformat'));
			$sps_printing['paper'] = urldecode( Tools::getValue( 'sps_paperformat'));
			$sps_printing['a4position'] = urldecode( Tools::getValue( 'sps_a4position'));
			$sps_printing['pdfcontent'] = urldecode( Tools::getValue( 'sps_pdfcontent'));
			$sps_printing['zplresolution'] = urldecode( Tools::getValue( 'sps_zplresolution'));
			
			
			//  save to config
			Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'printingsettings', $sps_printing['settings']);
			Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'paperformat', $sps_printing['paper']);
			Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'printingformat', $sps_printing['format'] );
			Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'a4position', $sps_printing['a4position'] );
			Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'pdfContent', $sps_printing['pdfcontent'] );
			Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'zplresolution', $sps_printing['zplresolution'] );
			
			//if ( Tools::getIsset('export-pdfposition_' . strval($id))) {
			//    $pdf_position = intval( urldecode( Tools::getValue( 'export-pdfposition_' . strval($id))));
			//}
			
			$this->exportDataToWebship([$id], $sps_printing);
			
			$session = \PrestaShop\PrestaShop\Adapter\SymfonyContainer::getInstance()->get('session');
			
			if ( count($this->errors) > 0) {
				$session->set('sps_errors', $this->errors);
			}
			if ( count($this->warnings) > 0) {
				$session->set('sps_warnings', $this->warnings);
			}
			if ( count($this->informations) > 0) {
				$session->set('sps_informations', $this->informations);
			}
			
			Tools::redirectAdmin($this->context->link->getAdminLink ('AdminSlovakParcelServiceBackoffice'));
		}
	}

	// bulk export function implementation -  2 or more : sps_prestashopBox is checkboxes values
	protected function processBulkExport ()
	{		
		// 'submitBulkexport' + DB name 
		if (Tools::isSubmit('submitBulkexportsps_prestashop'))
		{		
			if (Tools::getIsset('sps_prestashopBox') &&
					is_array(Tools::getValue('sps_prestashopBox')))
			{
				// get IDs for export
				$export_ids = array();
				foreach (Tools::getValue('sps_prestashopBox') as $id_psorder)
				{
					$export_ids[] = $id_psorder;
				}		
				
				$sps_printing = array() ;
				$sps_printing['settings'] = urldecode( Tools::getValue( 'sps_printingsettings'));
				$sps_printing['format'] = urldecode( Tools::getValue( 'sps_printingformat'));
				$sps_printing['paper'] = urldecode( Tools::getValue( 'sps_paperformat'));
				$sps_printing['a4position'] = urldecode( Tools::getValue( 'sps_a4position'));
				$sps_printing['pdfcontent'] = urldecode( Tools::getValue( 'sps_pdfcontent'));
				$sps_printing['zplresolution'] = urldecode( Tools::getValue( 'sps_zplresolution'));
				
				//save to config
				Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'printingsettings', $sps_printing['settings']);
				Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'paperformat', $sps_printing['paper']);
				Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'printingformat', $sps_printing['format'] );
				Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'a4position', $sps_printing['a4position'] );
				Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'pdfContent', $sps_printing['pdfcontent'] );
				Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'zplresolution', $sps_printing['zplresolution'] );
				
				
				$this->exportDataToWebship($export_ids, $sps_printing);
			}
			
			$session = \PrestaShop\PrestaShop\Adapter\SymfonyContainer::getInstance()->get('session');
			
			if ( count($this->errors) > 0) {
				$session->set('sps_errors', $this->errors);
			}
			if ( count($this->warnings) > 0) {
				$session->set('sps_warnings', $this->warnings);
			}
			if ( count($this->informations) > 0) {
				$session->set('sps_informations', $this->informations);
			}
			Tools::redirectAdmin($this->context->link->getAdminLink ('AdminSlovakParcelServiceBackoffice'));
		}
	}

	protected function exportDataToWebship($export_ids, $sps_printing )
	{

		// ids for export not filtyered out by pre send checks ( is SPS n, not exported )
		$ids_to_export = array();
		
		$username = Configuration::get( SlovakParcelServiceCommon::CONFIG_PREFIX . 'apiusername');
		$password = Configuration::get( SlovakParcelServiceCommon::CONFIG_PREFIX . 'apipassword');
		$webshipClient = new WebshipWebserviceClient($username, $password );
		
		foreach ( $export_ids as $id )
		{
			// $id is id_sps_prestahop  column 
			// required data 
			$values = Db::getInstance()->getRow( 'SELECT * FROM `' . _DB_PREFIX_ . $this->table . '` WHERE  id_sps_prestashop = ' .  (int) $id );
			
			// check if we have responses - can be delte row must exist 
			if ( $values === false || $values === null ) {
				$this->informations[] = $this->module->l('No Data for order with SPS id ') . strval($id) . '. No Slovak Parcel Service shipment.';
				continue;
			}
			
			$order = new Order($values['order_id']);
			$recAddr = new Address( $order->id_address_delivery);
			$customer = new Customer ( $order->id_customer );
			
			if( ! empty( $order->getWsShippingNumber() ) ) {
				$this->informations[] = $this->module->l('Data for order ') . strval($values['order_id']) . $this->module->l(' were already transferred to webship.');
				continue;
			}	
			
			// check state before export 
			if ( Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'exportstatusescheck' ) === 'on' ) {
			    
			    $stats = array();
			    $statuses  = Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'exportstatuses' );
			    if (is_string($statuses)) {
			        $stats = json_decode($statuses);
			    }
			    if ( !in_array(strval($order->current_state), $stats ) ) {
		          $this->informations[] = $this->module->l('Order with id') . strval($values['order_id']) . $this->module->l(' is not in correct state for export.');
			      continue;
			    }
			}
			
			$shipment = $webshipClient->createWebserviceShipment();
			
			// type int to str 
			$type =  $this->shipment_type_array[ (int) $values['type']];
			
			$ship_city = '';
			$ship_zip = '';
			$ship_country_iso = '';
			$ship_street = '';
			$ship_name = '';
			$ship_contact =  $recAddr->firstname . ' ' . $recAddr->lastname;
			$ship_phone = '';
			if (! empty($recAddr->phone_mobile)) {
			    $ship_phone = $recAddr->phone_mobile;
			} else {
			    // no phone_mobile -> use phone
			    if (! empty($recAddr->phone)) {
			        $ship_phone = $recAddr->phone;
			    }
			}
			$ship_email = $customer->email;

			//check if order is to address or to PS 
			if ($type === 'PS' || $type === 'PT' )
			{	
			    $ship_city = $values['bal_city'];
			    $ship_zip = $values['bal_psc'];
			    $ship_country_iso = $values['bal_countryISO'];
			    $ship_street = $values['bal_address'];
			    $ship_name = $values['bal_name'];
			   
				if ($type ==='PS') {
					$webshipClient->setShipmentToPS($shipment);
				}else {
					$webshipClient->setShipmentToPT($shipment);
				}
			}
			else if ( $type === 'ADDR' )
			{
			    $country = new Country( $recAddr->id_country);
			    
			    $ship_city = $recAddr->city;
			    $ship_zip = SlovakParcelServiceCommon::fixZip($recAddr->postcode);
			    $ship_country_iso = $country->iso_code;
			    $ship_street = $recAddr->address1 . ( empty($recAddr->address2  )? '' : ' ' . $recAddr->address2 );
			    
			    if (isset($recAddr->company) && !empty ( trim($recAddr->company )) ) {
			        $ship_name = $recAddr->company;
			    }else { 
			         $ship_name = $ship_contact;
			    }
			}
			else
			{
				// unknown type 
				$this->errors[] = 'Order ' . strval($values['order_id']) . ' has unknown type.'; 
				continue;
			}
			//set rec address : //	$city, $zip, $country, $street, $name, $contactPerson, $mobile, $email,
			$rx = $webshipClient->setShipmentReceiverAddress($shipment, $ship_city, $ship_zip, $ship_country_iso, $ship_street, $ship_name, $ship_contact, $ship_phone, $ship_email );
			
			
			// export service to non SK 
			if ( $ship_country_iso !== 'SK' ) {
			    $webshipClient->setShipmentServiceName($shipment,serviceName::EXPORT);
			}
			
			
			// notify 
			if ( ZipCityChecker::getNotyfiForCountry($ship_country_iso)  ) {
			    
			    $emailnotification = Configuration::get( SlovakParcelServiceCommon::CONFIG_PREFIX . 'emailnotification');
			    $smsnotification = Configuration::get( SlovakParcelServiceCommon::CONFIG_PREFIX . 'smsnotification');
			    
			    if ($emailnotification === 'on' ) {
			         $webshipClient->setShipmentEmailNotify($shipment);
			    }
			    if ( $type === 'ADDR' && $smsnotification === 'on' ) {
			        $webshipClient->setShipmentSMSNotify($shipment);
			    }
			}
			
			// insurvalue
			$webshipClient->setShipmentInsurValue($shipment, strval($order->total_paid_tax_incl));
			
			// cod -  from our  table 
			if ( $values['is_cod']  !== null  ){
			
			    if ( intval( $values['is_cod'])  === 1 ) {
			        $webshipClient->setShipmentCod($shipment, strval($order->total_paid_tax_incl));
			    }
			}else {
			 // fall back before is_cod parameter   
			    if (   $order->module === 'ps_cashondelivery')
			    {
				    $webshipClient->setShipmentCod($shipment, strval($order->total_paid_tax_incl));
			     }
			}
			
			// add package  1kg 
			$webshipClient->addShipmentPackage($shipment,$order->reference, "1.00");
			
			
			$webshipClient->addShipmentToList($shipment,false);
			
			// add order id to array off ids to export 
			$ids_to_export[] = $values['order_id'];
			// end of loop	
		}

		if ( count( $webshipClient->shipments) === 0  ) {
			$this->informations[] = $this->module->l('No Shipments for export ');
			return;
		}
		
		//$sps_printing
		if ( $sps_printing['settings'] === 'custom') {
		    
		    if ( $sps_printing['format'] === 'zpl') {
		        $webshipClient->setPrintingSettingsFileFormat(\SPS\Webship\Webservice\fileFormat::ZPL);
		        //def 200 
		        if ( $sps_printing['zplresolution'] == 'dpi_300') {
		            $webshipClient->setPrintingSettingsZplResolution(\SPS\Webship\Webservice\zplResolution::DPI_300);
		        }else if ($sps_printing['zplresolution'] == 'dpi_600') {
		            $webshipClient->setPrintingSettingsZplResolution(\SPS\Webship\Webservice\zplResolution::DPI_600);
		        }else {
		            $webshipClient->setPrintingSettingsZplResolution(\SPS\Webship\Webservice\zplResolution::DPI_204);
		        }
		    }else {
		        $webshipClient->setPrintingSettingsFileFormat(\SPS\Webship\Webservice\fileFormat::PDF);
		        
		        //content def pdf 
		        if ( $sps_printing['pdfcontent'] === 'bitmap') {
		            $webshipClient->setPrintingSettingsPdfContentFormat(\SPS\Webship\Webservice\pdfContentFormat::BITMAP);
		        }else {
		            $webshipClient->setPrintingSettingsPdfContentFormat(\SPS\Webship\Webservice\pdfContentFormat::PDF);
		        }
		        
		        //paper  a4 a6 termal 
		        if ( $sps_printing['paper'] === "a6") {
		            $webshipClient->setPrintingSettingsPaperFormat(\SPS\Webship\Webservice\paperFormat::A6);
		        }else if ($sps_printing['paper'] === "thermal_58") {
		            $webshipClient->setPrintingSettingsPaperFormat(\SPS\Webship\Webservice\paperFormat::THERMAL_58);
		        }else {
		            $webshipClient->setPrintingSettingsPaperFormat(\SPS\Webship\Webservice\paperFormat::A4);
		            
		            //a4 position def 1 
		            if ( $sps_printing['a4position'] === "2") {
		                $webshipClient->setPrintingSettingsPrintFromPos(\SPS\Webship\Webservice\printFromPos::P2);
		            }else if ( $sps_printing['a4position'] === "3") {
		                $webshipClient->setPrintingSettingsPrintFromPos(\SPS\Webship\Webservice\printFromPos::P3);
		            }else if ( $sps_printing['a4position'] === "4") {
		                $webshipClient->setPrintingSettingsPrintFromPos(\SPS\Webship\Webservice\printFromPos::P4);
		            } else {
		                $webshipClient->setPrintingSettingsPrintFromPos(\SPS\Webship\Webservice\printFromPos::P1);
		            }
		        }
		        
		        
		    }
		}
		
		if ( count( $webshipClient->shipments) === 1  ) {
		    
		    $resp = null;
		    if ($webshipClient->printingSettings === null  ) {
		        $resp = $webshipClient->createAndPrintCifShipment();
		    }else {
			     $resp = $webshipClient->createAndPrintCifShipmentWithSettings2();
		    }

			if (! $resp->hasErrors() )
			{
				$order = new Order($ids_to_export[0]);
				$order->setWsShippingNumber($resp->getPackagesInfo()[0]['shipNr']);
				$values = Db::getInstance()->update($this->table,  ['label_url' => $resp->getDocumentUrl() ], 'order_id = ' . pSQL($ids_to_export[0] )); 
				
				// update state 
				if ( Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'afterexportstatuscheck' ) === 'on' ) {
				    // afterexportstatus is always set to something
				    $order->setWsCurrentState( intval( Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'afterexportstatus' )) );
				}
			} else 
			{
				$this->errors[] = $this->module->l('For Order ') . strval($ids_to_export[0]) . $this->module->l(' webservice returned ERROR(s) : ') . $resp->getErrors() ;
			}
		}else {
			$resp = $webshipClient->createCifShipments();
			$resp2 = null;
			if ($webshipClient->printingSettings === null  ) {
			    $resp2 = $webshipClient->printShipmentLabels();
			}else {
			    $resp2 = $webshipClient->printLabelsWithSettings();
			}
			
			// iter over resp array 
			// iter over and finde failed and non failed , update non failed
		
			for ( $i = 0 ; $i < count($resp) ; $i++ ) {
				
				if (! $resp[$i]->hasErrors() ) {
					
					$order = new Order((int) $ids_to_export[$i]);
					$order->setWsShippingNumber($resp[$i]->getPackagesInfo()[0]['shipNr']);
					$values = Db::getInstance()->update($this->table,  ['label_url' => $resp2->getDocumentUrl() ], 'order_id = ' . (int) $ids_to_export[$i] ); 
					
					// update state
					if ( Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'afterexportstatuscheck' ) === 'on' ) {
					   // afterexportstatus is always set to something
					    $order->setWsCurrentState( intval( Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'afterexportstatus' )) );
					}
					
				}  else {
				    $this->errors[]  = $this->module->l('For Order ') . strval($ids_to_export[$i]) . $this->module->l(' webservice returned ERROR(s) : ') . $resp[$i]->getErrors();
				}
				if ( $resp[$i]->hasWarnings()) {
				    $this->warnings[] = $this->module->l('For Order ') . strval($ids_to_export[$i]) . $this->module->l(' webservice returned WARNING(s) : ') . $resp[$i]->getWarnings();
				}
			}
		}
	}
}
