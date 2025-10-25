<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$data = json_decode(file_get_contents('php://input'), true);
$file = 'leaderboard.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Получить лидерборд
    if (file_exists($file)) {
        $leaderboard = json_decode(file_get_contents($file), true);
        echo json_encode(['leaderboard' => $leaderboard]);
    } else {
        echo json_encode(['leaderboard' => []]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Сохранить результат
    $leaderboard = [];
    if (file_exists($file)) {
        $leaderboard = json_decode(file_get_contents($file), true);
    }
    
    // Валидация данных
    if (!isset($data['name']) || !isset($data['score']) || !isset($data['date'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }
    
    // Санитизация имени
    $data['name'] = htmlspecialchars(trim($data['name']), ENT_QUOTES, 'UTF-8');
    $data['score'] = intval($data['score']);
    
    if (empty($data['name']) || $data['score'] < 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data']);
        exit;
    }
    
    // Поиск существующей записи с тем же именем (регистронезависимо)
    $existingIndex = -1;
    for ($i = 0; $i < count($leaderboard); $i++) {
        if (strtolower($leaderboard[$i]['name']) === strtolower($data['name'])) {
            $existingIndex = $i;
            break;
        }
    }
    
    if ($existingIndex !== -1) {
        // Обновляем существующую запись, если новый результат лучше
        if ($data['score'] > $leaderboard[$existingIndex]['score']) {
            $leaderboard[$existingIndex] = $data;
            error_log("Updated score for {$data['name']}: {$data['score']}");
        } else {
            error_log("Score for {$data['name']} not improved, keeping existing: {$leaderboard[$existingIndex]['score']}");
            echo json_encode(['success' => true, 'leaderboard' => $leaderboard, 'message' => 'Score not improved']);
            exit;
        }
    } else {
        // Добавляем новую запись
        $leaderboard[] = $data;
        error_log("Added new score for {$data['name']}: {$data['score']}");
    }
    
    // Сортировка по очкам (убывание)
    usort($leaderboard, function($a, $b) {
        return $b['score'] - $a['score'];
    });
    
    // Оставляем только топ-10
    $leaderboard = array_slice($leaderboard, 0, 10);
    
    // Сохранение
    if (file_put_contents($file, json_encode($leaderboard, JSON_PRETTY_PRINT))) {
        echo json_encode(['success' => true, 'leaderboard' => $leaderboard]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save score']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
