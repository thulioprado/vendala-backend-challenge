<?php

namespace App\Http\Middleware;

use Closure;

class VerifyVendalaToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if ($request->headers->has('Vendala-Token')) {
            $token = $request->headers->get('Vendala-Token');

            if ($token === config('app.vendala_token')) {
                return $next($request);
            }
        }

        return abort(401);
    }
}
