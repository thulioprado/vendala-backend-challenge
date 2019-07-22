<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function all(Request $request)
    {
        $users = [];

        if ($request->has('paginate')) {
            $users = User::paginate($request->paginate);
        } else {
            $users = User::all();
        }

        return Response::json($users);
    }

    /**
     * Display a listing of deleted users.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function allTrashed()
    {
        $users = User::onlyTrashed()->get();
        return Response::json($users);
    }

    /**
     * Store a newly created user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'      => 'required|string|min:4|max:100',
            'email'     => 'required|email|unique:users,email',
            'password'  => 'required'
        ], [
            'name.required'     => 'Insira o nome.',
            'name.string'       => 'Nome inválido.',
            'name.min'          => 'Nome curto demais. Tente um nome maior.',
            'name.max'          => 'Nome longo demais. Tente um nome menor.',
            'email.required'    => 'Insira o e-mail.',
            'email.email'       => 'E-mail inválido.',
            'email.unique'      => 'E-mail em uso.',
            'password.required' => 'Insira a senha.'
        ]);

        if ($validator->fails()) {
            return Response::json(['errors' => $validator->errors()], 422);
        }

        $user = null;

        DB::transaction(function () use ($request, &$user) {
            $user = User::create($request->only([
                            'name', 'email', 'password'
                        ]));
        });

        if ($user) {
            return $this->show($user->id);
        }

        return Response::json([], 500);
    }

    /**
     * Display the specified user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return Response::json([], 404);
        }

        return Response::json($user);
    }

    /**
     * Update the specified user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return Response::json([], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'      => 'required|string|min:4|max:100',
            'email'     => 'required|email|unique:users,email,'. $user->id
        ], [
            'name.required'     => 'Insira o nome.',
            'name.string'       => 'Nome inválido.',
            'name.min'          => 'Nome curto demais. Tente um nome maior.',
            'name.max'          => 'Nome longo demais. Tente um nome menor.',
            'email.required'    => 'Insira o e-mail.',
            'email.email'       => 'E-mail inválido.',
            'email.unique'      => 'E-mail em uso.'
        ]);

        if ($validator->fails()) {
            return Response::json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only([
            'name', 'email', 'password'
        ]);

        if ($data['password'] === null) {
            unset($data['password']);
        }

        DB::transaction(function () use ($data, &$user) {
            $user->update($data);
        });

        return $this->show($user->id);
    }

    /**
     * Remove the specified user from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return Response::json([], 404);
        }

        DB::transaction(function () use ($user) {
            $user->delete();
        });

        return Response::json();
    }

    /**
     * Forcibly remove the specified user from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function forceDestroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return Response::json([], 404);
        }

        DB::transaction(function () use ($user) {
            $user->forceDelete();
        });

        return Response::json();
    }
}
