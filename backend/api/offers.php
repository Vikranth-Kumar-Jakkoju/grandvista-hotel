<?php
/**
 * GrandVista Hotel - Offers API Endpoint
 * GET /backend/api/offers.php
 * Returns all active offers with benefits matching offers.json structure.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once dirname(__DIR__) . '/config.php';

// Metadata mapping for categories and slugs
$categoryMeta = [
    'weekend' => [
        'slug'           => 'weekend-indulgence',
        'category_label' => 'Weekend Offers',
        'discount_tag'   => 'Up to 25% OFF',
        'validity'       => 'Valid Friday – Sunday through Dec 2026',
    ],
    'early-bird' => [
        'slug'           => 'early-bird-privilege',
        'category_label' => 'Early Booking',
        'discount_tag'   => 'Save Flat 20%',
        'validity'       => 'Book 30+ days in advance',
    ],
    'couples' => [
        'slug'           => 'romantic-rendezvous',
        'category_label' => 'Couple Packages',
        'discount_tag'   => 'From ₹22,000 / night',
        'validity'       => 'Valid all year round',
    ],
    'family' => [
        'slug'           => 'family-memories-escape',
        'category_label' => 'Family Packages',
        'discount_tag'   => '2nd Room at 50% OFF',
        'validity'       => 'Valid during school holidays & weekends',
    ],
    'business' => [
        'slug'           => 'executive-business-stay',
        'category_label' => 'Business Stay',
        'discount_tag'   => 'Corporate Rate Benefits',
        'validity'       => 'Valid Sunday – Thursday stays',
    ],
    'long-stay' => [
        'slug'           => 'extended-stay-residence',
        'category_label' => 'Long Stay',
        'discount_tag'   => 'Save Up to 35%',
        'validity'       => 'Valid for stays of 7+ consecutive nights',
    ],
    'festival' => [
        'slug'           => 'festive-celebration-package',
        'category_label' => 'Festival Offers',
        'discount_tag'   => 'Special Holiday Inclusions',
        'validity'       => 'Valid during National & Cultural Holidays',
    ],
];

try {
    // 1. Fetch offers from database
    $stmt = $pdo->query("SELECT * FROM offers WHERE status = 'active' ORDER BY id ASC");
    $offers = $stmt->fetchAll();

    // 2. Fetch all offer benefits grouped by offer_id
    $stmtBenefits = $pdo->query("SELECT offer_id, benefit FROM offer_benefits ORDER BY id ASC");
    $benefitRows = $stmtBenefits->fetchAll();
    $benefitsMap = [];
    foreach ($benefitRows as $row) {
        $benefitsMap[$row['offer_id']][] = $row['benefit'];
    }

    // 3. Format response to match offers.json
    $response = [];
    foreach ($offers as $o) {
        $offerId = (int)$o['id'];
        $cat = strtolower(trim($o['category']));
        $meta = $categoryMeta[$cat] ?? [
            'slug'           => strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $o['title']))),
            'category_label' => ucfirst($cat) . ' Offers',
            'discount_tag'   => 'Special Offer',
            'validity'       => 'Limited Period Offer',
        ];

        $slug = $meta['slug'];

        $response[] = [
            'id'             => $slug,
            'slug'           => $slug,
            'title'          => $o['title'],
            'category'       => $cat,
            'category_label' => $meta['category_label'],
            'discount_tag'   => $meta['discount_tag'],
            'validity'       => $meta['validity'],
            'description'    => $o['description'],
            'included_perks' => $benefitsMap[$offerId] ?? [],
            'terms'          => $o['terms'],
            'image'          => $o['image']
        ];
    }

    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error loading offers.'
    ]);
}
