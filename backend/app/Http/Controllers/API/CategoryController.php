<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Response;
use App\Library\MercadoLivre;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function all()
    {
        $categories = MercadoLivre::categories();

        if ($categories === false) {
            return Response::json([], 500);
        }

        return Response::json($categories);
    }

    /**
     * Display the specified category.
     *
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $category = MercadoLivre::category($id);

        if ($category === false) {
            return Response::json([], 500);
        }

        return Response::json($category);
    }
}
