<?php
/**
 * GrandVista Hotel - Contact / Enquiries API Endpoint
 * POST /backend/api/contact.php
 * Accepts contact inquiries, validates server-side, and inserts into enquiries table.
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

$name    = trim($data['name'] ?? '');
$email   = trim($data['email'] ?? '');
$phone   = trim($data['phone'] ?? '');
$subject = trim($data['subject'] ?? '');
$message = trim($data['message'] ?? '');

$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Full name is required (minimum 2 characters).';
} elseif (strlen($name) > 150) {
    $name = substr($name, 0, 150);
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email address is required.';
}

if (empty($subject)) {
    $errors[] = 'An inquiry subject is required.';
} elseif (strlen($subject) > 150) {
    $subject = substr($subject, 0, 150);
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Message is required and must be at least 10 characters.';
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
        INSERT INTO enquiries (name, email, phone, subject, message, status)
        VALUES (:name, :email, :phone, :subject, :message, 'new')
    ");

    $stmt->execute([
        ':name'    => $name,
        ':email'   => $email,
        ':phone'   => !empty($phone) ? substr($phone, 0, 30) : null,
        ':subject' => $subject,
        ':message' => $message
    ]);

    $enquiryId = (int)$pdo->lastInsertId();

    http_response_code(201);
    echo json_encode([
        'success'    => true,
        'message'    => 'Thank you! Your enquiry has been received.',
        'data'       => [
            'enquiry_id' => $enquiryId
        ],
        'enquiry_id' => $enquiryId
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error processing enquiry.'
    ]);
}
