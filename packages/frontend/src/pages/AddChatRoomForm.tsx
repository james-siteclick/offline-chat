import { useForm } from "react-hook-form";

export type AddChatRoomFormProps = {
  onSubmit: (name: string) => void;
};

type AddChatRoomFormData = {
  name: string;
};

export default function AddChatRoomForm({ onSubmit }: AddChatRoomFormProps) {
  const { register, handleSubmit, reset } = useForm<AddChatRoomFormData>();

  return (
    <form
      onSubmit={handleSubmit(({ name }) => {
        onSubmit(name);
        reset();
      })}
    >
      <div className="mb-3">
        <label className="form-label" htmlFor="name">
          Chat room name
        </label>
        <input
          className="form-control"
          type="text"
          id="name"
          {...register("name")}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Add Chat Room
      </button>
    </form>
  );
}
