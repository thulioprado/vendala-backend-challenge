<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateKitProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('kit_products', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('kit_id');
            $table->foreign('kit_id')
                  ->references('id')
                  ->on('kits')
                  ->onDelete('cascade');
            $table->unsignedBigInteger('product_id');
            $table->foreign('product_id')
                  ->references('id')
                  ->on('products')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('kit_products');
    }
}
