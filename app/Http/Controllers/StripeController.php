<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StripeController extends Controller
{
    public function checkout($plan)
    {
        dd($plan);
    }

    /**
     * Handle successful checkout (legacy route)
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function success(Request $request)
    {
        return response()->json([
            'message' => 'Checkout successful!',
            'session_id' => $request->get('session_id')
        ]);
    }

    /**
     * Handle cancelled checkout (legacy route)
     *
     * @return \Illuminate\Http\Response
     */
    public function cancel()
    {
        return response()->json([
            'message' => 'Checkout cancelled.'
        ]);
    }
}
