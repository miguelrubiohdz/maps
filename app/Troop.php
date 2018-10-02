<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Troop extends Model
{

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function zone()
    {
        return $this->belongsTo('App\Zone');
    }
}
