<?php
/**
 * GrandVista Hotel - Table Reservation API Endpoint
 * POST /backend/api/table-reservation.php
 * Accepts table reservations, validates server-side (including rejecting past dates),
 * and inserts into table_reservations table.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error'   => 'Method Not Allowed. Only POST requests are accepted.'
    ]);
    exit;
}

require_once dirname(__DIR__) . '/config.php';

// Decode JSON input or fallback to $_POST
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);
if (!is_array($data) || empty($data)) {
    $data = $_POST;
}

$venueSlug   = trim($data['venue'] ?? $data['restaurant_slug'] ?? $data['restaurant'] ?? '');
$venueId     = $data['restaurant_id'] ?? null;
$guestName   = trim($data['name'] ?? $data['guest_name'] ?? '');
$email       = trim($data['email'] ?? '');
$phone       = trim($data['phone'] ?? '');
$resDate     = trim($data['date'] ?? $data['reservation_date'] ?? '');
$resTime     = trim($data['time'] ?? $data['reservation_time'] ?? '');
$partySize   = isset($data['guests']) ? (int)$data['guests'] : (isset($data['party_size']) ? (int)$data['party_size'] : 2);
$seatingPref = trim($data['seating'] ?? $data['seating_preference'] ?? 'Indoor Main Dining Room');
$specialReq  = trim($data['requests'] ?? $data['special_requests'] ?? '');

$errors = [];

// 1. Validate Guest Name
if (empty($guestName) || strlen($guestName) < 2) {
    $errors[] = 'Full name is required (minimum 2 characters).';
} elseif (strlen($guestName) > 150) {
    $guestName = substr($guestName, 0, 150);
}

// 2. Validate Email
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email address is required.';
}

// 3. Validate Phone
$phoneDigits = preg_replace('/[^0-9]/', '', $phone);
if (empty($phone) || strlen($phoneDigits) < 7) {
    $errors[] = 'A valid telephone number is required.';
}

// 4. Validate Reservation Date (Strict check: cannot be in the past)
$todayStr = date('Y-m-d');
$dCheck = DateTime::createFromFormat('Y-m-d', $resDate);
if (!$dCheck || $dCheck->format('Y-m-d') !== $resDate) {
    $errors[] = 'Reservation date is invalid. Expected YYYY-MM-DD format.';
} elseif ($resDate < $todayStr) {
    $errors[] = 'Reservation date cannot be in the past. Please select today or a future date.';
}

// 5. Validate Time Slot
if (empty($resTime)) {
    $errors[] = 'Preferred seating time is required.';
} else {
    $timeParsed = strtotime($resTime);
    if ($timeParsed === false) {
        $errors[] = 'Invalid time format.';
        $timeFormatted = '19:00:00';
    } else {
        $timeFormatted = date('H:i:s', $timeParsed);
    }
}

// 6. Validate Party Size
if ($partySize < 1) {
    $partySize = 2;
} elseif ($partySize > 50) {
    $partySize = 50;
}

// 7. Resolve Restaurant ID
$restaurantId = null;
if (!empty($venueId) && is_numeric($venueId)) {
    $stmtRest = $pdo->prepare("SELECT id FROM restaurants WHERE id = :id LIMIT 1");
    $stmtRest->execute([':id' => (int)$venueId]);
    $row = $stmtRest->fetch();
    if ($row) $restaurantId = (int)$row['id'];
}

if (!$restaurantId && !empty($venueSlug)) {
    $stmtRest = $pdo->prepare("SELECT id FROM restaurants WHERE slug = :slug LIMIT 1");
    $stmtRest->execute([':slug' => $venueSlug]);
    $row = $stmtRest->fetch();
    if ($row) $restaurantId = (int)$row['id'];
}

if (!$restaurantId) {
    // Default to first restaurant (GrandVista Restaurant)
    $stmtRest = $pdo->query("SELECT id FROM restaurants ORDER BY id ASC LIMIT 1");
    $row = $stmtRest->fetch();
    $restaurantId = $row ? (int)$row['id'] : 1;
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'errors'  => $errors,
        'message' => implode(' ', $errors)
    ]);
    exit;
}

try {
    $combinedRequest = !empty($seatingPref)
        ? ('Seating: ' . $seatingPref . (!empty($specialReq) ? ' | ' . $specialReq : ''))
        : (!empty($specialReq) ? $specialReq : null);

    $stmt = $pdo->prepare("
        INSERT INTO table_reservations (
            restaurant_id, guest_name, email, phone,
            reservation_date, reservation_time, party_size,
            special_request, status
        ) VALUES (
            :restaurant_id, :guest_name, :email, :phone,
            :res_date, :res_time, :party_size,
            :special_request, 'confirmed'
        )
    ");

    $stmt->execute([
        ':restaurant_id'     => $restaurantId,
        ':guest_name'        => $guestName,
        ':email'             => $email,
        ':phone'             => $phone,
        ':res_date'          => $resDate,
        ':res_time'          => substr($resTime, 0, 20),
        ':party_size'        => $partySize,
        ':special_request'   => $combinedRequest
    ]);

    $reservationId = (int)$pdo->lastInsertId();
    $refNumber = 'GVR-' . sprintf('%05d', random_int(10000, 99999));

    http_response_code(201);
    echo json_encode([
        'success'        => true,
        'message'        => 'Table reserved successfully.',
        'data'           => [
            'reservation_id' => $reservationId,
            'reference'      => $refNumber
        ],
        'reservation_id' => $reservationId,
        'reference'      => $refNumber
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error processing table reservation.'
    ]);
}
