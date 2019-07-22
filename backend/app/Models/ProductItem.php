<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Product;

class ProductItem extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'product_id', 'item_id', 'amount'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'item_id');
    }
}
