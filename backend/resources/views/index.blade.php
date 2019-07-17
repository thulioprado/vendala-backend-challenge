<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{ config('app.name') }}</title>
    <style>
        html,
        body {
            width: 100%;
            height: 100%;
            overflow: hidden;
        }

        img {
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -200px; /* Half the height */
            margin-left: -448px; /* Half the width */
        }
    </style>
</head>
<body>
    <img src="{{ asset('images/logo.png') }}" />
</body>
</html>
