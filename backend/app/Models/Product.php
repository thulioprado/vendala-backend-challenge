<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ProductImage;
use Illuminate\Database\Eloquent\SoftDeletes;

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
}
