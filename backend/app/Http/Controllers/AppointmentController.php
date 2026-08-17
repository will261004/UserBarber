<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    /**
     * Admin/root ven todas las citas. Un user normal solo ve las suyas.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->hasAdminPrivileges()) {
            return Appointment::with('user:id,name,email')->latest()->get();
        }

        return Appointment::where('user_id', $user->id)->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'appointment_date' => 'required|date',
            'appointment_time' => 'required',
        ]);

        $validated['user_id'] = $request->user()->id;

        return Appointment::create($validated);
    }

    public function show(Request $request, Appointment $appointment)
    {
        $this->authorizeAccess($request, $appointment);

        return $appointment;
    }

    public function update(Request $request, Appointment $appointment)
    {
        $this->authorizeAccess($request, $appointment);

        $validated = $request->validate([
            'client_name' => 'sometimes|required|string|max:255',
            'appointment_date' => 'sometimes|required|date',
            'appointment_time' => 'sometimes|required',
        ]);

        $appointment->update($validated);

        return $appointment;
    }

    public function destroy(Request $request, Appointment $appointment)
    {
        $this->authorizeAccess($request, $appointment);

        $appointment->delete();

        return response()->json(['message' => 'Cita eliminada correctamente.']);
    }

    /**
     * Bloquea el acceso si no es admin/root y tampoco es el dueño de la cita.
     */
    private function authorizeAccess(Request $request, Appointment $appointment): void
    {
        $user = $request->user();

        if (!$user->hasAdminPrivileges() && $appointment->user_id !== $user->id) {
            abort(403, 'No tienes permiso para acceder a esta cita.');
        }
    }
}