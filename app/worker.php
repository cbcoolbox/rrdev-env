<?php

use Spiral\RoadRunner;
use Nyholm\Psr7;
use GraphQL\Language\Parser;
use GraphQL\Language\Source;

include "vendor/autoload.php";
include "graph.php";


$worker = RoadRunner\Worker::create();
$psrFactory = new Psr7\Factory\Psr17Factory();

$worker = new RoadRunner\Http\PSR7Worker($worker, $psrFactory, $psrFactory, $psrFactory);

$test= "";
try {
    $dbh = new PDO('mysql:host=rr-db:3306;dbname=test_db', "root", "rootpassword", [PDO::ATTR_PERSISTENT => true]);
} catch (PDOException $e) {
    $test = $e->getMessage();
}

while ($req = $worker->waitRequest()) {
    try {
        $printRow = "";
        $rsp = new Psr7\Response();
        // foreach($dbh->query('SELECT * from products') as $row) {
        //     $printRow = $printRow . $row["name"];
        // }
        

        // $req->getMethod() / $req->getRequestTarget() 
        if ($req->getMethod() == "POST" && $req->getRequestTarget() == "/api") {
            $reqBody = json_decode((string)$req->getBody(), true);
            $documentNode = Parser::parse(new Source($reqBody['query'], 'GraphQL'));
            //throw new \Exception("promise to execute2: ". $documentNode);
            $rsp->getBody()->write((string)$documentNode);
        } else {
            $rsp->getBody()->write(file_get_contents("/app/front/index.html"));
        }

        $worker->respond($rsp);
    } catch (\Throwable $e) {
        $errRsp = new Psr7\Response();
        $errRsp->getBody()->write($e->getMessage());
        $worker->respond($errRsp->withStatus(500));
        // $worker->getWorker()->error((string)$e->getMessage());
    }
}

?>