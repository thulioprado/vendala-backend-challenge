<?php

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductImage;

class ProductsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(Product::class, 100)
            ->create()
            ->each(function ($product) {
                $product->images()
                        ->saveMany(factory(ProductImage::class, rand(1, 5))->make());
            });
    }
}
