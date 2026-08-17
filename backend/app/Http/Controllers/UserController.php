<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Lista de usuarios (solo admin/root pueden ver esto, ya protegido por ruta).
     */
    public function index()
    {
        return User::select('id', 'name', 'email', 'role')->latest()->get();
    }

    /**
     * Crear un usuario nuevo. Admin solo puede crear "user". Root puede crear "user" o "admin".
     */
    public function store(Request $request)
    {
        $actor = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:user,admin',
        ]);

        if ($validated['role'] === 'admin' && !$actor->isRoot()) {
            abort(403, 'Solo la cuenta root puede crear administradores.');
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return response()->json($user, 201);
    }

    /**
     * Editar un usuario existente.
     */
    public function update(Request $request, User $user)
    {
        $actor = $request->user();

        $this->authorizeTarget($actor, $user);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,'.$user->id,
            'password' => 'sometimes|required|string|min:6',
            'role' => 'sometimes|required|in:user,admin',
        ]);

        if (isset($validated['role']) && $validated['role'] === 'admin' && !$actor->isRoot()) {
            abort(403, 'Solo la cuenta root puede asignar el rol de administrador.');
        }

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return $user;
    }

    /**
     * Eliminar un usuario.
     */
    public function destroy(Request $request, User $user)
    {
        $actor = $request->user();

        $this->authorizeTarget($actor, $user);

        if ($user->id === $actor->id) {
            abort(403, 'No puedes eliminar tu propia cuenta.');
        }

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado correctamente.']);
    }

    /**
     * Reglas: nadie toca al root. Admin no puede tocar a otro admin (solo root puede).
     */
    private function authorizeTarget(User $actor, User $target): void
    {
        if ($target->isRoot()) {
            abort(403, 'La cuenta root no puede ser modificada.');
        }

        if ($target->isAdmin() && !$actor->isRoot()) {
            abort(403, 'Solo la cuenta root puede modificar a otros administradores.');
        }
    }
}