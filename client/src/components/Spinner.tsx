export const Spinner = ({ inline = false }: { inline?: boolean }) => (
  <span
    role="status"
    aria-label="Loading"
    className={inline ? "inline-flex items-center" : "flex justify-center items-center py-16"}
  >
    <span className={`${inline ? "w-4 h-4 border-current border-t-transparent" : "w-6 h-6 border-gray-200 border-t-gray-900"} border-2 rounded-full animate-spin`} />
  </span>
);
