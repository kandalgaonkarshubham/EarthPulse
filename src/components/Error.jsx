export default function Error({ error }) {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center font-bold font-Syne text-red-500 text-lg">
      {error}
    </div>
  );
}
