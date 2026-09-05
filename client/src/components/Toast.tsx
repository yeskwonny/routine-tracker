interface ToastProps {
  message: string;
}

export const Toast = ({ message }: ToastProps) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg animate-fade-in z-50">
      <span>✓</span>
      {message}
    </div>
  );
};
