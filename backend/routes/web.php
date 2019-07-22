<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('images/{folder}/{file}', function ($folder, $file) {
    return Image::make(storage_path("app/{$folder}/{$file}"))
                ->response();
})->name('image');

Route::get('/', function () {
    return view('index');
});
