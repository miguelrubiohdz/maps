<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Zone;
use App\Troop;

class MainController extends Controller
{
    public function getZonesbyLocation($lat,$lng,$qty){
        //return $lat . ", " . $lng . "," . $qty;
        $qty = $qty/1000;
        $zones = Zone::whereBetween("lat",[$lat-$qty,$lat+$qty])->whereBetween("lng",[$lng-$qty,$lng+$qty])->get();
        foreach($zones as $zone){
            $zone['troops'] = Troop::where("zone_id",$zone['id'])->get();
        }
        echo $zones;
    }

}
