<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;


class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $key = $request->key;
        $user = User
            ::orderBy('created_at', 'DESC')->where('username', 'LIKE', '%' . $key . '%')
            ->paginate(10);
        return Inertia::render('AdminPanel/Pages/Master/User/User', [
            'user_data' => $user,
        ]);
    }

    
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {}

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $id = Auth::user();
        // dd($id);

        $request->validate([
            'name' => 'required',
            'email' => 'required',
            'username' => 'required',
            'password' => 'required',
            'level' => 'required',
        ]);


        $user = new User;
        $user->name = $request->name;
        $user->email = $request->email;
        $user->username = $request->username;
        $user->password = Hash::make($request->password);
        $user->level = $request->level;
        $user->alamat = $request->alamat;
        $user->save();

        if ($id = Auth::user()) {
            return to_route('user.index');
        } else {
            return to_route('login');
        }
       
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\User  $kategoriBarang
     * @return \Illuminate\Http\Response
     */
    public function show(User $id)
    {
        $id_customer = Auth::user()->id;
        $user = User::find($id_customer);
      
        return Inertia::render('AdminPanel/Pages/Master/User/User', [
            'user_data' => $user,
        ]);
        
    }

    public function profile(Request $request)
    {
        
        $id_customer = Auth::user()->id;
        $user = User::find($id_customer);
        // dd($user);
      
        return Inertia::render('Auth/ProfileCustomer', [
            'user_data' => $user,
        ]);
        
    } 

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\User  $kategoriBarang
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {}

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $kategoriBarang
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {

        $request->validate([
            'name' => 'required',
            'email' => 'required',
            'username' => 'required',
            'level' => 'required',
        ]);
        
        $user = User::find($id);
        $user->name = $request->name;
        $user->email = $request->email;
        $user->username = $request->username;
        $user->password = Hash::make($request->password);
        $user->level = $request->level;
        $user->alamat = $request->alamat;
        $user->save();
        return to_route('user.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $kategoriBarang
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // dd($id);
        $user = User::find($id);
        $user->delete();
        return to_route('user.index');
    }
}
