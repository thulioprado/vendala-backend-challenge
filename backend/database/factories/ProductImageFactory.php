<?php

use App\Models\ProductImage;
use App\Models\Product;
use Faker\Generator as Faker;

$factory->define(ProductImage::class, function (Faker $faker) {
    return [
        'product_id'  => Product::all()
                                ->random()
                                ->first()
                                ->id,
        'path'        => $faker->imageUrl()
    ];
});
