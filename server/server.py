from app import app
import socket

if __name__ == '__main__':
    # This logic makes the app accessible on your local network
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # doesn't even have to be reachable
        s.connect(('10.255.255.255', 1))
        local_ip = s.getsockname()[0]
    except Exception:
        local_ip = '127.0.0.1'
    finally:
        s.close()
    
    app.run(host='0.0.0.0', port=5000, debug=True)