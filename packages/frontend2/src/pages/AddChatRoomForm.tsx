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
      <label>
        Chat room name
        <input
          className="form-control"
          type="text"
          id="name"
          {...register("name")}
        />
      </label>
      <button type="submit" className="btn btn-primary">
        Add Chat Room
      </button>
    </form>
  );
}
