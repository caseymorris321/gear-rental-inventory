 "use client";

  export default function DeleteButton({ id, action }: { id: string; action: (formData: FormData) => Promise<void> }) {
    return (
      <form action={action} onSubmit={(e) => { if (!confirm("Delete this item?")) e.preventDefault(); }}>
        <input type="hidden" name="id" value={id} />
        <button className="text-red-600 hover:text-red-900">Delete</button>
      </form>
    );
  }