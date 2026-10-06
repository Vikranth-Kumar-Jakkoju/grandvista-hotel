<?php
/**
 * GrandVista Hotel - Event Enquiries API Endpoint
 * POST /backend/api/event-enquiry.php
 * Accepts event venue inquiries, validates server-side, and inserts into event_enquiries table.
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
        'message' => 'Method Not Allowed. Only POST requests are accepted.'
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

$name      = trim($data['name'] ?? '');
$company   = trim($data['company'] ?? '');
$email     = trim($data['email'] ?? '');
$phone     = trim($data['phone'] ?? '');
$eventType = trim($data['event_type'] ?? '');
$eventDate = trim($data['event_date'] ?? '');
$guests    = $data['guests'] ?? null;
$venue     = trim($data['venue'] ?? '');
$budget    = $data['budget'] ?? null;
$message   = trim($data['message'] ?? '');

$errors = [];

// Name validation
if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Full name is required (minimum 2 characters).';
} elseif (strlen($name) > 150) {
    $name = substr($name, 0, 150);
}

// Company validation (optional)
if (!empty($company) && strlen($company) > 150) {
    $company = substr($company, 0, 150);
} else if (empty($company)) {
    $company = null;
}

// Email validation
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email address is required.';
}

// Phone validation
if (empty($phone) || strlen($phone) < 6) {
    $errors[] = 'Phone number is required.';
} elseif (strlen($phone) > 30) {
    $phone = substr($phone, 0, 30);
}

// Event Type validation
if (empty($eventType)) {
    $errors[] = 'Event type is required.';
} elseif (strlen($eventType) > 100) {
    $eventType = substr($eventType, 0, 100);
}

// Event Date validation (must not be in the past)
$today = date('Y-m-d');
if (empty($eventDate)) {
    $errors[] = 'Event date is required.';
} elseif (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $eventDate) || strtotime($eventDate) === false) {
    $errors[] = 'Event date must be a valid date in YYYY-MM-DD format.';
} elseif ($eventDate < $today) {
    $errors[] = 'Event date cannot be in the past.';
}

// Guests validation (> 0)
if ($guests === null || !is_numeric($guests) || (int)$guests <= 0) {
    $errors[] = 'Number of guests must be a positive integer greater than 0.';
} else {
    $guests = (int)$guests;
}

// Venue validation (must exist in events table)
$venueName = null;
if (empty($venue)) {
    $errors[] = 'Venue selection is required.';
} else {
    $stmtVenue = $pdo->prepare("SELECT name FROM events WHERE name = ? OR slug = ? LIMIT 1");
    $stmtVenue->execute([$venue, $venue]);
    $venueRow = $stmtVenue->fetch();
    if (!$venueRow) {
        $errors[] = 'The selected venue does not exist.';
    } else {
        $venueName = $venueRow['name'];
    }
}

// Budget validation (optional numeric)
if ($budget !== null && $budget !== '') {
    if (!is_numeric($budget) || (float)$budget < 0) {
        $errors[] = 'Budget must be a non-negative number if provided.';
    } else {
        $budget = (float)$budget;
    }
} else {
    $budget = null;
}

// Message
if (empty($message)) {
    $message = "Inquiry for {$eventType} at {$venueName}";
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
    $stmt = $pdo->prepare("
        INSERT INTO event_enquiries (name, company, email, phone, event_type, event_date, guests, venue, budget, message, status)
        VALUES (:name, :company, :email, :phone, :event_type, :event_date, :guests, :venue, :budget, :message, 'new')
    ");

    $stmt->execute([
        ':name'       => $name,
        ':company'    => $company,
        ':email'      => $email,
        ':phone'      => $phone,
        ':event_type' => $eventType,
        ':event_date' => $eventDate,
        ':guests'     => $guests,
        ':venue'      => $venueName,
        ':budget'     => $budget,
        ':message'    => $message
    ]);

    $enquiryId = (int)$pdo->lastInsertId();

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your event inquiry has been received. Our senior events concierge will contact you within 4 hours.',
        'data'    => [
            'enquiry_id' => $enquiryId,
            'venue'      => $venueName,
            'event_date' => $eventDate,
            'status'     => 'new'
        ]
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error processing event enquiry.'
    ]);
}
