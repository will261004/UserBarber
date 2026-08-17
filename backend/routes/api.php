<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// --- Rutas públicas ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// --- Rutas protegidas (requieren token válido) ---
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('appointments', AppointmentController::class);

    // --- Solo admin y root pueden gestionar usuarios ---
    Route::middleware('role:admin,root')->group(function () {
        Route::apiResource('users', UserController::class)->except(['show']);
    });
});