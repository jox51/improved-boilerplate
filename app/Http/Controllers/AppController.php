<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AppController extends Controller
{
    /**
     * Display the main application view.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('App/Index', [
            // You can pass any initial props here if needed
        ]);
    }
}