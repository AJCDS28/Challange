<?php
include_once '../DbConnector.php';
include_once '../actions/Categories.php';

header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header("Access-Control-Allow-Origin: *");

$action = $_POST['action'] ?? $_GET['action'] ?? '';

$dbConnector = new DbConnector();
$myPDO = $dbConnector->connect();

$categories = new Categories($myPDO);

switch ($action) {
    case 'form':
        $name = $_POST['categoryName'];
        $tax = $_POST['taxCategory'];
        $categories->addCategory($name, $tax);
        break;
    case '':
        $result = $categories->getAllCategories();
        echo json_encode($result);
        break;
    case 'deleteCategory':
        $code = $_POST['code'];
        $resul =  $categories->deleteCategory($code);
        echo json_encode($resul);
        /*if($resul[1]==7){
            return echo "Não foi possivel excluir a categoria, há produtos cadastrados com ela";
        }*/
        break;
    default:
        echo json_encode(['error' => 'Ação desconhecida']);
        break;
}
