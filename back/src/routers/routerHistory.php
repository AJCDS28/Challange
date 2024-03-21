<?php
include_once '../DbConnector.php';
include_once '../actions/History.php';

header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header("Access-Control-Allow-Origin: *");

$action = $_POST['action'] ?? $_GET['action'] ?? '';

$dbConnector = new DbConnector();
$myPDO = $dbConnector->connect();

$orders = new History($myPDO);

switch ($action) {
    case '':
        $arrayCar = $orders->readOrdersHistory();
        echo json_encode($arrayCar);
        break;
    case 'readItens':
        $code = $_POST['code'];
        $result = $orders->readHistoryItens($code);
        echo json_encode($result);
        break;
    /*case 'updateProductCar':
        $name = $_POST['Products'];
        $amount = $_POST['amountProduct'];
        $productsCar->updateProductCar($name, $amount);
        break;
    case 'deleteProductCar':
        $code = $_POST['code'];
        $productsCar->deleteProductCar($code);
        echo json_encode($code);
        break; 
    case 'finishBuy':
        $result = $productsCar->getAllProducts();
        $productsCar->finishBuy($result);
        echo json_encode($productsCar);
        break; */  
    default:
        echo json_encode(['error' => 'Ação desconhecida']);
        break;
}
?>