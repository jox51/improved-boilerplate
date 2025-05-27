<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\Subscribed;
use App\Http\Middleware\Admin;
use App\Http\Middleware\VerifyCsrfToken;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);
        $middleware->validateCsrfTokens(except: [
            'stripe/*',
            'blog/webhook',
            VerifyCsrfToken::class,
        ]);
        $middleware->alias([
            'subscribed' => Subscribed::class,
            'admin' => Admin::class,
        ]);

        // Replace the default CSRF middleware with our custom one
        $middleware->web(replace: [
           
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
