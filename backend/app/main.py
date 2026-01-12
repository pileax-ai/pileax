from app.app_factory import create_app
from app.app_lifecycle import start_server

# App
app = create_app()

# python app/main.my
if __name__ == "__main__":
    start_server(app)
