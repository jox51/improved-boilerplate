<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\AdminNewUserRegistrationEmail;
use App\Mail\WelcomeUserEmail;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);
        // Log::info('Request: ' . $request->all());

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);


        event(new Registered($user));


        // Send welcome email to the new user
        Mail::to($user->email)->send(new WelcomeUserEmail($user));

        // Send notification email to admin
        $adminEmail = config('mail.from.address');

        if ($adminEmail && $adminEmail !== 'hello@example.com') {
            Mail::to($adminEmail)->send(new AdminNewUserRegistrationEmail($user));
        }

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
