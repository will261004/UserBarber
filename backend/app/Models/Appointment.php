<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $fillable = [
        'client_name',
        'appointment_date',
        'appointment_time',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}