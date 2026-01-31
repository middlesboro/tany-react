<?php

declare(strict_types = 1);
require_once('..' . DIRECTORY_SEPARATOR . '..'  . DIRECTORY_SEPARATOR . 'config/config.inc.php');
require_once('..' . DIRECTORY_SEPARATOR . '..'  . DIRECTORY_SEPARATOR . 'init.php');


$session =   Context::getContext()->cookie;

if ($_POST['bal_name'] !== ""){

    $session->__set("bal_name", $_POST['bal_name']);
    $session->__set("bal_info", $_POST['bal_info']);
    $session->__set("bal_vpsc", $_POST['bal_vpsc']);
    $session->__set("bal_psc", $_POST['bal_psc']);
    $session->__set("bal_address", $_POST['bal_address']);
    $session->__set("bal_city", $_POST['bal_city']);
    $session->__set("bal_type", $_POST['bal_type']);
    $session->__set("bal_cod",  $_POST['bal_cod']);
    $session->__set("bal_countryISO", $_POST['bal_countryISO']);

}else {
    $session->__unset("bal_name");
}

$session->write();
