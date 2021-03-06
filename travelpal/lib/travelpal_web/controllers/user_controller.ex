defmodule TravelpalWeb.UserController do
  use TravelpalWeb, :controller

  alias Travelpal.Users
  alias Travelpal.Users.User
  alias Travelpal.Email
  alias Travelpal.Mailer

  action_fallback TravelpalWeb.FallbackController

  def index(conn, _params) do
    users = Users.list_users()
    render(conn, "index.json", users: users)
  end

  def create(conn, %{"user" => user_params}) do
    with {:ok, %User{} = user} <- Users.create_user(user_params) do
      # sends a welcome email when an account gets created
      Email.welcome_email(user_params["email"], user_params["name"])
      |> Mailer.deliver_now()

      conn
      |> put_status(:created)
      |> put_resp_header("location", page_path(conn, :index))
      |> render("show.json", user: user)
    end
  end

  def show(conn, %{"id" => id}) do
    user = Users.get_user!(id)
    render(conn, "show.json", user: user)
  end

  def update(conn, %{"user" => user_params}) do
    user = Users.get_user!(Map.get(user_params, "id"))
    Email.updated_account_email(user.email, user.name, user.username)
    |> Mailer.deliver_now()

    with {:ok, %User{} = user} <- Users.update_user(user, user_params) do
      conn
      |> put_status(:ok)
      |> put_resp_header("location", page_path(conn, :index))
      |> render("index.json", users: Users.list_users())
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Users.get_user!(id)
    Email.deleted_account_email(user.email, user.name, user.username)

    with {:ok, %User{}} <- Users.delete_user(user) do
      send_resp(conn, :no_content, "")
    end
  end
end
