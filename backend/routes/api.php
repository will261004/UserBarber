<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AppointmentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Rutas públicas de Autenticación
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas que requieren Token (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/register', [AuthController::class, 'register']); // Movida aquí para que solo usuarios autenticados puedan crear cuentas
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Rutas para la gestión de Citas (Appointments)
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::delete('/appointments/{id}', [AppointmentController::class, 'destroy']);
});