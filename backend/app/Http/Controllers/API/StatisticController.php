<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Response;
use App\Models\User;
use App\Models\Product;
use App\Models\Kit;

class StatisticController extends Controller
{
    /**
     * Display the statistics.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function get()
    {
        $users      = User::count();
        $products   = Product::count();
        $kits       = Kit::count();

        return Response::json([
            'users'     => $users,
            'products'  => $products,
            'kits'      => $kits
        ]);
    }
}
