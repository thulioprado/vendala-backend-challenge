<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;
use Hash;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required'
        ], [
            'email.required'    => 'Insira o seu e-mail.',
            'email.email'       => 'E-mail inválido.',
            'password.required' => 'Insira a sua senha.'
        ]);

        if ($validator->fails()) {
            return Response::json(['errors' => $validator->errors()], 422);
        }

        $token = Auth::attempt($request->only(['email', 'password']));

        if (!$token) {
            $validator->errors()->add('email', 'Por favor, verifique o seu e-mail.');
            $validator->errors()->add('password', 'Por favor, verifique a sua senha.');

            return Response::json(['errors' => $validator->errors()], 401);
        }

        return $this->respondWithToken($token);
    }

     /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function user()
    {
        return Response::json(Auth::user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        Auth::logout();

        return Response::json();
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(Auth::refresh());
    }

    /**
     * Ping pong
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function ping()
    {
        return Response::json('pong');
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return Response::json([
            'token'      => $token,
            'type'       => 'bearer',
            'expires_at' => Auth::factory()
                                ->getTTL() * 60,
            'user'       => Auth::user()
        ]);
    }
}
