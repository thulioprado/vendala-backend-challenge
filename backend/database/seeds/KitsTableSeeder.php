<?php

use Illuminate\Database\Seeder;
use App\Models\Kit;
use App\Models\KitProduct;

class KitsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(Kit::class, 50)
            ->create()
            ->each(function ($kit) {
                $kit->products()
                    ->saveMany(factory(KitProduct::class, rand(2, 10))->make());
            });
    }
}
