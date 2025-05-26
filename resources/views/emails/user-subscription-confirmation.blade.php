<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subscription Confirmed - {{ config('app.name') }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #28a745;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .content {
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            border: 1px solid #e9ecef;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            padding: 20px;
            color: #6c757d;
            font-size: 14px;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .btn:hover {
            background-color: #0056b3;
        }
        .subscription-details {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #28a745;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            background-color: #28a745;
            color: white;
            border-radius: 3px;
            font-size: 12px;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 Subscription Confirmed!</h1>
    </div>

    <div class="content">
        <h2>Hello {{ $user->name }}!</h2>
        
        <p>Great news! Your subscription to {{ config('app.name') }} has been successfully confirmed.</p>
        
        <div class="subscription-details">
            <h3>Subscription Details:</h3>
            <p><strong>Plan:</strong> {{ ucfirst($planType) }} Plan</p>
            <p><strong>Status:</strong> <span class="status-badge">{{ ucfirst($subscriptionStatus) }}</span></p>
            <p><strong>Account Email:</strong> {{ $user->email }}</p>
        </div>
        
        <p>You now have full access to all premium features. Here's what you can do next:</p>
        <ul>
            <li>Access all premium tools and features</li>
            <li>Enjoy unlimited usage based on your plan</li>
            <li>Get priority customer support</li>
            <li>Manage your subscription anytime</li>
        </ul>
        
        <div style="text-align: center;">
            <a href="{{ route('dashboard') }}" class="btn">Access Your Dashboard</a>
        </div>
        
        <p>If you have any questions about your subscription or need assistance, please don't hesitate to contact our support team.</p>
        
        <p>Thank you for choosing {{ config('app.name') }}!</p>
        <p>The {{ config('app.name') }} Team</p>
    </div>

    <div class="footer">
        <p>This email was sent to {{ $user->email }} regarding your subscription to {{ config('app.name') }}.</p>
        <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
    </div>
</body>
</html>