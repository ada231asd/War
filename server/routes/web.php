<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Laravel API Backend is running!',
        'version' => '1.0.0',
        'timestamp' => now()
    ]);
});

Route::get('/api/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now()
    ]);
});
