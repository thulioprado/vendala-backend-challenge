<?php

use App\Models\Product;
use Faker\Generator as Faker;

$factory->define(Product::class, function (Faker $faker) {
    return [
        'name'          => $faker->words(2, true),
        'category'      => $faker->word,
        'description'   => $faker->text,
        'price'         => $faker->randomFloat(2, 0, 100)
    ];
});
