<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index()
    {
        return Appointment::latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'appointment_date' => 'required|date',
            'appointment_time' => 'required',
        ]);

        return Appointment::create($validated);
    }
}