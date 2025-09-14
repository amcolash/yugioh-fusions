import { useEffect, useState } from 'react';

export function Loader({ loading }: { loading: boolean }) {
  const [visible, setVisible] = useState(loading);

  useEffect(() => {
    if (loading) {
      setVisible(true);
    } else {
      setTimeout(() => setVisible(false), 1000);
    }
  }, [loading]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0">
      <img
        className={`absolute inset-0 m-auto h-40 animate-[spin_4000ms_linear_infinite] rounded transition-opacity duration-1000 ${loading ? 'opacity-100' : 'opacity-0'}`}
        src={`${import.meta.env.BASE_URL}/card-back.png`}
      />
    </div>
  );
}
