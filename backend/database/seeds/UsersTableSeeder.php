<?php

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name'      => 'Venda.la',
            'email'     => 'vendala@vendala.com.br',
            'password'  => bcrypt('vendala'),
            'role_id'   => Role::where('name', 'administrador')
                               ->first()
                               ->id
        ]);

        $role = Role::where('name', 'cliente')
                    ->first()
                    ->id;

        factory(User::class, 50)
            ->create([
                'role_id' => $role
            ]);
    }
}
