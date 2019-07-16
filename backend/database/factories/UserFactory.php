<?php

use App\Models\User;
use App\Models\Role;
use Faker\Generator as Faker;

$factory->define(User::class, function (Faker $faker) {
    return [
        'name'      => $faker->name,
        'email'     => $faker->unique()
                             ->safeEmail,
        'password'  => bcrypt('vendala'),
        'role_id'   => Role::all()
                           ->random()
                           ->first()
                           ->id
    ];
});
