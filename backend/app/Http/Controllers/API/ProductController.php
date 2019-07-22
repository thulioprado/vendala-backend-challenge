<?php

namespace App\Http\Controllers\API;

use App\Library\MercadoLivre;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function all()
    {
        $products = Product::with(['items.product.images', 'images'])
                           ->get();
        return Response::json($products);
    }

    /**
     * Display a listing of deleted products.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function allTrashed()
    {
        $products = Product::onlyTrashed()
                           ->with(['items.product.images', 'images'])
                           ->get();
        return Response::json($products);
    }

    /**
     * Store a newly created product in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'          => 'required|string|min:4|max:100',
            'category'      => 'required|string',
            'description'   => 'nullable|string|max:65535',
            'price'         => ['required', 'regex:/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/'],
            'images.*'      => 'nullable|image'
        ], [
            'name.required'         => 'Insira o nome.',
            'name.string'           => 'Nome inválido',
            'name.max'              => 'Nome curto demais. Tente um nome maior.',
            'name.max'              => 'Nome longo demais. Tente um nome menor.',
            'category.required'     => 'Selecione a categoria final.',
            'category.string'       => 'Categoria inválida.',
            'description.string'    => 'Descrição inválida.',
            'description.max'       => 'Descrição longa demais. Tente uma descrição menor.',
            'price.required'        => 'Insira o preço.',
            'price.regex'           => 'Preço inválido.',
            'images.*.image'        => 'Imagem inválida.'
        ]);

        if ($validator->fails()) {
            return Response::json(['errors' => $validator->errors()], 422);
        }

        $category = MercadoLivre::category($request->category);

        if ($category === false) {
            $validator->errors()->add('category', 'Categoria inválida.');
            return Response::json(['errors' => $validator->errors()], 422);
        }

        $items = [];

        if ($request->has('items')) {
            $itemsIds = [];

            foreach ($request->items as $item => $amount) {
                $itemsIds[] = $item;
                $items[]    = [
                    'item_id' => $item,
                    'amount'  => $amount
                ];
            }

            if (Product::whereIn('id', $itemsIds)->count() != count($itemsIds)) {
                $validator->errors()->add('items', 'Produto inválido adicionado no kit. Por favor, verifique.');
                return Response::json(['errors' => $validator->errors()], 422);
            }
        }

        $images = [];

        if ($request->hasFile('images')) {
            foreach ($request->images as $image) {
                $path = $image->store('products');

                if ($path === false) {
                    $validator->errors()->add('images', 'Falha no upload de imagens.');
                    return Response::json(['errors' => $validator->errors()], 422);
                }

                $images[] = [
                    'path' => $path
                ];
            }
        }

        $product = null;

        DB::transaction(function () use ($request, &$product, $images, $items) {
            $product = Product::create($request->only([
                                  'name', 'category', 'description', 'price'
                              ]));

            if ($images !== []) {
                $product->images()
                        ->createMany($images);
            }

            if ($items !== []) {
                $product->items()
                        ->createMany($items);
            }
        });

        if ($product) {
            return $this->show($product->id);
        }

        return Response::json([], 500);
    }

    /**
     * Display the specified product.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $product = Product::with(['items.product.images', 'images'])
                          ->find($id);

        if (!$product) {
            return Response::json([], 404);
        }

        return Response::json($product);
    }

    /**
     * Update the specified product in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return Response::json([], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'          => 'required|string|min:4|max:100',
            'category'      => 'required|string',
            'description'   => 'nullable|string|max:65535',
            'price'         => ['required', 'regex:/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/'],
            'images.*'      => 'nullable|image'
        ], [
            'name.required'         => 'Insira o nome.',
            'name.string'           => 'Nome inválido',
            'name.max'              => 'Nome curto demais. Tente um nome maior.',
            'name.max'              => 'Nome longo demais. Tente um nome menor.',
            'category.required'     => 'Selecione a categoria final.',
            'category.string'       => 'Categoria inválida.',
            'description.string'    => 'Descrição inválida.',
            'description.max'       => 'Descrição longa demais. Tente uma descrição menor.',
            'price.required'        => 'Insira o preço.',
            'price.regex'           => 'Preço inválido.',
            'images.*.image'        => 'Imagem inválida.'
        ]);

        if ($validator->fails()) {
            return Response::json(['errors' => $validator->errors()], 422);
        }

        $category = MercadoLivre::category($request->category);

        if ($category === false) {
            $validator->errors()->add('category', 'Categoria inválida.');
            return Response::json(['errors' => $validator->errors()], 422);
        }

        $items = [];

        if ($request->has('items')) {
            $itemsIds = [];

            foreach ($request->items as $item => $amount) {
                $itemsIds[] = $item;
                $items[]    = [
                    'item_id' => $item,
                    'amount'  => $amount
                ];
            }

            if (Product::whereIn('id', $itemsIds)->count() != count($itemsIds)) {
                $validator->errors()->add('items', 'Produto inválido adicionado no kit. Por favor, verifique.');
                return Response::json(['errors' => $validator->errors()], 422);
            }
        }

        $images = [];

        if ($request->hasFile('images')) {
            foreach ($request->images as $key => $image) {
                $path = $image->store('products');

                if ($path === false) {
                    $validator->errors()->add('images', 'Falha no upload de imagens.');
                    return Response::json(['errors' => $validator->errors()], 422);
                }

                $images[] = [
                    'path' => $path
                ];
            }
        }

        DB::transaction(function () use ($request, &$product, $images, $items) {
            $product->update($request->only([
                        'name', 'category', 'description', 'price'
                    ]));

            if ($images !== []) {
                foreach ($product->images as $image) {
                    if (Storage::exists($image->path)) {
                        Storage::delete($image->path);
                    }
                }

                $product->images()
                        ->delete();

                $product->images()
                        ->createMany($images);
            }

            if ($items !== []) {
                $product->items()
                        ->delete();

                $product->items()
                        ->createMany($items);
            }
        });

        return $this->show($product->id);
    }

    /**
     * Remove the specified product from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return Response::json([], 404);
        }

        DB::transaction(function () use ($product) {
            $product->delete();
        });

        return Response::json();
    }

    /**
     * Forcibly remove the specified product from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function forceDestroy($id)
    {
        $product = Product::withTrashed()
                          ->find($id);

        if (!$product) {
            return Response::json([], 404);
        }

        DB::transaction(function () use ($product) {
            foreach ($product->images as $image) {
                if (Storage::exists($image->path)) {
                    Storage::delete($image->path);
                }
            }

            $product->forceDelete();
        });

        return Response::json();
    }
}
