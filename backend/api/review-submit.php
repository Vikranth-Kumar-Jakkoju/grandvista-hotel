<?php
/**
 * GrandVista Hotel - Review Submission API Endpoint
 * POST /backend/api/review-submit.php
 * Accepts guest review submissions, validates server-side, and inserts into reviews table with status 'pending'.
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

$guestName = trim($data['guest_name'] ?? ($data['name'] ?? ''));
$email     = trim($data['email'] ?? '');
$bookingRef = trim($data['booking_reference'] ?? ($data['booking_ref'] ?? ''));
$stayType  = trim($data['stay_type'] ?? 'General Stay');
$rating    = $data['rating'] ?? null;
$review    = trim($data['review'] ?? ($data['comments'] ?? ''));
$stayDate  = trim($data['stay_date'] ?? '');

$errors = [];

// Name validation
if (empty($guestName) || strlen($guestName) < 2) {
    $errors[] = 'Full name is required (minimum 2 characters).';
} elseif (strlen($guestName) > 150) {
    $guestName = substr($guestName, 0, 150);
}

// Email validation
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email address is required.';
}

// Rating validation (1-5 integer)
if ($rating === null || !is_numeric($rating)) {
    $errors[] = 'Rating is required and must be an integer between 1 and 5.';
} else {
    $ratingInt = (int)$rating;
    if ((string)$ratingInt !== (string)$rating || $ratingInt < 1 || $ratingInt > 5) {
        $errors[] = 'Rating must be an integer between 1 and 5.';
    } else {
        $rating = $ratingInt;
    }
}

// Review text validation (10+ characters)
if (empty($review) || strlen($review) < 10) {
    $errors[] = 'Review text is required and must be at least 10 characters.';
}

// Stay date validation (cannot be in the future)
$today = date('Y-m-d');
if (empty($stayDate)) {
    // If not provided, default to today
    $stayDate = $today;
} elseif (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $stayDate) || !checkdate((int)substr($stayDate, 5, 2), (int)substr($stayDate, 8, 2), (int)substr($stayDate, 0, 4))) {
    $errors[] = 'Stay date must be a valid date in YYYY-MM-DD format.';
} elseif ($stayDate > $today) {
    $errors[] = 'Stay date cannot be in the future.';
}

// Booking reference validation (optional, but must exist in bookings if given)
$validBookingRef = null;
if (!empty($bookingRef)) {
    $stmtBook = $pdo->prepare("SELECT id FROM bookings WHERE booking_reference = ? LIMIT 1");
    $stmtBook->execute([$bookingRef]);
    $bookingRow = $stmtBook->fetch();
    if (!$bookingRow) {
        $errors[] = 'The provided booking reference does not exist in our reservation records.';
    } else {
        $validBookingRef = $bookingRef;
    }
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
    // ALWAYS save with status 'pending' (ignore any client-sent status)
    $stmt = $pdo->prepare("
        INSERT INTO reviews (booking_reference, guest_name, email, stay_type, rating, review, stay_date, status)
        VALUES (:booking_reference, :guest_name, :email, :stay_type, :rating, :review, :stay_date, 'pending')
    ");

    $stmt->execute([
        ':booking_reference' => $validBookingRef,
        ':guest_name'        => $guestName,
        ':email'             => $email,
        ':stay_type'         => !empty($stayType) ? substr($stayType, 0, 100) : 'General Stay',
        ':rating'            => $rating,
        ':review'            => $review,
        ':stay_date'         => $stayDate
    ]);

    $reviewId = (int)$pdo->lastInsertId();

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for sharing your experience! Your review has been submitted for moderation and will appear after verification.',
        'data'    => [
            'review_id' => $reviewId,
            'status'    => 'pending'
        ]
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error processing review submission.'
    ]);
}
