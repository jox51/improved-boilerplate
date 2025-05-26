<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to {{ config('app.name') }}</title>
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
            background-color: #f8f9fa;
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
    </style>
</head>
<body>
    <div class="header">
        <h1>Welcome to {{ config('app.name') }}!</h1>
    </div>

    <div class="content">
        <h2>Hello {{ $user->name }}!</h2>
        
        <p>Thank you for registering with {{ config('app.name') }}. We're excited to have you on board!</p>
        
        <p>Your account has been successfully created with the email address: <strong>{{ $user->email }}</strong></p>
        
        <p>Here's what you can do next:</p>
        <ul>
            <li>Explore our features and tools</li>
            <li>Complete your profile setup</li>
            <li>Start using our services</li>
        </ul>
        
        <div style="text-align: center;">
            <a href="{{ route('dashboard') }}" class="btn">Get Started</a>
        </div>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        
        <p>Welcome aboard!</p>
        <p>The {{ config('app.name') }} Team</p>
    </div>

    <div class="footer">
        <p>This email was sent to {{ $user->email }} because you registered for an account on {{ config('app.name') }}.</p>
        <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
    </div>
</body>
</html>