import { Field, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';

import { Background } from './Background';

export function Select<T>({
  value,
  setValue,
  options,
  label,
  fullWidth = false,
}: {
  value: T;
  setValue: (value: T) => void;
  options: { label: string; icon?: string; value: T }[];
  label?: string;
  fullWidth?: boolean;
}) {
  const selected = options.find((o) => o.value === value);

  return (
    <Field className={twMerge('flex items-center gap-4', fullWidth && 'w-full')}>
      {label && <Label className="text-nowrap">{label}</Label>}

      <Listbox value={value} onChange={setValue}>
        <ListboxButton
          className={twMerge(
            'border border-sky-800 rounded text-center h-[42px] transparent',
            selected?.icon && 'w-[42px]',
            fullWidth && 'w-full'
          )}
        >
          {selected?.icon ? (
            <img src={selected.icon} className="aspect-square" />
          ) : (
            <div className="flex items-center">
              <div className="w-full text-nowrap">{selected?.label}</div>
              <span className="">▼</span>
            </div>
          )}
        </ListboxButton>

        <ListboxOptions
          className="border border-sky-800 rounded mt-2 z-10 focus:outline-none"
          style={{ width: fullWidth ? 'var(--button-width)' : undefined }}
          anchor="bottom end"
        >
          <Background type="absolute" brightness={1.25} />
          {options.map((f) => (
            <ListboxOption
              key={f.label}
              value={f.value}
              className="group data-focus:bg-sky-900/35 data-selected:bg-sky-800/50 transition-colors"
            >
              <div className="flex gap-3 items-center text-left text-gray-300 px-2 py-1.5 my-2 select-none">
                <div className="w-4 invisible group-data-selected:visible">✓</div>
                {f.icon && <img src={f.icon} className="size-6" />}
                <span className="capitalize">{f.label}</span>
              </div>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </Field>
  );
}
