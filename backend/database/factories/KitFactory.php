<?php

use App\Models\Kit;
use Faker\Generator as Faker;

$factory->define(Kit::class, function (Faker $faker) {
    return [
        'name' => $faker->words(2, true)
    ];
});
