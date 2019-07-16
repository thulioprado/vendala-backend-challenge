<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Product;

class ProductImage extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'product_id', 'path'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
