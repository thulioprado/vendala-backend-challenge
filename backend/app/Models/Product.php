<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\ProductImage;
use App\Models\ProductItem;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'category', 'description', 'price'
    ];

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function items()
    {
        return $this->hasMany(ProductItem::class);
    }
}
