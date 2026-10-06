<?php
/**
 * GrandVista Hotel - Booking Submission API Endpoint
 * POST /backend/api/booking.php
 * Accepts booking details, performs server-side validation, inserts into database,
 * and returns the generated booking reference.
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

// Decode input JSON or fall back to $_POST
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);
if (!is_array($data) || empty($data)) {
    $data = $_POST;
}

// 1. Sanitize & extract inputs
$roomIdInput      = $data['room_id'] ?? $data['roomId'] ?? null;
$roomSlug         = trim($data['room_slug'] ?? $data['slug'] ?? '');
$guestName        = trim($data['guest_name'] ?? $data['fullName'] ?? $data['name'] ?? '');
$email            = trim($data['email'] ?? '');
$phone            = trim($data['phone'] ?? '');
$country          = trim($data['country'] ?? 'India');
$checkIn          = trim($data['check_in'] ?? $data['checkin'] ?? '');
$checkOut         = trim($data['check_out'] ?? $data['checkout'] ?? '');
$adults           = isset($data['adults']) ? (int)$data['adults'] : 0;
$children         = isset($data['children']) ? (int)$data['children'] : 0;
$roomsCount       = isset($data['rooms_count']) ? (int)$data['rooms_count'] : (isset($data['roomsCount']) ? (int)$data['roomsCount'] : 1);
$nights           = isset($data['nights']) ? (int)$data['nights'] : 0;
$roomSubtotal     = isset($data['room_subtotal']) ? (float)$data['room_subtotal'] : (isset($data['roomTotal']) ? (float)$data['roomTotal'] : 0.0);
$servicesSubtotal = isset($data['services_subtotal']) ? (float)$data['services_subtotal'] : (isset($data['servicesTotal']) ? (float)$data['servicesTotal'] : 0.0);
$taxes            = isset($data['taxes']) ? (float)$data['taxes'] : 0.0;
$totalAmount      = isset($data['total_amount']) ? (float)$data['total_amount'] : (isset($data['grandTotal']) ? (float)$data['grandTotal'] : 0.0);
$services         = $data['services'] ?? [];

// 2. Server-side Validation
$errors = [];

// Validate Guest Name
if (empty($guestName) || strlen($guestName) < 2) {
    $errors[] = 'Full name is required (minimum 2 characters).';
} elseif (strlen($guestName) > 150) {
    $guestName = substr($guestName, 0, 150);
}

// Validate Email
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email address is required.';
}

// Validate Phone
$phoneDigits = preg_replace('/[^0-9]/', '', $phone);
if (empty($phone) || strlen($phoneDigits) < 7) {
    $errors[] = 'A valid phone number with at least 7 digits is required.';
}

// Validate Dates
$todayStr = date('Y-m-d');
$dIn = DateTime::createFromFormat('Y-m-d', $checkIn);
$dOut = DateTime::createFromFormat('Y-m-d', $checkOut);

if (!$dIn || $dIn->format('Y-m-d') !== $checkIn) {
    $errors[] = 'Check-in date is invalid. Expected YYYY-MM-DD format.';
} elseif ($checkIn < $todayStr) {
    $errors[] = 'Check-in date cannot be in the past.';
}

if (!$dOut || $dOut->format('Y-m-d') !== $checkOut) {
    $errors[] = 'Check-out date is invalid. Expected YYYY-MM-DD format.';
}

if ($dIn && $dOut && $checkOut <= $checkIn) {
    $errors[] = 'Check-out date must be strictly after check-in date.';
}

if ($dIn && $dOut && $checkOut > $checkIn) {
    $diff = $dIn->diff($dOut);
    $nights = (int)$diff->days;
} else {
    $nights = isset($data['nights']) ? (int)$data['nights'] : 0;
}

if ($adults < 1) {
    $errors[] = 'At least 1 adult guest is required.';
}

if ($nights < 1) {
    $errors[] = 'Stay duration must be at least 1 night.';
}

if ($roomsCount < 1) {
    $roomsCount = 1;
}

// Resolve room_id and retrieve authoritative room price & capacity from database
$resolvedRoomId = null;
$roomPricePerNight = 0.0;
$maxGuestsAllowed = 0;

if (!empty($roomIdInput) && is_numeric($roomIdInput)) {
    $stmtRoom = $pdo->prepare("SELECT id, price_per_night, max_guests FROM rooms WHERE id = :id LIMIT 1");
    $stmtRoom->execute([':id' => (int)$roomIdInput]);
    $roomRow = $stmtRoom->fetch();
    if ($roomRow) {
        $resolvedRoomId = (int)$roomRow['id'];
        $roomPricePerNight = (float)$roomRow['price_per_night'];
        $maxGuestsAllowed = (int)$roomRow['max_guests'] * $roomsCount;
    }
}

if (!$resolvedRoomId && !empty($roomSlug)) {
    $stmtRoom = $pdo->prepare("SELECT id, price_per_night, max_guests FROM rooms WHERE slug = :slug LIMIT 1");
    $stmtRoom->execute([':slug' => $roomSlug]);
    $roomRow = $stmtRoom->fetch();
    if ($roomRow) {
        $resolvedRoomId = (int)$roomRow['id'];
        $roomPricePerNight = (float)$roomRow['price_per_night'];
        $maxGuestsAllowed = (int)$roomRow['max_guests'] * $roomsCount;
    }
}

if (!$resolvedRoomId) {
    $errors[] = 'A valid room selection is required.';
} elseif ($adults > $maxGuestsAllowed) {
    $errors[] = "Number of adult guests ({$adults}) exceeds maximum room capacity ({$maxGuestsAllowed}).";
}

// Authoritative service catalog
$serviceCatalog = [
    'airport_pickup' => ['aliases' => ['airport pickup', 'airport luxury transfer', 'airport transfer', 'airport_pickup'], 'name' => 'Airport Pickup', 'price' => 1200.0, 'per_night' => false],
    'airport_drop'   => ['aliases' => ['airport drop', 'airport departure transfer', 'airport_drop'], 'name' => 'Airport Drop', 'price' => 1200.0, 'per_night' => false],
    'breakfast'      => ['aliases' => ['gourmet breakfast buffet', 'breakfast buffet', 'breakfast'], 'name' => 'Gourmet Breakfast Buffet', 'price' => 600.0, 'per_night' => true],
    'extra_bed'      => ['aliases' => ['rollaway extra bed', 'extra bed', 'extra_bed'], 'name' => 'Rollaway Extra Bed', 'price' => 800.0, 'per_night' => true],
    'spa'            => ['aliases' => ['signature spa session (60m)', 'signature spa session', 'spa session', 'spa'], 'name' => 'Signature Spa Session (60m)', 'price' => 2500.0, 'per_night' => false],
    'dinner'         => ['aliases' => ['chef special 4-course dinner', '4-course dinner', 'dinner'], 'name' => 'Chef Special 4-Course Dinner', 'price' => 1500.0, 'per_night' => false],
    'celebration'    => ['aliases' => ['celebration floral & cake setup', 'celebration setup', 'cake setup', 'celebration'], 'name' => 'Celebration Floral & Cake Setup', 'price' => 2000.0, 'per_night' => false],
    'late_checkout'  => ['aliases' => ['guaranteed late checkout (4 pm)', 'guaranteed late checkout', 'late checkout', 'late_checkout'], 'name' => 'Guaranteed Late Checkout (4 PM)', 'price' => 1000.0, 'per_night' => false],
    'early_checkin'  => ['aliases' => ['priority early check-in (11 am)', 'priority early check-in', 'early check-in', 'early_checkin'], 'name' => 'Priority Early Check-in (11 AM)', 'price' => 0.0, 'per_night' => false],
    'dietary'        => ['aliases' => ['special dietary requirements', 'dietary requirements', 'dietary'], 'name' => 'Special Dietary Requirements', 'price' => 0.0, 'per_night' => false],
];

// Validate and calculate services
$serverNights = ($dIn && $dOut && $checkOut > $checkIn) ? (int)$dIn->diff($dOut)->days : max(1, (int)$nights);
$calculatedServices = [];
$serverServicesSubtotal = 0.0;

if (!empty($services) && is_array($services)) {
    foreach ($services as $svc) {
        $rawName = '';
        if (is_array($svc)) {
            $rawName = trim($svc['name'] ?? $svc['service_name'] ?? $svc['id'] ?? '');
        } elseif (is_string($svc)) {
            $rawName = trim($svc);
        }
        if (empty($rawName)) continue;

        $lowerRaw = strtolower($rawName);
        $matchedDef = null;
        foreach ($serviceCatalog as $catKey => $catDef) {
            if ($catKey === $lowerRaw || in_array($lowerRaw, $catDef['aliases'], true)) {
                $matchedDef = $catDef;
                break;
            }
        }

        if (!$matchedDef) {
            $errors[] = "Unknown or unsupported add-on service: \"{$rawName}\".";
        } else {
            $cost = $matchedDef['per_night'] ? ($matchedDef['price'] * $serverNights) : $matchedDef['price'];
            $calculatedServices[] = [
                'name'  => $matchedDef['name'],
                'price' => $cost
            ];
            $serverServicesSubtotal += $cost;
        }
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

// 3. Server-side authoritative recalculation of duration, rates, taxes, and totals
$serverNights = (int)$dIn->diff($dOut)->days;
if ($serverNights < 1) {
    $serverNights = 1;
}

$serverRoomSubtotal = round($roomPricePerNight * $serverNights * $roomsCount, 2);
$serverServicesSubtotal = round($serverServicesSubtotal, 2);
$serverSubtotal = $serverRoomSubtotal + $serverServicesSubtotal;
$taxRate = 0.18; // 18% GST as per PDR (e.g. 15,000 -> 2,700)
$serverTaxes = round($serverSubtotal * $taxRate, 2);
$serverTotalAmount = round($serverSubtotal + $serverTaxes, 2);

// 4. Generate unique booking reference: GVH-2026-#####
$bookingReference = '';
$maxAttempts = 10;
for ($i = 0; $i < $maxAttempts; $i++) {
    $candidate = 'GVH-2026-' . sprintf('%05d', random_int(10000, 99999));
    $stmtCheck = $pdo->prepare("SELECT id FROM bookings WHERE booking_reference = :ref LIMIT 1");
    $stmtCheck->execute([':ref' => $candidate]);
    if (!$stmtCheck->fetch()) {
        $bookingReference = $candidate;
        break;
    }
}

if (empty($bookingReference)) {
    $bookingReference = 'GVH-2026-' . strtoupper(substr(md5(uniqid()), 0, 5));
}

// 5. Insert into database using transaction (storing authoritative calculated values)
try {
    $pdo->beginTransaction();

    $stmtInsertBooking = $pdo->prepare("
        INSERT INTO bookings (
            booking_reference, room_id, guest_name, email, phone, country,
            check_in, check_out, adults, children, rooms_count, nights,
            room_subtotal, services_subtotal, taxes, total_amount, status
        ) VALUES (
            :ref, :room_id, :guest_name, :email, :phone, :country,
            :check_in, :check_out, :adults, :children, :rooms_count, :nights,
            :room_subtotal, :services_subtotal, :taxes, :total_amount, 'pending'
        )
    ");

    $stmtInsertBooking->execute([
        ':ref'               => $bookingReference,
        ':room_id'           => $resolvedRoomId,
        ':guest_name'        => $guestName,
        ':email'             => $email,
        ':phone'             => $phone,
        ':country'           => $country,
        ':check_in'          => $checkIn,
        ':check_out'         => $checkOut,
        ':adults'            => $adults,
        ':children'          => $children,
        ':rooms_count'       => $roomsCount,
        ':nights'            => $serverNights,
        ':room_subtotal'     => $serverRoomSubtotal,
        ':services_subtotal' => $serverServicesSubtotal,
        ':taxes'             => $serverTaxes,
        ':total_amount'      => $serverTotalAmount
    ]);

    $bookingId = (int)$pdo->lastInsertId();

    // Insert calculated services with canonical names and server-validated pricing
    if (!empty($calculatedServices)) {
        $stmtInsertService = $pdo->prepare("
            INSERT INTO booking_services (booking_id, service_name, price)
            VALUES (:booking_id, :service_name, :price)
        ");

        foreach ($calculatedServices as $svc) {
            $stmtInsertService->execute([
                ':booking_id'   => $bookingId,
                ':service_name' => substr($svc['name'], 0, 100),
                ':price'        => $svc['price']
            ]);
        }
    }

    $pdo->commit();

    http_response_code(201);
    echo json_encode([
        'success'           => true,
        'message'           => 'Reservation booked successfully.',
        'data'              => [
            'booking_reference' => $bookingReference,
            'booking_id'        => $bookingId,
            'nights'            => $serverNights,
            'tax_rate'          => $taxRate,
            'tax_percentage'    => 18,
            'room_subtotal'     => $serverRoomSubtotal,
            'services_subtotal' => $serverServicesSubtotal,
            'taxes'             => $serverTaxes,
            'total_amount'      => $serverTotalAmount,
            'status'            => 'pending'
        ],
        'status'            => 'pending',
        'booking_reference' => $bookingReference,
        'booking_id'        => $bookingId
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error processing booking reservation.'
    ]);
}
