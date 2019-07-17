<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['namespace' => 'API'], function () {

    # Auth
    Route::group(['prefix' => 'auth'], function () {

        Route::post('login', 'AuthController@login');

        Route::group(['middleware' => 'auth:api'], function () {
            Route::get('user', 'AuthController@user');
            Route::get('refresh', 'AuthController@refresh');
            Route::get('logout', 'AuthController@logout');
        });

    });

    # Users
    Route::group(['prefix' => 'users', 'middleware' => 'auth:api'], function () {

        Route::get('/', 'UserController@all');
        Route::get('/trashed', 'UserController@allTrashed');
        Route::post('/', 'UserController@store');
        Route::get('{id}', 'UserController@show');
        Route::put('{id}', 'UserController@update');
        Route::delete('{id}', 'UserController@destroy');

    });

    # Products
    Route::group(['prefix' => 'products', 'middleware' => 'auth:api'], function () {

    });

    # Kits
    Route::group(['prefix' => 'kits', 'middleware' => 'auth:api'], function () {

    });

});
