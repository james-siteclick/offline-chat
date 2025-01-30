import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { authenticate } from "../data/auth";
import { useAppStore } from "../store/app";

type FormData = {
  username: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit } = useForm<FormData>();
  const [isLoginError, setLoginError] = useState(false);
  const appStore = useAppStore();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const userWithToken = await authenticate(data.username, data.password);
      appStore.login(userWithToken);
      navigate("/");
    } catch (err) {
      console.error(err);
      setLoginError(true);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Login</h1>
        {isLoginError ? <LoginAlert /> : null}
        <div className="mb-3">
          <label className="form-label">
            Username
            <input
              className="form-control"
              type="text"
              id="username"
              {...register("username")}
            />
          </label>
        </div>
        <div className="mb-3">
          <label className="form-label">
            Password
            <input
              className="form-control"
              type="password"
              {...register("password")}
            />
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
}

function LoginAlert() {
  return (
    <div className="alert alert-danger" role="alert">
      Login error, please try again
    </div>
  );
}
