import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { getRandomValues } from 'crypto';

export function Select<T>({
  value,
  setValue,
  options,
  fullWidth = false,
}: {
  value: T;
  setValue: (value: T) => void;
  options: { label: string; icon?: string; value: T }[];
  fullWidth?: boolean;
}) {
  const selected = options.find((o) => o.value === value);

  return (
    <Listbox value={value} onChange={setValue}>
      <ListboxButton className="border border-gray-500 rounded py-1 px-3 text-center h-9 transparent relative">
        {selected?.icon ? (
          <img src={selected.icon} className="size-5" />
        ) : (
          <>
            {selected?.label}
            <span className="absolute right-2 top-1.5">▼</span>
          </>
        )}
      </ListboxButton>

      <ListboxOptions
        className="bg-[#161625] border border-gray-500 rounded mt-2"
        style={{ width: fullWidth ? 'var(--button-width)' : undefined }}
        anchor="bottom end"
      >
        {options.map((f) => (
          <ListboxOption key={f.label} value={f.value}>
            <div className="flex items-center text-left text-gray-300 px-2 py-1.5 my-2 hover:bg-sky-900 select-none">
              <div className="w-6">{value === f.value && '✓'}</div>
              {f.icon && <img src={f.icon} className="size-6 mr-2" />}
              <span className="capitalize">{f.label}</span>
            </div>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
}
