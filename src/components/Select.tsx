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
            'transparent h-[42px] rounded border border-sky-800 text-center',
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
          className="z-10 mt-2 rounded border border-sky-800 focus:outline-none"
          style={{ width: fullWidth ? 'var(--button-width)' : undefined }}
          anchor="bottom end"
        >
          <Background type="absolute" brightness={1.25} />
          {options.map((f) => (
            <ListboxOption
              key={f.label}
              value={f.value}
              className="group transition-colors data-focus:bg-sky-900/35 data-selected:bg-sky-800/50"
            >
              <div className="my-2 flex items-center gap-3 px-2 py-1.5 text-left text-gray-300 select-none">
                <div className="invisible w-4 group-data-selected:visible">✓</div>
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
