<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Kit;
use App\Models\Product;

class KitProduct extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'kit_id', 'product_id'
    ];

    public function kit()
    {
        return $this->belongsTo(Kit::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::clas);
    }
}
