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

Route::group(['namespace' => 'API', 'middleware' => 'vendala.token'], function () {

    # Auth
    Route::group(['prefix' => 'auth'], function () {

        Route::post('login', 'AuthController@login');
        Route::get('refresh', 'AuthController@refresh');

        Route::group(['middleware' => 'auth:api'], function () {
            Route::get('user', 'AuthController@user');
            Route::get('logout', 'AuthController@logout');
            Route::get('ping', 'AuthController@ping');
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
        Route::delete('{id}/force', 'UserController@forceDestroy');

    });

    # Categories
    Route::group(['prefix' => 'categories', 'middleware' => 'auth:api'], function () {

        Route::get('/', 'CategoryController@all');
        Route::get('{id}', 'CategoryController@show');

    });

    # Products
    Route::group(['prefix' => 'products', 'middleware' => 'auth:api'], function () {

        Route::get('/', 'ProductController@all');
        Route::get('/trashed', 'ProductController@allTrashed');
        Route::post('/', 'ProductController@store');
        Route::get('{id}', 'ProductController@show');
        Route::put('{id}', 'ProductController@update');
        Route::delete('{id}', 'ProductController@destroy');
        Route::delete('{id}/force', 'ProductController@forceDestroy');

    });

    # Statistics
    Route::group(['prefix' => 'statistics', 'middleware' => 'auth:api'], function () {

        Route::get('/', 'StatisticController@get');

    });

});
