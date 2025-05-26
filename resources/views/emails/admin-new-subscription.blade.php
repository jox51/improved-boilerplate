<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Subscription - {{ config('app.name') }}</title>
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
            background-color: #007bff;
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
        .user-details {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #007bff;
        }
        .subscription-details {
            background-color: #e8f5e8;
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
        .alert {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 12px;
            border-radius: 4px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📈 New Subscription Alert</h1>
    </div>

    <div class="content">
        <h2>New Subscription Notification</h2>
        
        <p>A new user has successfully subscribed to {{ config('app.name') }}. Here are the details:</p>
        
        <div class="user-details">
            <h3>User Information:</h3>
            <p><strong>Name:</strong> {{ $user->name }}</p>
            <p><strong>Email:</strong> {{ $user->email }}</p>
            <p><strong>User ID:</strong> #{{ $user->id }}</p>
            <p><strong>Registration Date:</strong> {{ $user->created_at->format('M d, Y \a\t g:i A') }}</p>
        </div>
        
        <div class="subscription-details">
            <h3>Subscription Details:</h3>
            <p><strong>Plan Type:</strong> {{ ucfirst($planType) }} Plan</p>
            <p><strong>Status:</strong> <span class="status-badge">{{ ucfirst($subscriptionStatus) }}</span></p>
            <p><strong>Subscription Date:</strong> {{ now()->format('M d, Y \a\t g:i A') }}</p>
        </div>
        
        <div class="alert">
            <strong>Action Required:</strong> You may want to review the new subscription and ensure the user has proper access to premium features.
        </div>
        
        <p>This notification was automatically generated when the subscription was successfully processed through Stripe.</p>
        
        <p>Best regards,<br>{{ config('app.name') }} System</p>
    </div>

    <div class="footer">
        <p>This is an automated notification sent to {{ config('mail.from.address') }} regarding new subscriptions.</p>
        <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
    </div>
</body>
</html>