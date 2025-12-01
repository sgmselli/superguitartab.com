class UserAlreadyExists(Exception):
    def __init__(self, email: str):
        """
           Raised when attempting to create a user with an email that already exists.

           Args:
               email (str): User email.
           """
        self.email = email
        super().__init__(f"User with email '{email}' already exists.")

class UserEmailDoesNotExist(Exception):
    def __init__(self, email: str):
        """
           Raised when attempting to fetch a user with an email that does not exist.

           Args:
               email (str): User email.
        """
        self.email = email
        super().__init__(f"User with email '{email}' does not exists.")


class UserGoogleIdDoesNotExist(Exception):
    def __init__(self, google_id: str):
        """
           Raised when attempting to fetch a user with a Google ID that does not exist.

           Args:
               google_id (str): User Google ID.
        """
        self.google_id = google_id
        super().__init__(f"User with Google ID '{google_id}' does not exists.")


class UserIdDoesNotExist(Exception):
    def __init__(self, user_id: int):
        """
           Raised when attempting to fetch a user with an ID that does not exist.

           Args:
               user_id (int): User ID.
        """
        self.user_id = user_id
        super().__init__(f"User with ID '{str(user_id)}' does not exists.")
