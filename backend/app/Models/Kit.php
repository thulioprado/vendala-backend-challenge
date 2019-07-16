<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\KitProduct;

class Kit extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name'
    ];

    public function products()
    {
        return $this->hasMany(KitProduct::class);
    }
}
