<?php

namespace App\Library;

use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Client;

class MercadoLivre
{
    static public function category($id)
    {
        try {
            $client   = new Client();
            $response = $client->get("https://api.mercadolibre.com/categories/{$id}");
            $result   = $response->getBody()
                                 ->getContents();

            return json_decode($result);
        } catch (GuzzleException $e) {
            return false;
        }
    }

    static public function categories()
    {
        try {
            $client   = new Client();
            $response = $client->get('https://api.mercadolibre.com/sites/MLB/categories');
            $result   = $response->getBody()
                                 ->getContents();

            return json_decode($result);
        } catch (GuzzleException $e) {
            return false;
        }
    }

    static public function getChildren($category)
    {
        if ($category === false) {
            return false;
        }

        $children = [];

        foreach ($category->children_categories as $child) {
            $detail = self::category($child->id);

            if ($detail === false) {
                continue;
            }

            $children[] = [
                'id'        => $detail->id,
                'name'      => $detail->name,
                'children'  => self::getChildren($detail)
            ];
        }

        return $children;
    }

    static public function detailedCategories()
    {
        $categories = self::categories();

        if ($categories === false) {
            return false;
        }

        $final = [];

        foreach ($categories as $category) {
            $detail = self::category($category->id);

            if ($detail === false) {
                continue;
            }

            $final[] = [
                'id'        => $category->id,
                'name'      => $category->name,
                'children'  => self::getChildren($detail)
            ];
        }

        return $final;
    }
}
