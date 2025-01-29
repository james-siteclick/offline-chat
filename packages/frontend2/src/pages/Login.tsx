import { useForm } from "react-hook-form";

type FormData = {
  username: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = (data: FormData) => console.log(data);

  return (
    <div className="d-flex justify-content-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Login</h1>
        <label>
          Username
          <input
            className="form-control"
            type="text"
            id="username"
            {...register("username")}
          />
        </label>
        <label>
          Password
          <input
            className="form-control"
            type="password"
            {...register("password")}
          />
        </label>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
}
