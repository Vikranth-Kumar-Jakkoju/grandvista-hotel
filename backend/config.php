<?php
/**
 * GrandVista Hotel - Database Configuration
 * Uses PDO MySQL with credentials read from environment variables or .env file.
 * Defaults to user=root, pass='' if not provided.
 */

// Load .env file if present in the backend directory
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }
        $parts = explode('=', $line, 2);
        if (count($parts) === 2) {
            $name = trim($parts[0]);
            $val = trim($parts[1]);
            // Remove surrounding quotes if present
            if ((str_starts_with($val, '"') && str_ends_with($val, '"')) ||
                (str_starts_with($val, "'") && str_ends_with($val, "'"))) {
                $val = substr($val, 1, -1);
            }
            putenv("{$name}={$val}");
            $_ENV[$name] = $val;
            $_SERVER[$name] = $val;
        }
    }
}

// Read database parameters with safe fallback defaults
$host   = getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? 'localhost');
$port   = getenv('DB_PORT') ?: ($_ENV['DB_PORT'] ?? 3306);
$dbname = getenv('DB_NAME') ?: ($_ENV['DB_NAME'] ?? 'grandvista_hotel');
$user   = getenv('DB_USER') ?: ($_ENV['DB_USER'] ?? 'root');
$pass   = getenv('DB_PASS');
if ($pass === false && isset($_ENV['DB_PASS'])) {
    $pass = $_ENV['DB_PASS'];
} elseif ($pass === false) {
    $pass = ''; // Fallback default for local dev
}

try {
    $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'status'  => 'error',
        'message' => 'Database connection failed: ' . $e->getMessage()
    ]);
    exit;
}
