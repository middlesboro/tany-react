<?php
declare(strict_types = 1);

// Avoid direct access to the file
if (! defined('_PS_VERSION_')) {
    exit();
}

require_once (_PS_MODULE_DIR_ . 'slovakparcelservice' . DIRECTORY_SEPARATOR . 'slovakparcelservicecommon.php');

require_once (_PS_MODULE_DIR_ . 'slovakparcelservice' . DIRECTORY_SEPARATOR . 'ZipCityChecker.php');

use SPS\Webship\ZipCityChecker\ZipCityChecker;

class SlovakParcelService extends CarrierModule
{

    // for multiple carriers in one module
    public $id_carrier;

    /*
     * * Construct Method
     * *
     */
    public function __construct()
    {
        $this->name = 'slovakparcelservice';
        $this->tab = 'shipping_logistics';
        $this->version = '1.7.1';
        $this->author = 'Solver IT s.r.o.';
        
        $this->ps_versions_compliancy = array(
            'min' => '1.7.6',
            'max' => _PS_VERSION_
        );
        $this->bootstrap = true;
        $this->is_configurable = true;
        // track and trace URL
        $this->url = 'http://t-t.sps-sro.sk/';
        parent::__construct();

        $this->displayName = $this->l('Slovak Parcel Service s.r.o.');
       
        $this->description = $this->l('Module for delivery shipments by SPS s.r.o.');

        $this->TABLE_NAME = _DB_PREFIX_ . SlovakParcelServiceCommon::TABLE_NAME_SUFFIX;

        if (self::isInstalled($this->name)) {
            // Getting carrier list
            global $cookie;
            $carriers = Carrier::getCarriers($cookie->id_lang, true, false, false, NULL, PS_CARRIERS_AND_CARRIER_MODULES_NEED_RANGE);

            // Saving id carrier list
            $id_carrier_list = array();
            foreach ($carriers as $carrier)
                $id_carrier_list[] .= $carrier['id_carrier'];

            // Testing if Carrier Id exists
            $warning = array();
            if (! in_array((int) (Configuration::get('SPS_TO_PICKUPPLACE_CARRIER_ID')), $id_carrier_list))
                $warning[] .= $this->l('"SPS balíkovo"') . ' ';

            if (! in_array((int) (Configuration::get('SPS_TO_ADDRESS_CARRIER_ID')), $id_carrier_list))
                $warning[] .= $this->l('"SPS Adresa"') . ' ';

            // all others auto are filled during install

            if (count($warning))
                $this->warning .= implode(' , ', $warning) . $this->l(' must be configured to use this module correctly ');
        }
    }

    /*
     * * Install / Uninstall Methods
     * *
     */
    public function install()
    {
        
        $carrierConfig = array(
            0 => array(
                'name' => 'SPS balíkovo',
                'id_tax_rules_group' => 0,
                'active' => true,
                'deleted' => 0,
                'shipping_handling' => true,
                'range_behavior' => 0,
                'delay' => array(
                    'sk' => 'Doručenie balíkovo',
                    'en' => 'Delivery balíkovo'
                ),
                'id_zone' => 1,
                'is_module' => true,
                'shipping_external' => true,
                'external_module_name' => $this->name,   // for  actionValidateStepComplete
                'need_range' => true
            ),
            1 => array(
                'name' => 'SPS Adresa',
                'id_tax_rules_group' => 0,
                'active' => true,
                'deleted' => 0,
                'shipping_handling' => true,
                'range_behavior' => 0,
                'delay' => array(
                    'sk' => 'Doručenie na Adresu',
                    'en' => 'Delivery to Address'
                ),
                'id_zone' => 1,
                'is_module' => true,
                'shipping_external' => true,
                'external_module_name' => $this->name,    // for  actionValidateStepComplete
                'need_range' => true
            )
        );
        
        // add english name as default lang if it not english or slovak 
        $lng = Language::getIsoById(Configuration::get('PS_LANG_DEFAULT'));
        if ( $lng !== 'sk' && $lng !== 'en' ) {
            $carrierConfig[0]['delay'][$lng] = 'Delivery balíkovo';
            $carrierConfig[1]['delay'][$lng] = 'Delivery to Address';
        }
        

        $id_carrier1 = $this->installExternalCarrier($carrierConfig[0]);
        $id_carrier2 = $this->installExternalCarrier($carrierConfig[1]);
        
        Configuration::updateValue('SPS_TO_PICKUPPLACE_CARRIER_ID', (int) $id_carrier1);
        Configuration::updateValue('SPS_TO_ADDRESS_CARRIER_ID', (int) $id_carrier2);

        if (! parent::install() || 
            ! $this->registerHook('displayBeforeCarrier') ||
            ! $this->registerHook('displayCarrierExtraContent') || 
            ! $this->registerHook('actionCarrierUpdate') || 
            ! $this->registerHook('actionValidateOrder') || 
            ! $this->registerHook('displayAdminListBefore') || 
            ! $this->registerHook('displayHeader') || 
            ! $this->registerHook('displayBackOfficeHeader') ||
            ! $this->registerHook('actionValidateStepComplete') || 
            ! $this->registerHook('actionCustomerLogoutAfter') || 
            ! $this->registerHook('actionCartSave') || 
            ! $this->registerHook('displayOrderConfirmation') ||  
            ! $this->registerHook('displayPaymentTop')    
           // || ! $this->registerHook('sendMailAlterTemplateVars')  
           
           )
        {
                
            return false;
         }
         
         if (! $this->createTableBaliky()) {
             
             return false;
         }
         
         if ( ! $this->createZipTables()) {
             return false ;
         }
         
        // add menu item to Orders menu
        $currentid = Tab::getIdFromClassName('AdminSlovakParcelServiceBackoffice');
        if (! $currentid) {
            $tab = new Tab();
            $tab->active = 1;
            $tab->class_name = "AdminSlovakParcelServiceBackoffice";
            $tab->name = array();
            foreach (Language::getLanguages() as $lang) {
                $tab->name[$lang['id_lang']] = "Slovak Parcel Service";
            }
            $tab->id_parent = Tab::getIdFromClassName('AdminParentOrders');
            $tab->module = $this->name;
            
            $ret = $tab->add();
            
            if ( ! $ret ){
                return false;
            }
        }

        return true;
    }

    public function uninstall()
    {
        // Uninstall
        if (! parent::uninstall() ||
            ! $this->unregisterHook('displayBeforeCarrier') ||
            ! $this->unregisterHook('displayCarrierExtraContent') || 
            ! $this->unregisterHook('actionCarrierUpdate') || 
            ! $this->unregisterHook('actionValidateOrder') || 
            ! $this->unregisterHook('displayAdminListBefore') ||
            ! $this->unregisterHook('displayHeader') || 
            ! $this->unregisterHook('displayBackOfficeHeader') ||
            ! $this->unregisterHook('actionValidateStepComplete') || 
            ! $this->unregisterHook('actionCustomerLogoutAfter') || 
            ! $this->unregisterHook('actionCartSave') || 
            ! $this->unregisterHook('displayOrderConfirmation') || 
            ! $this->unregisterHook('displayPaymentTop')  
            // || ! $this->unregisterHook('sendMailAlterTemplateVars')
        ) 
        {
            return false;
        }
        // Delete External Carrier
        $Carrier1 = new Carrier((int) (Configuration::get('SPS_TO_PICKUPPLACE_CARRIER_ID')));
        $Carrier2 = new Carrier((int) (Configuration::get('SPS_TO_ADDRESS_CARRIER_ID')));

        // If external carrier is default set other one as default
        if (Configuration::get('PS_CARRIER_DEFAULT') == (int) ($Carrier1->id)) {
            global $cookie;
            $carriersD = Carrier::getCarriers($cookie->id_lang, true, false, false, NULL, PS_CARRIERS_AND_CARRIER_MODULES_NEED_RANGE);
            foreach ($carriersD as $carrierD)
                if ($carrierD['active'] and ! $carrierD['deleted'] and ($carrierD['name'] != $this->_config['name']))
                    Configuration::updateValue('PS_CARRIER_DEFAULT', $carrierD['id_carrier']);
        }

        // Then delete Carrier - mark as deleted
        $Carrier1->deleted = 1;
        $Carrier2->deleted = 1;

        if (! $Carrier1->update() || ! $Carrier2->update()) {
            return false;
        }

        return true;
    }

    
    public function hookDisplayAdminListBefore($param)
    {

        if ( Tools::getValue('controller') !== "AdminSlovakParcelServiceBackoffice" ) {
            return;
        }
        
        // printing settings toolbar 
        $printingsettings =  Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'printingsettings');
        $printingformat = Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'printingformat');
        $paperformat = Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'paperformat');
        $a4position = Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'a4position');
        $pdfcontent  = Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'pdfContent');
        $zplresolution = Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'zplresolution');
        
        $output = '<div class="panel"><div style="width:auto;display:inline-block;margin-left:20px;">
        <label for="sps_printingsettings">' . $this->l('Printing Settings') . '</label>' .
	   	        '<select id="sps_printingsettings" name="sps_printingsettings" form="form-sps_prestashop" style="width:auto;" >' ;
       
       if ($printingsettings === 'custom') {
            $output .= '<option value="webship" >' . $this->l("Webship settings") . '</option>
                      <option value="custom" selected>' .  $this->l("Custom settings") . '</option></select></div>';
        }else {
            $output .= '<option value="webship" selected>' . $this->l("Webship settings") . '</option>
                        <option value="custom">' .  $this->l("Custom settings") . '</option></select></div>';
        }
        // printing format def pdf
        $output .= '<div style="width:auto;display:inline-block;margin-left:20px;"><label for="sps_printingformat"  >' . $this->l('Printing Format') . '</label>' .
	   	        '<select id="sps_printingformat" name="sps_printingformat" form="form-sps_prestashop" style="width:auto;" >' ;
        
        if ($printingformat === 'zpl') {
            $output .= '<option value="pdf">PDF</option>
                      <option value="zpl" selected>ZPL</option></select></div>';
        }else {
            $output .= '<option value="pdf" selected>PDF</option>
                        <option value="zpl">ZPL</option></select></div>';
        }
        //paperformat def a4
        $output .= '<div style="width:auto;display:inline-block;margin-left:20px;"><label for="sps_paperformat"  >' . $this->l('Paper Format') . '</label>' .
            '<select id="sps_paperformat" name="sps_paperformat" form="form-sps_prestashop" style="width:auto;" >' ;
        
        if ( $paperformat === 'a6'){
            $output .= '<option value="a4">A4</option><option value="a6" selected>A6</option>
                      <option value="thermal_58" >'.$this->l('Thermal 58mm') .'</option></select></div>';
            
        }else if ($paperformat === 'thermal_58') {
            $output .= '<option value="a4">A4</option><option value="a6">A6</option>
                      <option value="thermal_58" selected>'.$this->l('Thermal 58mm') .'</option></select></div>';
            
        }else {
            $output .= '<option value="a4" selected>A4</option><option value="a6">A6</option>
                      <option value="thermal_58">'.$this->l('Thermal 58mm') .'</option></select></div>';
        }
        //$a4position def 1
        $output .= '<div style="width:auto;display:inline-block;margin-left:20px;"><label for="sps_a4position"  >' .$this->l('A4 Start Position') . '</label>' .
            '<select id="sps_a4position" name="sps_a4position" form="form-sps_prestashop" style="width:auto;" >' ;
        
        if ( $a4position === "2" ) {
            $output .= '<option value="1">1</option><option value="2" selected>2</option>
                      <option value="3">3</option><option value="4">4</option></option></select></div>';
            
        }else if ($a4position === "3") {
            $output .= '<option value="1">1</option><option value="2">2</option>
                      <option value="3" selected>3</option><option value="4">4</option></option></select></div>';
            
        }else if ($a4position === "4") {
            $output .= '<option value="1">1</option><option value="2">2</option>
                      <option value="3">3</option><option value="4" selected>4</option></option></select></div>';
        }else {
            $output .= '<option value="1" selected>1</option><option value="2">2</option>
                      <option value="3">3</option><option value="4">4</option></option></select></div>';
        }
        //$pdfcontent def pdfnative 
        $output .= '<div style="width:auto;display:inline-block;margin-left:20px;"><label for="sps_pdfcontent"  >' . $this->l('PDF Content') . '</label>' .
            '<select id="sps_pdfcontent" name="sps_pdfcontent" form="form-sps_prestashop" style="width:auto;" >' ;
        
        if ( $pdfcontent === "bitmap") {
            $output .= '<option value="pdf">'.$this->l("Native PDF").'</option><option value="bitmap" selected>'.$this->l("Bitmap").'</option></select></div>';
        }else {
            $output .= '<option value="pdf" selected>'.$this->l("Native PDF").'</option><option value="bitmap">'.$this->l("Bitmap").'</option></select></div>';
        }
        //$zplresolution def 200 
        $output .= '<div style="width:auto;display:inline-block;margin-left:20px;"><label for="sps_zplresolution"  >' . $this->l('ZPL Resolution') . '</label>' .
            '<select id="sps_zplresolution" name="sps_zplresolution" form="form-sps_prestashop" style="width:auto;" >' ;
        if ($zplresolution === "dpi_300" ) {
            $output .= '<option value="dpi_204">204 DPI</option><option value="dpi_300" selected>300 DPI</option><option value="dpi_600">600 DPI</option></select></div>';
        }else if ($zplresolution === "dpi_600") {
            $output .= '<option value="dpi_204">204 DPI</option><option value="dpi_300">300 DPI</option><option value="dpi_600" selected>600 DPI</option></select></div>';
        }else {
            $output .= '<option value="dpi_204" selected>204 DPI</option><option value="dpi_300">300 DPI</option><option value="dpi_600">600 DPI</option></select></div>';
        }

         $output .= '</div>';
        return $output;
    }
  
    
    
    public function createTableBaliky()
    {
        // tabulka s PS zasielkami
        // type : 0 adresa, 1 PS, 2 PT
        $sql = 'CREATE TABLE IF NOT EXISTS `' . $this->TABLE_NAME . '` (
				`id_sps_prestashop`            int NOT NULL AUTO_INCREMENT,
				`order_id`                  int(10) NOT NULL,
				`type`			    		int(1) NOT NULL,
				`bal_name`					varchar(20) NULL,
				`bal_vpsc`					varchar(8) NULL,
				`bal_psc`					varchar(8) NULL,
				`bal_address`				varchar(30) NULL,
				`bal_city`					varchar(30) NULL,
				`label_url`					varchar(256) NULL,
				`protocol_url`				varchar(256) NULL,
				`bal_cod`					boolean NULL,
                `bal_countryISO`            varchar(2) NULL,
                `is_cod`                    boolean NULL,
				PRIMARY KEY (`id_sps_prestashop`)

			) ENGINE=' . _MYSQL_ENGINE_ . ' DEFAULT CHARSET=utf8mb4;';

        if (! Db::getInstance()->execute($sql)) {
            return false;
        }
		// check for  new columns      label_url, protocol_url bal_cod, ids_cod 
        $new_cols = [ "label_url" =>  "varchar(256) NULL", "protocol_url" => "varchar(256) NULL", "bal_cod" => "boolean NULL", "is_cod" => "boolean NULL" ];
		
		foreach($new_cols as $col => $spec ) {
		    
		    // check for existance 
		    $sql = "SHOW COLUMNS FROM `" . $this->TABLE_NAME . "` LIKE '" . $col .  "'";
		    $result = Db::getInstance()->executeS($sql);
		    
		    if (count( $result)  === 0 ) {
			    $sql = 'ALTER TABLE ' . $this->TABLE_NAME . ' ADD `'  . $col .'`  ' . $spec  ;
	   		    Db::getInstance()->execute($sql);
		    }
	   		
        }
        
        //check bal_countryISO
        $sql = "SHOW COLUMNS FROM `" . $this->TABLE_NAME . "` LIKE 'bal_countryISO'";
        $result =  Db::getInstance()->executeS($sql);
        
        if (count( $result)  === 0 ) {
            $sql_add = "ALTER TABLE `" . $this->TABLE_NAME . "` add bal_countryISO varchar(2) NULL";
            Db::getInstance()->execute($sql_add);
            
            // set SK country to existing orders
            $sql_fix = "UPDATE `" . $this->TABLE_NAME . "` set bal_countryISO = 'SK' where type != 0 ";
            Db::getInstance()->execute( $sql_fix);
        }
        return true;
    }
    public function createZipTables() {
        
        $sql = "CREATE TABLE IF not exists `" . ZipCityChecker::$table_zipcity ."` (
            `zip` varchar(5) COLLATE utf8mb4_slovak_ci NOT NULL,
            `city` varchar(100) COLLATE utf8mb4_slovak_ci NOT NULL,
            `city_noaccent` varchar(100) COLLATE utf8mb4_slovak_ci NOT NULL,
            `city_nospace` varchar(100) COLLATE utf8mb4_slovak_ci NOT NULL,
            `city_nos_noacc` varchar(100) COLLATE utf8mb4_slovak_ci NOT NULL,
            PRIMARY KEY (`zip`,`city`),
            KEY `slovakparcelservice_zipcity_zip_IDX` (`zip`) USING BTREE,
            KEY `slovakparcelservice_zipcity_city_IDX` (`city`) USING BTREE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_slovak_ci" ;
        
        if (! Db::getInstance()->execute($sql)) {
            return false;
        }
        
        // check for primary key 
        $ret = Db::getInstance()->getValue( "select count(*) from information_schema.table_constraints where table_name = '" . ZipCityChecker::$table_zipcity . "' and constraint_name = 'PRIMARY'" );
        if ( $ret === '0') {
            $dupl = Db::getInstance()->executeS("select count(*) as count, zip,city from ". ZipCityChecker::$table_zipcity . " group by zip,city order by count desc" );
            for ( $i = 0  ; $i < count( $dupl); $i++ ) {
                if  ( (int) $dupl[$i]['count']  > 1 ) {
                    Db::getInstance()->execute("delete from " . ZipCityChecker::$table_zipcity . " where zip = '" . pSQL($dupl[$i]['zip'] ) ."' and city = '" . $dupl[$i]['city'] ."'  LIMIT " . strval ( (int) $dupl[$i]['count'] -1 ));
                }else {
                    break;
                }
            }
            // add primary key
            Db::getInstance()->execute("ALTER TABLE " . ZipCityChecker::$table_zipcity . " ADD  PRIMARY KEY (`zip`,`city`)");
        }
        
        
        $sql = "CREATE TABLE IF not exists `" . ZipCityChecker::$table_countries ."` (
            `num_code` int NOT NULL,
            `iso_code` varchar(2) NOT NULL,
            `zip_minlength` int  NOT NULL,
            `zip_maxlength` int NOT NULL,
            `zip_is_alphanum` boolean NOT NULL,
            `cod` boolean NOT NULL,
            `notify` boolean NOT NULL,
            `currency` varchar(3) NOT NULL,
            UNIQUE KEY `slovakparcelservice_zipformat_iso_code_IDX` (`iso_code`) USING BTREE
            )
             ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_slovak_ci" ;
        
        if (! Db::getInstance()->execute($sql)) {
            return false;
        }
        
        // add default data  
        $sql = "select count(*) from `" . ZipCityChecker::$table_countries ."`";
        
        $ret = Db::getInstance()->getValue($sql);
        
        if ( $ret === false ) {
            return false;
        }
        if ((int)  $ret === 0) {
            $sql = " insert into `" . ZipCityChecker::$table_countries .  "`"
            . " (num_code, iso_code, zip_minlength, zip_maxlength, zip_is_alphanum, cod, notify, currency)  VALUES  "
            . " ( 40, 'AT',	1,	4,	0,	1, 0, 'EUR'), "
            . " ( 56, 'BE',	1,	4,	0,	0, 0, 'EUR'), "
            . " (100, 'BG',	4,	4,	0,	1, 1, 'BGN'), "
            . " (191, 'HR',	5,	5,	0,	1, 0, 'EUR'), "
            . " (203, 'CZ',	5,	5,	0,	1, 1, 'CZK'), "
            . " (208, 'DK',	4,	4,	0,	0, 0, 'DKK'), "
            . " (233, 'EE',	5,	5,	0,	0, 0, 'EUR'), "
            . " (246, 'FI',	5,	5,	0,	0, 0, 'EUR'), "
            . " (250, 'FR',	1,	5,	0,	0, 0, 'EUR'), "
            . " (276, 'DE',	1,	5,	0,	1, 0, 'EUR'), "
            . " (348, 'HU',	1,	4,	0,	1, 1, 'HUF'), "
            . " (380, 'IT',	1,	5,	0,	1, 0, 'EUR'), "
            . " (428, 'LV',	4,	4,	0,	0, 0, 'EUR'), "
            . " (440, 'LT',	5,	5,	0,	0, 0, 'EUR'), "
            . " (442, 'LU',	1,	4,	0,	0, 0, 'EUR'), "
            . " (528, 'NL',	6,	6,	1,	0, 0, 'EUR'), "
            . " (616, 'PL',	1,	5,	0,	0, 0, 'PLN'), "
            . " (620, 'PT',	7,	7,	0,	0, 0, 'EUR'), "
            . " (642, 'RO',	1,	6,	0,	1, 0, 'RON'), "
            . " (703, 'SK',	1,	5,	0,	1, 1, 'EUR'), "
            . " (705, 'SI',	4,	4,	0,	1, 0, 'EUR'), "
            . " (724, 'ES',	1,	5,	0,	0, 1, 'EUR'), "
            . " (752, 'SE',	5,	5,	0,	0, 0, 'SEK') ";
           if (! Db::getInstance()->execute($sql)) {
                return false;
           }
        }
        return true;
    }

    public static function installExternalCarrier($config)
    {
        $carrier = new Carrier();
        $carrier->name = $config['name'];
        $carrier->id_tax_rules_group = $config['id_tax_rules_group'];
        $carrier->id_zone = $config['id_zone'];
        $carrier->active = $config['active'];
        $carrier->deleted = $config['deleted'];
        $carrier->delay = $config['delay'];
        $carrier->shipping_handling = $config['shipping_handling'];
        $carrier->range_behavior = $config['range_behavior'];
        $carrier->is_module = $config['is_module'];
        $carrier->shipping_external = $config['shipping_external'];
        $carrier->external_module_name = $config['external_module_name'];
        $carrier->need_range = $config['need_range'];

        $languages = Language::getLanguages(true);
        foreach ($languages as $language) {
            if ($language['iso_code'] == 'sk')
                $carrier->delay[(int) $language['id_lang']] = $config['delay'][$language['iso_code']];
            if ($language['iso_code'] == 'en')
                $carrier->delay[(int) $language['id_lang']] = $config['delay'][$language['iso_code']];
            if ($language['iso_code'] == Language::getIsoById(Configuration::get('PS_LANG_DEFAULT')))
                $carrier->delay[(int) $language['id_lang']] = $config['delay'][$language['iso_code']];
        }

        if ($carrier->add()) {
            $groups = Group::getGroups(true);
            foreach ($groups as $group)
                Db::getInstance()->insert('carrier_group', array(
                    'id_carrier' => (int) ($carrier->id),
                    'id_group' => (int) ($group['id_group'])
                ));

            $rangePrice = new RangePrice();
            $rangePrice->id_carrier = $carrier->id;
            $rangePrice->delimiter1 = '0';
            $rangePrice->delimiter2 = '10000';
            $rangePrice->add();

            $rangeWeight = new RangeWeight();
            $rangeWeight->id_carrier = $carrier->id;
            $rangeWeight->delimiter1 = '0';
            $rangeWeight->delimiter2 = '10000';
            $rangeWeight->add();

            //only EU zone
            $zones = Zone::getZones(true);
            foreach ($zones as $zone) {
                Db::getInstance()->insert('carrier_zone', array(
                    'id_carrier' => (int) ($carrier->id),
                    'id_zone' => (int) ($zone['id_zone'])
                ));
                Db::getInstance()->insert('delivery', array(
                    'id_carrier' => (int) ($carrier->id),
                    'id_range_price' => (int) ($rangePrice->id),
                    'id_range_weight' => NULL,
                    'id_zone' => (int) ($zone['id_zone']),
                    'price' => '0'
                ));
                Db::getInstance()->insert('delivery', array(
                    'id_carrier' => (int) ($carrier->id),
                    'id_range_price' => NULL,
                    'id_range_weight' => (int) ($rangeWeight->id),
                    'id_zone' => (int) ($zone['id_zone']),
                    'price' => '0'
                ));
            }

            // Copy Logo
            
            if ( $carrier->name === 'SPS Adresa') {
            
                copy(dirname(__FILE__) . '/logo.jpeg', _PS_SHIP_IMG_DIR_ . '/' . (int) $carrier->id . '.jpg');
            }else {
                // Balikovo logo     // save with jpg suffix  
                copy(dirname(__FILE__) . '/balikovo.png', _PS_SHIP_IMG_DIR_ . '/' . (int) $carrier->id . '.jpg');
                
            }
                
            // Return ID Carrier
            return (int) ($carrier->id);
        }
        return false;
    }

    /*
     * * Form Configuration page Methods
     * *
     */
    public function getContent()
    {
        $output = '';
        // this part is executed only when the form is submitted
        if (Tools::isSubmit('submit_' . $this->name)) {
            // api username, pass
            $webshipApiUsername = strval(Tools::getValue("webshipApiUsername"));
            $webshipApiPassword = strval(Tools::getValue("webshipApiPassword"));
            //$googleApiKey =  strval(Tools::getValue("googleApiKey"));
            $deliveryOptions = Tools::getValue("deliveryOptions");
            $zipcitycheck =  Tools::getValue("zipcitycheck_check");
            if ( $zipcitycheck === false ) {
                $zipcitycheck = "off"; 
            }
            $eurtonoteurozone = Tools::getValue("eurtonoteurozone_check");
            if ( $eurtonoteurozone === false ) {
                $eurtonoteurozone = "off";
            }
            
            $codpayments = Tools::getValue("codpayments",[]);

            
            $dataupdatetoken =  Tools::getValue("dataupdatetoken");
          
            /*
            // webdhip /custom 
            $printingSettingDefault =  Tools::getValue("printingSettingDefault");
            // ZPL /PDF
            $printingFormatDefault =  Tools::getValue("printingFormatDefault");
            // A4 A6 58_termal 
            $paperFormatDefault = Tools::getValue("paperFormatDefault");
            // a4 for pos 1,2,3,4
            $a4PositionDefault = Tools::getValue("a4PositionDefault");
            // pdfnative , bitmap
            $pdfContentDefault = Tools::getValue("pdfContentDefault");
            //zpl resolution 
            $zplResolutionDefault = Tools::getValue("zplResolutionDefault");
            */
            
            $emailNotification = Tools::getValue("emailNotification_check");
            if ($emailNotification === false) {
                $emailNotification = 'off';
            }
            $smsNotification = Tools::getValue("smsNotification_check");
            if ( $smsNotification === false ) {
                $smsNotification = 'off';
            }
            
            $exportstatusescheck = Tools::getValue("exportstatusescheck_check");
            if ( $exportstatusescheck  === false ){
                $exportstatusescheck = 'off';
            }
            $exportstatuses = Tools::getValue("exportstatuses",[]);
            $afterexportstatuscheck = Tools::getValue("afterexportstatuscheck_check");
            if ( $afterexportstatuscheck === false ){
                $afterexportstatuscheck = 'off';
            }
            $afterexportstatus = Tools::getValue("afterexportstatus");
            
            
            // save to config
            if (! empty($webshipApiUsername) && ! empty($webshipApiPassword)) {
                Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'apiusername', $webshipApiUsername);
                Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'apipassword', $webshipApiPassword);
               // Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'googleapikey', $googleApiKey);
                Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'deliveryOptions', $deliveryOptions);
                Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'zipcitycheck', $zipcitycheck);
                Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'eurtonoteurozone', $eurtonoteurozone);
                Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'codpayments', json_encode( $codpayments) );
                Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'dataupdatetoken', $dataupdatetoken);
                
                /*
                Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'printingsettings', $printingSettingDefault);
                Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'paperformat',$paperFormatDefault);
                Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'printingformat',$printingFormatDefault );
                Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'a4position', $a4PositionDefault );
                Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'pdfContent',$pdfContentDefault );
                Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'zplresolution',  $zplResolutionDefault );
                */
                
                Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'emailnotification', $emailNotification );
                Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'smsnotification', $smsNotification );
                
                Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'exportstatusescheck',  $exportstatusescheck );
                Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'exportstatuses', json_encode($exportstatuses) );
                Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'afterexportstatuscheck', $afterexportstatuscheck );
                Configuration::updateValue(SlovakParcelServiceCommon::CONFIG_PREFIX . 'afterexportstatus', $afterexportstatus );
                
                // update zip/city data if not updated yet
                $last_date = Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'datalastupdate');
                if ( ! $last_date ) {
                    define('SPS_UPDATE_INCLUDE', 1);
                    //ret array
                    $update_output =  include (_PS_MODULE_DIR_ . 'slovakparcelservice' . DIRECTORY_SEPARATOR . 'data-update.php');
                    if ( !is_empty( $update_output )) {
                        $output .= $this->displayError($update_output);
                    }
                }
                
                $output .= $this->displayConfirmation($this->l('Settings updated'));
            } else {
                $output .= $this->displayError($this->l('Missing required values!'));
            }
        }
        
        // get payments methods
        $payment_methods = array();
        foreach (PaymentModule::getInstalledPaymentModules() as $payment) {
            $module = Module::getInstanceByName($payment['name']);
            if (Validate::isLoadedObject($module) && $module->active) {
                $payment_methods[] =  array( 'id' =>  $module->name,  'name' => $module->displayName );
            }
        }
        
        $states = new OrderState(1);
        $states2 = $states->getOrderStates($this->context->language->id );
        
        $statuses = array();
        foreach($states2 as $state ) {
            $statuses[] = array ( 'id' => $state['id_order_state'], 'name' => $state['name'] ) ;
        }
        usort($statuses, function ($a, $b) {
           $ia = intval($a['id']);
           $ib = intval($b['id']);
           if ( $ia == $ib) {
               return 0; 
           }
           return ( $ia < $ib ) ? -1 :1 ;
        });
        
        
        $update_msg =  $this->l('Updating data');

        $webshipApiSettings = array(
            'legend' => array(
                'title' => $this->l('Settings')
            ),
            'input' => array(
                array(
                    // api username
                    'type' => 'text',
                    'label' => $this->l('Webship Api Username'),
                    'name' => 'webshipApiUsername',
                    'required' => true
                ),
                array(
                    // api username
                    'type' => 'text',
                    'label' => $this->l('Webship Api Password'),
                    'name' => 'webshipApiPassword',
                    'required' => true
                ),
                array(
                    'type' => 'select',
                    'label' =>  $this->l('Display balíkovo pickup place type'),
                    'width' => 'auto',
                    'class' => 'fixed-width-xxl',
                    'name' => 'deliveryOptions',
                    'required' => false,
                    'options' => array(
                        'query' => array( 
                            array(
                                'id_option' => 'ps',
                                'name' => $this->l('Parcelshop')
                            ),
                            array(
                                'id_option' => 'pt',
                                'name' => $this->l('Parcelterminal')
                            ),
                            array(
                                'id_option' => 'pspt',
                                'name' => $this->l('Parcelshop and Parcelterminal')
                            )
                        ),
                        'id' => 'id_option',
                        'name' => 'name'
                        )
                ),
                array(
                    'type' => 'checkbox',
                    'label' => $this->l('Check Zip/City'),
                    'name' => 'zipcitycheck',
                    'required' => false,
                    'values' => array(
                        'id'    => 'id_option',
                        'name'  => 'name',
                        'query' => array(
                            array(
                                'id_option' => 'check',
                                'name' =>  ''
                            )
                        )
                     )
                ),
                array(
                    'type' => 'select',
                    'label' => $this->l('Cod payments'),
                    'desc'  => $this->l('Select all Cod type payments.'),
                    'name' => 'codpayments[]',
                    'multiple' => true,
                    'options' => array(
                        'query' => $payment_methods,
                        'id' => 'id',
                        'name' => 'name'
                    )
                ),
                
                array(
                    'type' => 'checkbox',
                    'label' => $this->l('All COD in EUR'),
                    'desc'  => $this->l("Sending COD in EUR to all supported not Eurozone countries."),
                    'name' => 'eurtonoteurozone',
                    'required' => false,
                    'values' => array(
                        'id'    => 'id_option',
                        'name'  => 'name',
                        'query' => array(
                            array(
                                'id_option' => 'check',
                                'name' =>  ''
                            )
                        )
                    )
                ),
                array(
                    'type' => 'text',
                    'label' => $this->l('Zip data last update'),
                    'name' => 'datalastupdate'
                ),
                array(
                    'type' => 'text',
                    'label' => $this->l('Data update token'),
                    'name' => 'dataupdatetoken',
                    'desc'  => $this->l('For data auto update, create cron job with URL ')  . Tools::getShopDomainSsl(true) . '/modules/slovakparcelservice/data-update.php?spstoken=' .  Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'dataupdatetoken')
                ),
        /*        
                array(
                    'type' => 'select',
                    'label' =>  $this->l('Default Printing Settings'),
                    'width' => 'auto',
                    'class' => 'fixed-width-xxl',
                    'name' => 'printingSettingDefault',
                    'required' => false,
                    'options' => array(
                        'query' => array(
                            array(
                                'id_option' => 'webship',
                                'name' => $this->l("Webship settings")
                            ),
                            array(
                                'id_option' => 'custom',
                                'name' => $this->l("Custom settings")
                            )
                        ),
                        'id' => 'id_option',
                        'name' => 'name'
                    )
                ),
                array(
                    'type' => 'select',
                    'label' =>  $this->l('Default Printing Format'),
                    'width' => 'auto',
                    'class' => 'fixed-width-xxl',
                    'name' => 'printingFormatDefault',
                    'required' => false,
                    'options' => array(
                        'query' => array(
                            array(
                                'id_option' => 'pdf',
                                'name' => 'PDF'
                            ),
                            array(
                                'id_option' => 'zpl',
                                'name' => 'ZPL'
                            )
                        ),
                        'id' => 'id_option',
                        'name' => 'name'
                    )
                ),
                array(
                    'type' => 'select',
                    'label' =>  $this->l('Default Paper Format'),
                    'width' => 'auto',
                    'class' => 'fixed-width-xxl',
                    'name' => 'paperFormatDefault',
                    'required' => false,
                    'options' => array(
                        'query' => array(
                            array(
                                'id_option' => 'a4',
                                'name' => 'A4'
                            ),
                            array(
                                'id_option' => 'a6',
                                'name' => 'A6'
                            ),
                            array(
                                'id_option' => 'thermal_58',
                                'name' => $this->l('Thermal 58mm')
                            )
                        ),
                        'id' => 'id_option',
                        'name' => 'name'
                    )
                ),
                array(
                    'type' => 'select',
                    'label' =>  $this->l('Default A4 Start Position'),
                    'width' => 'auto',
                    'class' => 'fixed-width-xxl',
                    'name' => 'a4PositionDefault',
                    'required' => false,
                    'options' => array(
                        'query' => array(
                            array(
                                'id_option' => '1',
                                'name' => '1'
                            ),
                            array(
                                'id_option' => '2',
                                'name' => '2'
                            ),
                            array(
                                'id_option' => '3',
                                'name' => '3'
                            ),
                            array(
                                'id_option' => '4',
                                'name' => '4'
                            )
                        ),
                        'id' => 'id_option',
                        'name' => 'name'
                    )
                ),
                array(
                    'type' => 'select',
                    'label' =>  $this->l('Default PDF Content'),
                    'width' => 'auto',
                    'class' => 'fixed-width-xxl',
                    'name' => 'pdfContentDefault',
                    'required' => false,
                    'options' => array(
                        'query' => array(
                            array(
                                'id_option' => 'pdf',
                                'name' => $this->l("Native PDF")
                            ),
                            array(
                                'id_option' => 'bitmap',
                                'name' => $this->l("Bitmap")
                            )
                        ),
                        'id' => 'id_option',
                        'name' => 'name'
                    )
                ),
                
                array(
                    'type' => 'select',
                    'label' =>  $this->l('Default ZPL Resolution'),
                    'width' => 'auto',
                    'class' => 'fixed-width-xxl',
                    'name' => 'zplResolutionDefault',
                    'required' => false,
                    'options' => array(
                        'query' => array(
                            array(
                                'id_option' => 'dpi_204',
                                'name' => '204 DPI'
                            ),
                            array(
                                'id_option' => 'dpi_300',
                                'name' => '300 DPI'
                            ),
                            array(
                                'id_option' => 'dpi_600',
                                'name' => '600 DPI'
                            )
                        ),
                        'id' => 'id_option',
                        'name' => 'name'
                    )
                ),
    */
                
                array(
                    'type' => 'checkbox',
                    'label' => $this->l('Use status filter for data export'),
                    'name' => 'exportstatusescheck',
                    'required' => false,
                    'values' => array(
                        'id'    => 'id_option',
                        'name'  => 'name',
                        'query' => array(
                            array(
                                'id_option' => 'check',
                                'name' =>  ''
                            )
                        )
                    )
                ),
                array(
                    'type' => 'select',
                    'label' => $this->l('Export statuses'),
                    'name' => 'exportstatuses[]',
                    'width' => 'auto',
                    'class' => 'fixed-width-xxl',
                    'multiple' => true,
                    'options' => array(
                        'query' => $statuses,
                        'id' => 'id',
                        'name' => 'name'
                    )
                ),
                array(
                    'type' => 'checkbox',
                    'label' => $this->l('Change status after data export'),
                    'name' => 'afterexportstatuscheck',
                    'required' => false,
                    'values' => array(
                        'id'    => 'id_option',
                        'name'  => 'name',
                        'query' => array(
                            array(
                                'id_option' => 'check',
                                'name' =>  ''
                            )
                        )
                    )
                ),
                array(
                    'type' => 'select',
                    'label' => $this->l('After export status'),
                    'name' => 'afterexportstatus',
                    'width' => 'auto',
                    'class' => 'fixed-width-xxl',
                    'options' => array(
                        'query' => $statuses,
                        'id' => 'id',
                        'name' => 'name'
                    )
                ),
                array(
                    'type' => 'checkbox',
                    'label' => $this->l('Email Notification'),
                    'name' => 'emailNotification',
                    'required' => false,
                    'values' => array(
                        'id'    => 'id_option',
                        'name'  => 'name',
                        'query' => array(
                            array(
                                'id_option' => 'check',
                                'name' =>  ''
                            )
                        )
                    )
                ),
                
                array(
                    'type' => 'checkbox',
                    'label' => $this->l('SMS Notification'),
                    'name' => 'smsNotification',
                    'required' => false,
                    'values' => array(
                        'id'    => 'id_option',
                        'name'  => 'name',
                        'query' => array(
                            array(
                                'id_option' => 'check',
                                'name' =>  ''
                            )
                        )
                    )
                ),
                
                
                array (
                    'type'=>'hidden',
                    'name' =>  'update_msg',
                    'label' => ''
                )
            ),
            
            'submit' => array(
                'title' => $this->l('Save'),
                'class' => 'btn btn-default pull-right'
            ),
            
            'buttons' => array (
                array(
                    //'href' =>  self::$currentIndex. '&token=' . $this->token . '&updatedata=1',
                    'js' => 'SlovakParcelService.spsUpdateData( \'' . Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'dataupdatetoken' ) . '\')',
                    'class' => '',
                    'type' => 'button',         // Button type
                    'id'   => 'sps_update_data',
                    'name' => 'sps_update_data',
                    'icon' => 'icon-foo',       // Icon to show, if any
                    'title' => $this->l('Update Zip/City data'),
                )
            )
            
        );

        $default_lang_id = (int) Configuration::get('PS_LANG_DEFAULT');
        $helperForm = new HelperForm();
        // create form to display
        $helperForm->module = $this;

        $helperForm->default_form_language = $default_lang_id;
        $helperForm->allow_employee_form_lang = $default_lang_id;

        $helperForm->title = $this->displayName;
        $helperForm->show_toolbar = true;
        $helperForm->toolbar_scroll = true;
        $helperForm->submit_action = 'submit_' . $this->name;

        // read current values from config
        $helperForm->fields_value['webshipApiUsername'] = Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'apiusername');
        $helperForm->fields_value['webshipApiPassword'] = Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'apipassword');
        //$helperForm->fields_value['googleApiKey'] = Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'googleapikey');
        $helperForm->fields_value['deliveryOptions'] = Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'deliveryOptions');
      
        /*
        $helperForm->fields_value['printingSettingDefault'] = Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'printingsettings');
        $helperForm->fields_value['printingFormatDefault'] = Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'printingformat');
        $helperForm->fields_value['paperFormatDefault'] = Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'paperformat');
        $helperForm->fields_value['a4PositionDefault'] = Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'a4position');
        $helperForm->fields_value['pdfContentDefault'] = Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'pdfContent');
        $helperForm->fields_value['zplResolutionDefault'] = Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'zplresolution');
       */
        
        $helperForm->fields_value['update_msg'] = $this->l('Updating data');
        
        $datetime = Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'datalastupdate');
        if ( empty($datetime)) {
            $helperForm->fields_value['datalastupdate'] = '';
        }else {
            $dt = new DateTime('@'.$datetime);
            $tz = new DateTimeZone( "Europe/Bratislava");
            $dt = $dt->setTimezone($tz);
            $helperForm->fields_value['datalastupdate'] = $dt->format("d. m. Y  H:i:s T");
        }
        $helperForm->fields_value['dataupdatetoken'] = Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'dataupdatetoken');
        
        if (  Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'exportstatusescheck' ) !== 'off' ) {
            $helperForm->fields_value['exportstatusescheck_check'] = 'on';
        }else {
            $helperForm->fields_value['exportstatusescheck_check'] = false;
        }
        
        $cod_json = Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'exportstatuses');
        if ( is_string($cod_json)){
            $helperForm->fields_value['exportstatuses[]'] = json_decode( $cod_json );
        }else {
            $helperForm->fields_value['exportstatuses[]'] = array();
        }
        
        if (  Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'afterexportstatuscheck' ) !== 'off' ) {
            $helperForm->fields_value['afterexportstatuscheck_check'] = 'on';
        }else {
            $helperForm->fields_value['afterexportstatuscheck_check'] = false;
        }
        
        $helperForm->fields_value['afterexportstatus'] = Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'afterexportstatus');
        

        if ( Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'emailnotification') !== 'off' ) {
            $helperForm->fields_value['emailNotification_check'] = 'on';
        }else {
            $helperForm->fields_value['emailNotification_check'] = false;
        }
        
        if (Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'smsnotification') !== 'off' ) {
            $helperForm->fields_value['smsNotification_check'] = 'on';
        }else {
            $helperForm->fields_value['smsNotification_check'] = false;
        }
        
        
        
        if (Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'zipcitycheck') !== 'off' ) {
            $helperForm->fields_value['zipcitycheck_check'] = 'on' ;
        } else {
            $helperForm->fields_value['zipcitycheck_check'] = false ;
         }
        
        $cod_json = Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'codpayments');
        if ( is_string($cod_json)){
            $helperForm->fields_value['codpayments[]'] = json_decode( $cod_json );
        }else {
            $helperForm->fields_value['codpayments[]'] = array();
        }
        
        if ( Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'eurtonoteurozone') !== 'off') {
            $helperForm->fields_value['eurtonoteurozone_check'] = 'on';
        }else {
            $helperForm->fields_value['eurtonoteurozone_check'] = false;
        }

        $form = [
            'form' => $webshipApiSettings
        ];
        return $output . $helperForm->generateForm([
            $form
        ]);
    }
    
    
    public function hookDisplayHeader()
    {
        
        if ( $this->context->smarty->getTemplateVars('page')['page_name'] !== 'checkout' ) {
            return;
        }
        // only if pp dely is enabled 
        $carrier_pp =  new Carrier( (int) Configuration::get('SPS_TO_PICKUPPLACE_CARRIER_ID') );
        
        // active is int 0, 1
        if (  $carrier_pp-> active == false  ) {
            return;
        }
        
        if ( !  Module::isEnabled('onepagecheckoutps')  ) {
            return $this->display(__FILE__, 'sps_prestashop_header.tpl');
        }else {
            return $this->display(__FILE__, 'sps_prestashop_header_onepagecheckoutps.tpl');
        }
    }
    
    
    
    // add jS to Backoffice header
    public function hookDisplayBackOfficeHeader() {
        
        $this->context->controller->addJS( $this->_path . 'js/sps_prestashop_admin.js', 'all');
    }
    
    // after hookActionValidateOrder
    public function hookDisplayOrderConfirmation($params)
    {
        $session = &$this->context->cookie;;
        if ( $session->__get('bal_name') !== false ) {
            $session->__unset('bal_name');
            $session->write();
        }

        if ($params['order']->id_carrier == (int) (Configuration::get('SPS_TO_PICKUPPLACE_CARRIER_ID'))) {
           
            return $this->l("The Order will be delivered to balíkovo : ") . $session->__get("bal_info") .", ".   $session->__get("bal_address") . ", " . $session->__get("bal_psc") . " " . $session->__get("bal_city") . ", " . $session->__get("bal_countryISO");
            
            
        }
    }

    /*
     *
     * * Hook update carrier
     * *
     */
    public function hookActionCarrierUpdate($params)
    {
        if ((int) ($params['id_carrier']) === (int) (Configuration::get('SPS_TO_PICKUPPLACE_CARRIER_ID')))
            Configuration::updateValue('SPS_TO_PICKUPPLACE_CARRIER_ID', (int) ($params['carrier']->id));

        if ((int) ($params['id_carrier']) === (int) (Configuration::get('SPS_TO_ADDRESS_CARRIER_ID')))
            Configuration::updateValue('SPS_TO_ADDRESS_CARRIER_ID', (int) ($params['carrier']->id));
    }

    // remove selected PS on logout
    public function hookActionCustomerLogoutAfter()
    {
        $session = &$this->context->cookie;
        if ( $session->__get("bal_name") !== false  ){
            $session->__unset("bal_name");
            $session->write();
        }
    }

    // remove selected PS from session on empty cart
    public function hookActionCartSave()
    {
        if ($this->context->cart && Cart::getNbProducts($this->context->cart->id) === 0) {
            $session = &$this->context->cookie;
            if ($session->__get("bal_name") !== false ){
                $session->__unset("bal_name");
                $session->write();
            }
        }
    }

    public function hookActionValidateStepComplete($params)
    {
        if ($params['step_name'] !== 'delivery') {
            return;
        }
        
        $session = &$this->context->cookie;
        
        // non SPS 
        if ( (int) $this->context->cart->id_carrier !==  (int) Configuration::get('SPS_TO_PICKUPPLACE_CARRIER_ID')
            &&  (int) $this->context->cart->id_carrier !==  (int) Configuration::get('SPS_TO_ADDRESS_CARRIER_ID') ) {
            
            $session->__unset('bal_name');
            $session->write();
            return;
        }
       
        // PP check if pp is selected 
        if ( (int) $this->context->cart->id_carrier === (int) (Configuration::get('SPS_TO_PICKUPPLACE_CARRIER_ID'))  && 
            ($session->__get('bal_name') === false   || $session->__get('bal_name') === '' )) {
        
            $params['completed'] = false;
            return;
        }
        
        // dont allow continue ( phone check in extracontent  // TODO CHECK
        if (  $session->__get('sps_phone_is_ok') === false || $session->__get('sps_phone_is_ok') === 'false' ) {
            $params['completed'] = false;
           // return;
        }
        
        // zip/City 
        //  save to session and read in extra content hook  
        
        if ( Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'zipcitycheck') !== 'off' ) {
            
            //  SK 
            $addr = new Address($this->context->cart->id_address_delivery);
            $country = new Country( $addr->id_country);
        
            if ( $country->iso_code === 'SK' ) { 
                // if addr use addr else use pickup place data 
                if ( (int) $this->context->cart->id_carrier ===  (int) Configuration::get('SPS_TO_ADDRESS_CARRIER_ID')) {
                
                    $ret = ZipCityChecker::checkZipCity( $addr->postcode, $addr->city);
                    if ( ! $ret['result'] ) {
                        $params['completed'] = false;
                    
                        $message = '';
                        if (  count($ret['options']) > 0 ) {
                            $message = $this->l('No zip city match, please use one of these cities for shipping :');
                        
                            $message .= "<pre style=\"padding:0;\">" . $ret['options'][0] ;
                            for( $i = 1 ; $i < count( $ret['options'] ); $i++) {
                                $message .=  "<br>" . $ret['options'][$i];
                            }
                            $message .= "</pre>";
                        } else {
                            $message = $this->l('No city for zip, please check zip');
                        }
                        $session->__set('sps_addr_error_msg', $message);
                        $session->write();
                    }
                } else {
                    //pickup place 
                    $ret = ZipCityChecker::checkZipCity( $this->parseCookie('bal_psc'), $this->parseCookie('bal_city'));
                    if ( ! $ret['result'] ) {
                        $params['completed'] = false;
                    
                        $message = 'balíkovo';
                    
                        $message .=  $session->__get('bal_info'). ", " .  $session->__get('bal_name') . ' ' . $session->__get("bal_address") . ', ' . $session->__get("bal_psc") . ' ' . $session->__get("bal_city") ;
                    
                        $message .= $this->l(' contains invalid data. Please select other one.');
                        $session->__set('sps_pp_error_msg', $message);
                        $session->write();
                    }
                }
            }else {
                // NON SK 
                if ( (int) $this->context->cart->id_carrier ===  (int) Configuration::get('SPS_TO_ADDRESS_CARRIER_ID')) {
                    // zip format check 
                    $ret = ZipCityChecker::checkZipFormat($country->iso_code, $addr->postcode ); 
                    if (! $ret['res'] ) {
                        $params['completed'] = false;
                    
                        $message =  $this->l('Zip format check failed. ');
                        $message .= $this->l(', zip max length : ') .  strval($ret["min"])  ." " ;
                        $message .=  $this->l('zip max length') . strval($ret["max"]);
                    
                        if ( ! $ret["alphanum"]) {
                            $message .= $this->l('. Digits only.');
                        }else {
                            $message .= $this->l('. Digits and letters.');
                        }
                        $session->__set('sps_addr_error_msg', $message);
                        $session->write();
                    }
                }else {
                    // pickup place (CZ)
                    $ret = ZipCityChecker::checkZipFormat( $session->__get('bal_countryISO'),  $session->__get("bal_psc") );
                    if (! $ret['res'] ) {
                        $params['completed'] = false;
                        $message = $this->l('Delivery place ');
                    
                        $message .= $session->__get('bal_name') . ' ' .  $session->__get("bal_address") . ', ' .  $session->__get("bal_psc") . ' ' .  $session->__get("bal_city") ;
                    
                        $message .= $this->l(' contains invalid data. Please select other one.');
                
                        $session->__set('sps_pp_error_msg', $message);
                        $session->write();
                    }
                }
            }
        }
    }
    
    
    public function hookDisplayBeforeCarrier($params) {
        
        // only if enabled SPS CARRIES
        $carrier_addr =  new Carrier( (int) Configuration::get('SPS_TO_ADDRESS_CARRIER_ID') );
        $carrier_pp =    new Carrier( (int) Configuration::get('SPS_TO_PICKUPPLACE_CARRIER_ID') );
        if ( $carrier_addr->active == false && $carrier_pp->active == false  ) {
            return;
        }
       
        $currency  = (new Currency ( $params['cart']->id_currency ))->iso_code;
        $address = new Address($params['cart']->id_address_delivery);
        $country_iso = (new Country( $address->id_country))->iso_code;
        
        
        $filter_sps_pickup_place = false ;
        $filter_sps_address = false ;
        
        // filter if cart is not in EUR
           
        if ( $currency !==  'EUR') {
            $filter_sps_pickup_place = true ;
            $filter_sps_address = true ;
        }
        
        //  filter if not supported country countries 
        if ( ! $filter_sps_pickup_place || !$filter_sps_address ) {
              
        
            if ( ! $filter_sps_pickup_place &&  $country_iso !== 'SK' && $country_iso !== 'CZ'){
                $filter_sps_pickup_place = true;
            }
               
            if (!$filter_sps_address &&  ! in_array($country_iso, ZipCityChecker::getCountriesAlphaCodes()) ){
                $filter_sps_address = true;
            }
        }
        
        // common smarty variables
        $session = &$this->context->cookie;
        if ($filter_sps_pickup_place) {
            $session->__set('filter_sps_pickup_place', "1");
        }else {
            $session->__set('filter_sps_pickup_place', "0");
        }
        
        if ($filter_sps_address) {
            $session->__set('filter_sps_address', "1");
        }else {
            $session->__set('filter_sps_address', "0" );
        }
        $session->write();
        
        $smarty_array = array(
                'sps_pickup_place_carrier_id' =>(int) (Configuration::get('SPS_TO_PICKUPPLACE_CARRIER_ID')),
                'sps_address_carrier_id' => (int) (Configuration::get('SPS_TO_ADDRESS_CARRIER_ID')),
                'filter_sps_pickup_place' =>  $session->__get('filter_sps_pickup_place'),
                'filter_sps_address' => $session->__get('filter_sps_address'),
                
        );
            
        if (!Module::isEnabled('onepagecheckoutps')) {
            
            $this->context->smarty->assign( $smarty_array );
        
            return $this->display(__FILE__, 'sps_prestashop_filter.tpl');
            
        }else {
            // one page checkout
            // reguired phone numbers ?? if none mpty mobile use mobile other use phone
            
            $cod_pay = Configuration::get( SlovakParcelServiceCommon::CONFIG_PREFIX . 'codpayments');
            if (!is_string($cod_pay) ){
                $cod_pay = '[]';
            }
            
            $pp_data = array();
            $session =   Context::getContext()->cookie;
            // check session
            if ( $session->__get('bal_name') !== false ) {
                $pp_data['id'] = $session->__get("bal_name");
                $pp_data['description'] = $session->__get("bal_info");
                $pp_data['virtualzip'] = $session->__get("bal_vpsc");
                $pp_data['zip'] = $session->__get("bal_psc");
                $pp_data['address'] = $session->__get("bal_address");
                $pp_data['city'] = $session->__get("bal_city");
                $pp_data['type'] = $session->__get("bal_type");
                $pp_data['cod'] = $session->__get("bal_cod");
                $pp_data['countryISO'] = $session->__get("bal_countryISO");
            }else {
                $pp_data['id'] = '';
                $pp_data['description'] = '';
                $pp_data['virtualzip'] = '';
                $pp_data['zip'] = '';
                $pp_data['address'] = '';
                $pp_data['city'] = '';
                $pp_data['type'] = '';
                $pp_data['cod'] = '';
                $pp_data['countryISO'] = '';
            }
            
            
            $smarty_array['pp'] = json_encode($pp_data);
            $smarty_array['errmsg_pp_codplace'] = $this->l('Selected payment is COD type, but selected balikovo does not support COD payment');
            $smarty_array['errmsg_cod'] =  $this->l("Total price exceeds limit for COD payment");
            $smarty_array['errmsg_noeurcountry'] = $this->l("Delivery country does not have EUR and sending COD in EUR is not enabled");
            
            $smarty_array['codpayments'] = $cod_pay;
            
            $smarty_array['sps_pickup_place_active'] = $carrier_pp->active;
            $smarty_array['sps_addr_active'] = $carrier_addr->active;
            
            
            
            // test we send eur to NoEURCOuntry
            $noeurcountry = 0;
            if ( ! ZipCityChecker::getCodForCountry($country_iso) || ( ZipCityChecker::getCurrencyForCountry($country_iso) !== 'EUR'  &&
                Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'eurtonoteurozone') === 'off')) {
                    $noeurcountry = 1;
            }
            
            $smarty_array['noeurcountry'] = $noeurcountry;
    
            $this->context->smarty->assign( $smarty_array );
            
            return $this->display(__FILE__, 'sps_prestashop_filter_onepagecheckoutps.tpl');
        }
    }
    

    // carrier module additional content
    public function hookDisplayCarrierExtraContent($params)
    {
        $session = &$this->context->cookie;
        
        if ($params['carrier']['id'] !== (int) (Configuration::get('SPS_TO_ADDRESS_CARRIER_ID'))  &&
            $params['carrier']['id'] !== (int) (Configuration::get('SPS_TO_PICKUPPLACE_CARRIER_ID'))  ) {
               
            $session->__unset('sps_addr_error_msg');
            $session->__unset('sps_pp_error_msg');
            $session->write();
            return; 
        }
        
        // do nothing if shipping methods are filtered
        if ( ( $params['carrier']['id'] === (int) Configuration::get('SPS_TO_ADDRESS_CARRIER_ID')  && $session->__get('filter_sps_address') === "1" ) ||
            ( $params['carrier']['id'] === (int) Configuration::get('SPS_TO_PICKUPPLACE_CARRIER_ID') &&  $session->__get('filter_sps_pickup_place') === "1" ) ) {
            return;
        }
        
        // check phone SK,CZ,HU 
        $addr = new Address($this->context->cart->id_address_delivery);
        $country = new Country( $addr->id_country);
            
        $phone_number = '';
        $error_msg = '';
        
        if (! empty($addr->phone_mobile)) {
                $phone_number = $addr->phone_mobile;
        } else {
            // no phone_mobile -> use phone
            if (! empty($addr->phone)) {
                $phone_number = $addr->phone;
            }
        }
            
        // save to session to hookActionValidateStepComplete disable continue
        if ($country->iso_code === 'SK' && ! SlovakParcelServiceCommon::MobileNumberTest($phone_number) ) {
            $error_msg = $this->l('Telephone number has to be in "004219xxxxxxxx" or "+4219xxxxxxxx" or "09xxxxxxxx" format');
            $session->__set('sps_phone_is_ok', 'false');
        } else if ($country->iso_code === 'CZ' && ! SlovakParcelServiceCommon::MobileNumberTestCZ($phone_number) ) {
            $error_msg =  $this->l('Telephone number has to be in "00420xxxxxxxxx" or "+420xxxxxxxxx" or "xxxxxxxxx" format');
            $session->__set('sps_phone_is_ok', 'false');
        } else if ($country->iso_code === 'HU' && ! SlovakParcelServiceCommon::MobileNumberTestHU($phone_number) ) {
            $error_msg =  $this->l('Telephone number has to be in "0036xxxxxxxxx" or "+36xxxxxxxxx" or "06xxxxxxxxx" format');
            $session->__set('sps_phone_is_ok', 'false');
        }else {
            $session->__set('sps_phone_is_ok', 'true');
        }
        $session->write();
        
        // delivery to address  
        if ( (int) $params['carrier']['id'] === (int) (Configuration::get('SPS_TO_ADDRESS_CARRIER_ID')) ) {
            
            // for auto reload after hookActionValidateStepComplete fail ( zip /city check  error message ) 
            if (  $session->__get('sps_addr_error_msg' ) !== false  ) {
                if (  $error_msg === '' ) {
                    $error_msg =   $session->__get('sps_addr_error_msg' );
                }else {
                    $error_msg .= '<br>' .  $session->__get('sps_addr_error_msg' );
                }
                $session->__unset('sps_addr_error_msg');
                $session->write();
            }
            
  	        $this->context->smarty->assign(array(
   		        'error_msg' => $error_msg,
  	            'display_error' => Module::isEnabled('onepagecheckoutps')  ? 'false' : 'true'
  	            
   		    ));
     	    return $this->display(__FILE__, 'sps_prestashop_addr.tpl');
        }
    	
    	// pickup place 
        //$requestedMachine = '';
        $requestedMachineInfo = '';

        if ( $session->__get('bal_name') !== false  &&  $session->__get('bal_name') !== "" ) {
            $requestedMachineInfo = $session->__get('bal_address') . ', ' . $session->__get('bal_psc') . ' ' . $session->__get('bal_city') . ', ' . $session->__get('bal_countryISO');
        }

        
        
        $addr1 = trim($addr->address1);
        $addr2 = trim($addr->address2);
        $postcode = trim($addr->postcode);
        $city = trim($addr->city);
        
        if ( $addr1 !== '' && $postcode !== ''  &&  $city !== '') {
            
            $centerAddress = $addr1 . ( $addr2 === '' ? '' : ' ' . $addr2) . ', ' . $postcode . ' ' . $city;
        }else {
            $centerAddress = '';
        }
        
         
        
        // for auto reload after hookActionValidateStepComplete fail ( zip /city check error message )
        if (  $session->__get('sps_pp_error_msg') !== false   ) {
            if ( $error_msg === '' ) {
                $error_msg = $session->__get('sps_pp_error_msg');
            }else {
                $error_msg .= '<br>' . $session->__get('sps_pp_error_msg');
            }
            $session->__unset('sps_pp_error_msg');
            $session->write();
        }

        $this->context->smarty->assign(array(
            'balikomat_carrier' => $params['carrier']['id'],
            'error_msg' => $error_msg,
            
            // set has_error to false for onepagecheckoutps
            'has_error' => ( $error_msg === ''  || Module::isEnabled('onepagecheckoutps')   ) ? 'false' : 'true',
            'customer_address' => $addr->address1 . ' ' . $addr->address2 . ', ' . $addr->city.  ', ' . $country->iso_code,
            'centerAddress' => $centerAddress,
           // 'requestedMachine' => $requestedMachine,
            'requestedMachineInfo' => $requestedMachineInfo,
            'pspt' => Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'deliveryOptions'),
            'country_iso' =>  $country->iso_code,
            'select_message_1' => $this->l('balíkovo Select'),
            'select_message_2' => 'balíkovo : ',
            'select_message_3' => $this->l('Please select balíkovo from map.'),
            'button_map_open' => $this->l('Open map'),
            'button_map_close' => $this->l('Close map'),
            
        ));
        return $this->display(__FILE__, 'sps_prestashop.tpl');
    }
    
    
    public function hookDisplayPaymentTop() {
        
        if ( (int) $this->context->cart->id_carrier !==  (int) (Configuration::get('SPS_TO_ADDRESS_CARRIER_ID')) && 
            (int)  $this->context->cart->id_carrier !==  (int) (Configuration::get('SPS_TO_PICKUPPLACE_CARRIER_ID')) ) {
                return;
        }
        
        $filter_cod = false;
           
        // test currency /// cant be sps carrier is filtered on  non eur cart
        $currency  = (new Currency ($this->context->cart->id_currency ))->iso_code;
        if ( $currency !==  'EUR') {
            $filter_cod = true;
        }
           
        $address = new Address($this->context->cart->id_address_delivery);
        $country_iso = (new Country( $address->id_country))->iso_code;
           
        // dest country has cod allowed
        if ( ! $filter_cod && ! ZipCityChecker::getCodForCountry($country_iso) ) {
                $filter_cod = true;
        }
           
        // test country has EUR or we send eur anyway
        if ( ! $filter_cod && ZipCityChecker::getCurrencyForCountry($country_iso) !== 'EUR'  &&
            Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'eurtonoteurozone') === 'off') {
               $filter_cod = true;
        }
           
        //cart value
        if ( ! $filter_cod ) {
            $total = $this->context->cart->getOrderTotal();
            
            if ( $country_iso === 'SK') {
                if ( $total > 5000 ) {
                    $filter_cod = true;
                } 
            } else {
                if ( $total > 3300 ) {
                    $filter_cod = true;
                }
            }
        }
        
        // pickup place dont supports cod
        if ( ! $filter_cod  && (int)  $this->context->cart->id_carrier ===  (int) Configuration::get('SPS_TO_PICKUPPLACE_CARRIER_ID') ){ 
         
            $session = &$this->context->cookie;
            
            if ( $session->__get("bal_cod") === false  || $session->__get("bal_cod") === "0"  ) {
                $filter_cod = true;
            }
        }
        
        if ( $filter_cod ) {
            
            $cod_paym =  Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'codpayments');
            if (!is_string($cod_paym) ){
                $cod_paym = '[]';
            }
               
            $html = '<script  type="text/javascript"> 
                 var SlovakParcelService = window.SlovakParcelService || {};
                   
                 SlovakParcelService.sps_cod_payments = ' . $cod_paym .';
                
                 window.addEventListener("load", function ()  { 
                    
                    var i = 1;
                    var elem = document.getElementById("payment-option-" + i.toString() + "-container");
                    while (  elem !== null ) {
                            inner = $("#payment-option-" + i.toString());
                            if ( SlovakParcelService.sps_cod_payments.includes(  inner.attr("data-module-name") ) ) {
                                elem.setAttribute("style", "display:none;");
                            }
                       i++;
                       elem = document.getElementById("payment-option-" + i.toString() + "-container");
                    }
                });
                </script>';
            return $html;
         }
     }
    

    // validation after order creation
    public function hookActionValidateOrder($params)
    {
        
       if (  (int) $this->context->cart->id_carrier !== (int) Configuration::get('SPS_TO_PICKUPPLACE_CARRIER_ID') && 
           (int) $this->context->cart->id_carrier !== (int) Configuration::get('SPS_TO_ADDRESS_CARRIER_ID')  ) {
               
            return;
        }
        
        $session = &$this->context->cookie;
        
        
        // check if  cod payments  and save to DB 
        $order = Order::getByCartId($this->context->cart->id);  // $params['order'], $params['cart']
        
        // empty array  stored as 'false'
        $cod_payments = Configuration::get(SlovakParcelServiceCommon::CONFIG_PREFIX . 'codpayments');
        if ( is_string($cod_payments) ) {
            $cod_payments = json_decode($cod_payments);
        }else {
            $cod_payments = [];
        }
        
        $is_cod = 0; 
        if ( in_array($order->module, $cod_payments)) {
             $is_cod = 1;
        }
        
        // SPS Parcelshop
        if ( (int) $this->context->cart->id_carrier == (int) (Configuration::get('SPS_TO_PICKUPPLACE_CARRIER_ID'))) {
           
            // check deli addr is same or not as invoice addr, 2. customer is guest or not 
            $cart = $params['cart'];
            $order = $params['order'];
            $customer = $params['customer'];
            
            if ($customer->isGuest()) {
                if ( $order->id_address_delivery === $order->id_address_invoice) {
                    // add new addr to customer 
                    //create new address  
                    $old_address = new Address($order->id_address_delivery);
                    $new_address = new Address();
                    
                    $new_address->id_customer = $old_address->id_customer;
                    $new_address->id_manufacturer = $old_address->id_manufacturer;
                    $new_address->id_supplier = $old_address->id_supplier;
                    $new_address->id_warehouse = $old_address->id_warehouse;
                    $new_address->phone = $old_address->phone;
                    $new_address->phone_mobile = $old_address->phone_mobile;
                    $new_address->vat_number = $old_address->vat_number;
                    $new_address->dni = $old_address->dni;
                    $new_address->alias = $old_address->alias;
                    $new_address->other = $old_address->other;
                    
                    $new_address->id_state = 0;
                    // ret country_id 
                    $new_address->id_country = Country::getByIso($session->__get("bal_countryISO"));
                    $new_address->country = Country::getNameById($order->id_lang, $new_address->id_country);
                    
                    $new_address->firstname = $old_address->firstname;
                    $new_address->lastname = $old_address->lastname;
                    $new_address->company = $session->__get("bal_name");
                    $new_address->address1 = $session->__get("bal_address");
                    //$new_address->address2 =
                    $new_address->postcode = $session->__get("bal_psc");
                    $new_address->city = $session->__get("bal_city");
                    $new_address->add();
                    
                    // fix delivery option
                    $cart->delivery_option = json_encode(array(strval($new_address->id) => strval($this->context->cart->id_carrier) .","  ));
                    
                    // update delivery address ID  // check if function exists  , PS  < 1.7.7.0 
                    if (method_exists($cart,"updateDeliveryAddressId") ) {
                        $cart->updateDeliveryAddressId((int) $cart->id_address_delivery, (int) $new_address->id);
                    }else {
                        $this->updateDeliveryAddressId($cart,(int) $cart->id_address_delivery, (int) $new_address->id);
                    }
                    
                    $order->id_address_delivery = $new_address->id;
                    $order->update();
                } else {
                    // diff addr for deli and invoice - do update  
                    $new_address = new Address($order->id_address_delivery);
                    $new_address->id_state = 0;
                    $new_address->id_country = Country::getByIso($session->__get("bal_countryISO"));
                    $new_address->country = Country::getNameById($order->id_lang, $new_address->id_country);
                    $new_address->company = $session->__get("bal_name");
                    $new_address->address1 = $session->__get("bal_address");
                    $new_address->address2 = null;
                    $new_address->postcode = $session->__get("bal_psc");
                    $new_address->city = $session->__get("bal_city");
                    $new_address->update();
                }
            } else {
                //nonguest -> always  new address - cannot update existing  -> overwrites customer address 
                // always create new addr as deleted 
                $old_address = new Address($order->id_address_delivery);
                $new_address = new Address();
                
                $new_address->id_customer = $old_address->id_customer;
                $new_address->id_manufacturer = $old_address->id_manufacturer;
                $new_address->id_supplier = $old_address->id_supplier;
                $new_address->id_warehouse = $old_address->id_warehouse;
                $new_address->phone = $old_address->phone;
                $new_address->phone_mobile = $old_address->phone_mobile;
                $new_address->vat_number = $old_address->vat_number;
                $new_address->dni = $old_address->dni;
                $new_address->alias = $old_address->alias;
                $new_address->other = $old_address->other;
                $new_address->deleted = 1;
                
                $new_address->id_state = 0;
                // ret country_id
                $new_address->id_country = Country::getByIso($session->__get("bal_countryISO"));
                $new_address->country = Country::getNameById($order->id_lang, $new_address->id_country);
                
                $new_address->firstname = $old_address->firstname;
                $new_address->lastname = $old_address->lastname;
                $new_address->company = $session->__get("bal_name");
                $new_address->address1 = $session->__get("bal_address");
                //$new_address->address2 =
                $new_address->postcode = $session->__get("bal_psc");
                $new_address->city = $session->__get("bal_city");
                $new_address->add();
                // fix delivery option
                $cart->delivery_option = json_encode(array(strval($new_address->id) => strval($this->context->cart->id_carrier) .","  ));
                
                // update delivery address ID  // check if function exists  , PS  < 1.7.7.0
                if (method_exists($cart,"updateDeliveryAddressId") ) {
                    $cart->updateDeliveryAddressId((int) $cart->id_address_delivery, (int) $new_address->id);
                }else {
                    $this->updateDeliveryAddressId($cart,(int) $cart->id_address_delivery, (int) $new_address->id);
                }
                
                $order->id_address_delivery = $new_address->id;
                $order->update();
            }

            $type = 1;  // PS 
            if ($session->__get('bal_type') === "PT") {
                $type = 2;  // PT
            }
            
            
            $sql = 'INSERT INTO `' . $this->TABLE_NAME . '`( `order_id`,  `type`,  `bal_name`, `bal_vpsc`, `bal_psc` , `bal_address`, `bal_city`, `bal_cod` , `is_cod` ,`bal_countryISO` )

			VALUES ( ' . (int) $order->id .' , ' . (int) $type . ' ,"' . pSQL($session->__get("bal_name")) . '","' .  pSQL($session->__get("bal_vpsc")) . '","' . pSQL($session->__get("bal_psc")) . '","' .  pSQL($session->__get("bal_address")) . '","' . pSQL($session->__get("bal_city")) . '","' . pSQL( $session->__get("bal_cod")) . '",  ' .  (int) $is_cod .' , "' . pSQL($session->__get("bal_countryISO")) . '" )';

            Db::getInstance()->execute($sql);

            // SPS
        } else if ( (int) $this->context->cart->id_carrier == (int) (Configuration::get('SPS_TO_ADDRESS_CARRIER_ID'))) {

            $orderid = Order::getOrderByCartId($this->context->cart->id);
            $sql = 'INSERT INTO `' . $this->TABLE_NAME . '`( `order_id`,  `type`, `is_cod` )
			VALUES (' . (int) $order->id . ', ' . (int) 0 . ',  ' .  (int) $is_cod . ' )';

            Db::getInstance()->execute($sql);
        }

        // dont unset $_SESSION["bal_name"]) here. hookDisplayOrderConfirmation
        // requires it.
    }

    /*
     * * Front Methods
     * *
     * * If you set need_range at true when you created your carrier (in install
     * method), the method called by the cart will be getOrderShippingCost
     * * If not, the method called will be getOrderShippingCostExternal
     * *
     * * $params var contains the cart, the customer, the address
     * * $shipping_cost var contains the price calculated by the range in
     * carrier tab
     * *
     */
    public function getOrderShippingCost($params, $shipping_cost)
    {
        // This example returns shipping cost with overcost set in the
        // back-office, but you can call a webservice or calculate what you want
        // before returning the final value to the Cart
        return $shipping_cost;
        // If the carrier is not known, you can return false, the carrier won't
        // appear in the order process
        // return false;
    }

    public function getOrderShippingCostExternal($params)
    {
        // This example returns the overcost directly, but you can call a
        // webservice or calculate what you want before returning the final
        // value to the Cart
        return 0.0;

        // If the carrier is not known, you can return false, the carrier won't
        // appear in the order process
        // return false;
    }
    
    
    public function hookSendMailAlterTemplateVars($params) {
        
        // sending order confirmation 
        if ( $params['template'] === 'order_conf' ) {
            
            $order_id =  $params['template_vars']['{id_order}'] ;
            
            $order = new Order($order_id);
            //$carrier = new Carrier( $order->id_carrier);
            
            // pickup place order 
            if ( (int) $order->id_carrier == (int) Configuration::get('SPS_TO_PICKUPPLACE_CARRIER_ID') ){
                
                //get info from DB
                $values = Db::getInstance()->getRow( 'SELECT * FROM `' . $this->TABLE_NAME . '` WHERE  `order_id` = ' . pSQL($order_id));
                if ( ! $values) {
                    return;
                }
                $params['template_vars']['{carrier}'] .=  "\n(" . $this->l("The Order will be delivered to balíkovo : ") . $values["bal_address"] . ", " . $values["bal_psc"] . " " . $values["bal_city"] . ", " . $values["bal_countryISO"]  .")" ;
            }
        }
    }
    
    
    private function updateDeliveryAddressId($cart, int $currentAddressId, int $newAddressId) {
        if (!isset($cart->id_address_delivery) || (int) $cart->id_address_delivery === $currentAddressId) {
            $cart->id_address_delivery = $newAddressId;
            $cart->update();
        }
        
        $sql = 'UPDATE `' . _DB_PREFIX_ . 'cart_product` SET `id_address_delivery` = ' . $newAddressId . ' WHERE  `id_cart` = ' . (int) $cart->id . ' AND `id_address_delivery` = ' . $currentAddressId;
        Db::getInstance()->execute($sql);
        
        $sql = 'UPDATE `' . _DB_PREFIX_ . 'customization` SET `id_address_delivery` = ' . $newAddressId . ' WHERE  `id_cart` = ' . (int) $cart->id . ' AND `id_address_delivery` = ' . $currentAddressId;
        Db::getInstance()->execute($sql);
    }
    
    private function parseCookie($cookie) {
        
        $val = $this->context->cookie->__get($cookie);
        if (  $val === false) {
            return "";
        }
        return  $val;
    }
    
    
    
    
}	// end of class