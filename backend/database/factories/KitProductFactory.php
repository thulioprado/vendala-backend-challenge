<?php

use App\Models\KitProduct;
use App\Models\Kit;
use App\Models\Product;
use Faker\Generator as Faker;

$factory->define(KitProduct::class, function (Faker $faker) {
    return [
        'kit_id'     => Kit::all()
                           ->random()
                           ->first()
                           ->id,
        'product_id' => Product::all()
                               ->random()
                               ->first()
                               ->id
    ];
});
