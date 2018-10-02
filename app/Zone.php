<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Zone extends Model
{
 

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function troops()
    {
        return $this->hasMany('App\Troop');
    }
}
