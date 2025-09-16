from app import app

if __name__ == '__main__':
    # Running on host='0.0.0.0' makes the app accessible on your local network.
    # Flask will automatically display the local IP address for you.
    app.run(host='0.0.0.0', port=5000, debug=True)