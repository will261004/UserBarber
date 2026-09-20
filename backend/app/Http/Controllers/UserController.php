public function store(Request $request)
    {
        $actor = $request->user();

        // Validamos de forma flexible para que nunca falle por el texto del rol
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'nullable|string',
        ]);

        $roleInput = strtolower($validated['role'] ?? 'user');
        
        // Mapeamos los roles permitidos
        $assignedRole = 'user';
        if (in_array($roleInput, ['admin', 'administrador'])) {
            if (!$actor->isRoot()) {
                abort(403, 'Solo la cuenta root puede crear administradores.');
            }
            $assignedRole = 'admin';
        } elseif (in_array($roleInput, ['barbero', 'barber'])) {
            $assignedRole = 'barbero';
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $assignedRole,
        ]);

        return response()->json($user, 201);
    }