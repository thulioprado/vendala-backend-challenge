<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
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

    public function getPathAttribute($value)
    {
        $value = explode('/', $value);
        return route('image', [
            'folder' => $value[0],
            'file'   => $value[1]
        ]);
    }
}
