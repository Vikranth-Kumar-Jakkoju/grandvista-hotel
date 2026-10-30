<?php
/**
 * GrandVista Hotel - Restaurants API Endpoint
 * GET /backend/api/restaurants.php
 * Returns all dining venues matching restaurants.json structure.
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

// Restaurant metadata mapping for gallery, hours, dress code, location, and signature dishes
$venueMeta = [
    'grandvista-restaurant' => [
        'subtitle'   => 'Contemporary Fine Dining & Royal Indian Heritage',
        'hero_image' => 'images/dining/restaurant.svg',
        'gallery'    => [
            [
                'src'     => 'images/dining/restaurant.svg',
                'caption' => 'The Grand Dining Hall with crystal chandeliers and intimate banquette seating',
                'alt'     => 'GrandVista Restaurant Grand Dining Room'
            ],
            [
                'src'     => 'images/dining/signature-dish.svg',
                'caption' => 'Signature Pan-Seared Himalayan Trout with Saffron Infusion',
                'alt'     => 'Signature Culinary Dish'
            ],
            [
                'src'     => 'images/dining/dessert.svg',
                'caption' => 'Grand Chocolate Sphere with Gold Dust and Fresh Berry Coulis',
                'alt'     => 'Artisan Dessert'
            ],
            [
                'src'     => 'images/dining/patio.svg',
                'caption' => 'Courtyard Al Fresco Verandah overlooking the garden fountains',
                'alt'     => 'Verandah Al Fresco Seating'
            ]
        ],
        'cuisine'    => [
            'Modern Indian',
            'European Contemporary',
            'Awadhi Royal Cuisine'
        ],
        'hours'      => 'Breakfast: 7:00 AM – 10:30 AM | Lunch: 12:30 PM – 3:30 PM | Dinner: 7:00 PM – 11:30 PM',
        'dress_code' => 'Smart Casual / Elegant Evening (Collared shirts, no flip-flops or athletic wear)',
        'location'   => 'Main Lobby Level, East Wing Atrium',
        'signature_dishes' => [
            [
                'name'        => 'Royal Saffron Dum Biryani',
                'description' => 'Slow-cooked aged basmati rice layered with aromatic saffron, marinated meat or royal wild mushrooms, sealed with artisanal whole wheat dough.',
                'price'       => 1450,
                'is_veg'      => false,
                'image'       => 'images/dining/signature-dish.svg'
            ],
            [
                'name'        => 'Truffled Morel & Paneer Tikka',
                'description' => 'Charcoal-smoked cottage cheese stuffed with Kashmiri morels, glazed in black truffle butter and hung curd marinade.',
                'price'       => 1250,
                'is_veg'      => true,
                'image'       => 'images/dining/signature-dish.svg'
            ],
            [
                'name'        => 'Grand Cru Chocolate Sphere',
                'description' => '70% Valrhona dark chocolate dome melted table-side with warm Madagascar bourbon vanilla ganache and raspberry coulis.',
                'price'       => 850,
                'is_veg'      => true,
                'image'       => 'images/dining/dessert.svg'
            ]
        ]
    ],
    'sky-lounge' => [
        'subtitle'   => 'Panoramic Skyline Views, Tapas & Mixology',
        'hero_image' => 'images/dining/sky-lounge.svg',
        'gallery'    => [
            [
                'src'     => 'images/dining/sky-lounge.svg',
                'caption' => 'Rooftop observation terrace with illuminated skyline vistas',
                'alt'     => 'Sky Lounge Rooftop Observation View'
            ],
            [
                'src'     => 'images/dining/cocktail.svg',
                'caption' => 'Bespoke Oak-Smoked Bourbon Cocktail crafted by our Resident Mixologist',
                'alt'     => 'Handcrafted Rooftop Cocktail'
            ],
            [
                'src'     => 'images/dining/patio.svg',
                'caption' => 'Starlit lounge cabanas with fire pits and plush lounge sofas',
                'alt'     => 'Rooftop Starlit Cabana'
            ],
            [
                'src'     => 'images/dining/signature-dish.svg',
                'caption' => 'Gourmet Robata Skewers and Mediterranean mezze platters',
                'alt'     => 'Rooftop Tapas Platter'
            ]
        ],
        'cuisine'    => [
            'Artisanal Tapas',
            'Wood-Fired Robata Grill',
            'Craft Mixology & Rare Spirits'
        ],
        'hours'      => 'Evening & Nightly: 5:00 PM – 1:00 AM (Live Resident DJ from 8:00 PM)',
        'dress_code' => 'Chic Evening / Glamour (Collared shirts for gentlemen, smart evening footwear)',
        'location'   => 'Rooftop Terrace (14th Floor)',
        'signature_dishes' => [
            [
                'name'        => 'Smoked Hickory Old Fashioned',
                'description' => 'Single barrel bourbon infused with orange zest, Angostura bitters, served under a cloche with fresh hickory wood smoke.',
                'price'       => 950,
                'is_veg'      => true,
                'image'       => 'images/dining/cocktail.svg'
            ],
            [
                'name'        => 'Glazed Pork Belly / Tofu Robata Skewers',
                'description' => 'Slow-braised skewers caramelized over binchotan charcoal with yuzu honey reduction and toasted sesame.',
                'price'       => 1100,
                'is_veg'      => false,
                'image'       => 'images/dining/signature-dish.svg'
            ],
            [
                'name'        => 'Truffle Edamame & Parmesan Dumplings',
                'description' => 'Steamed crystal dumplings filled with crushed edamame, shaved black truffles, and aged parmesan broth.',
                'price'       => 980,
                'is_veg'      => true,
                'image'       => 'images/dining/signature-dish.svg'
            ]
        ]
    ],
    'the-grand-cafe' => [
        'subtitle'   => 'Artisanal Boulangerie, Viennoiserie & Single-Origin Roasts',
        'hero_image' => 'images/dining/cafe.svg',
        'gallery'    => [
            [
                'src'     => 'images/dining/cafe.svg',
                'caption' => 'Sunlit European brass & marble café atrium with fresh morning pastry displays',
                'alt'     => 'The Grand Café Marble Atrium'
            ],
            [
                'src'     => 'images/dining/dessert.svg',
                'caption' => 'Handcrafted Parisian Macarons and seasonal French fruit tartlets',
                'alt'     => 'Artisan Pastry & Tarts'
            ],
            [
                'src'     => 'images/dining/patio.svg',
                'caption' => 'Sun-dappled courtyard garden patio for relaxed morning coffee and books',
                'alt'     => 'Courtyard Café Patio'
            ],
            [
                'src'     => 'images/dining/signature-dish.svg',
                'caption' => 'Freshly baked sourdough tartines with avocado, smoked salmon, and poached egg',
                'alt'     => 'Artisan Sourdough Tartine'
            ]
        ],
        'cuisine'    => [
            'French Boulangerie & Viennoiserie',
            'Specialty Single-Origin Coffees',
            'Gourmet Sandwiches & All-Day High Tea'
        ],
        'hours'      => 'Daily: 6:30 AM – 10:00 PM (Fresh oven bakes at 7:00 AM, 11:30 AM, and 4:00 PM)',
        'dress_code' => 'Casual / Relaxed Comfort',
        'location'   => 'Lobby Level, North Courtyard Colonnade',
        'signature_dishes' => [
            [
                'name'        => 'Chikmagalur Pour-Over Single Origin',
                'description' => 'Shade-grown specialty coffee brewed manually table-side with citrus and bittersweet dark cocoa undertones.',
                'price'       => 420,
                'is_veg'      => true,
                'image'       => 'images/dining/cafe.svg'
            ],
            [
                'name'        => 'Almond Croissant & Wild Berry Tart',
                'description' => 'Flaky hand-laminated butter croissant filled with frangipane cream, paired with fresh seasonal berries.',
                'price'       => 480,
                'is_veg'      => true,
                'image'       => 'images/dining/dessert.svg'
            ],
            [
                'name'        => 'Avocado & Burrata Sourdough Tartine',
                'description' => 'Crusty wood-fired sourdough toast topped with Hass avocado, creamy artisanal burrata, heirloom cherry tomatoes, and basil oil.',
                'price'       => 750,
                'is_veg'      => true,
                'image'       => 'images/dining/signature-dish.svg'
            ]
        ]
    ]
];

try {
    $stmt = $pdo->query("SELECT * FROM restaurants ORDER BY id ASC");
    $restaurants = $stmt->fetchAll();

    $response = [];
    foreach ($restaurants as $r) {
        $slug = $r['slug'];
        $meta = $venueMeta[$slug] ?? [];

        // Parse cuisine list
        $cuisine = $meta['cuisine'] ?? [];
        if (empty($cuisine) && !empty($r['cuisine'])) {
            $cuisine = array_map('trim', explode(',', $r['cuisine']));
        }

        $heroImage = $meta['hero_image'] ?? $r['image'];

        $response[] = [
            'id'               => $slug,
            'slug'             => $slug,
            'name'             => $r['name'],
            'subtitle'         => $meta['subtitle'] ?? 'Luxury Dining at GrandVista',
            'hero_image'       => $heroImage,
            'gallery'          => $meta['gallery'] ?? [],
            'cuisine'          => $cuisine,
            'hours'            => $meta['hours'] ?? 'Daily: 7:00 AM – 11:00 PM',
            'dress_code'       => $meta['dress_code'] ?? 'Smart Casual',
            'location'         => $meta['location'] ?? 'Main Level',
            'description'      => $r['description'],
            'signature_dishes' => $meta['signature_dishes'] ?? []
        ];
    }

    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error loading dining venues.'
    ]);
}
