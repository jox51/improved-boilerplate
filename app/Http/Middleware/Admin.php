<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class Admin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Debug logging
        Log::info('Admin Middleware Check', [
            'user_email' => $request->user()->email ?? 'no user',
            'admin_users' => config('admin.users'),
            'is_admin' => in_array($request->user()->email, config('admin.users')),
        ]);
        
        if (!in_array($request->user()->email, config('admin.users'))) {
            Log::info('Admin Middleware: Redirecting user to home');
            // Redirect user to billing page and ask them to subscribe...
            return redirect('/');
        }
        Log::info('Admin Middleware: User passed check');
        return $next($request);
    }
}
