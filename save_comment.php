<?php

// FaunaDB 클라이언트 로드
require 'vendor/autoload.php';
use FaunaDB\Client;
use FaunaDB\Expr\{Expr, Fauna};

$client = new Client(['secret' => 'YOUR_FAUNADB_SECRET_KEY']);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method Not Allowed']);
    exit();
}

// JSON으로 전송된 데이터 읽기
$data = json_decode(file_get_contents('php://input'), true);
$name = $data['name'] ?? null;
$comment = $data['comment'] ?? null;

if (!$name || !$comment) {
    http_response_code(400);
    echo json_encode(['message' => 'Name and comment are required']);
    exit();
}

try {
    $result = $client->query(
        Fauna::create(
            Fauna::collection('comments'),
            ['data' => ['name' => $name, 'comment' => $comment]]
        )
    );

    echo json_encode(['message' => 'Comment saved successfully', 'data' => $result]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to save comment', 'error' => $e->getMessage()]);
}

?>
