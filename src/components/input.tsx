import { ChangeEvent, HTMLProps, ReactNode, useCallback, useRef, useState } from 'react';
import { nanoid } from "nanoid";

export interface InputProps extends Omit<HTMLProps<HTMLInputElement>,"onChange"> {
  onChange?: (value:string) => void;
}
export function Input(props: InputProps) {
  const rProps = useRef(props); rProps.current = props;
  const onChange = useCallback((event:ChangeEvent<HTMLInputElement>) => {
    rProps.current.onChange?.(event.target.value);
  }, []);
  return (
    <input className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md" {...props} onChange={onChange} />
  )
}

export interface NumberInputProps extends Omit<HTMLProps<HTMLInputElement>,"onChange"> {
  onChange?: (value:number) => void;
}
export function NumberInput(props: NumberInputProps) {
  const rProps = useRef(props); rProps.current = props;
  const onChange = useCallback((event:ChangeEvent<HTMLInputElement>) => {
    rProps.current.onChange?.(event.target.valueAsNumber);
  }, []);
  return (
    <input type="number" {...props} onChange={onChange} />
  )
}

export interface SelectProps extends Omit<HTMLProps<HTMLSelectElement>,"onChange"> {
  onChange?: (value:string) => void;
}
export function Select(props: SelectProps) {
  const rProps = useRef(props); rProps.current = props;
  return (
    <select className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md w-full"
      {...props}
      onChange={(event) => { rProps.current.onChange?.(event.target.value) }}  />
  )
}

export function RadioGroup(props: { value:string, onChange:(v:string) => void, options:{ value:string, label:ReactNode }[] }) {
  const rProps = useRef(props); rProps.current = props;
  const { value, options } =  props;
  const [name] = useState(nanoid);
  const onChange = useCallback((event:ChangeEvent<HTMLInputElement>) => { rProps.current.onChange?.(event.target.value); }, []);
  return (
    <fieldset>
      {options.map(o => {
        const id = name+o.value
        return (
          <div key={o.value} className="flex items-center">
            <input type="radio"
              id={id}
              name={name}
              value={o.value}
              checked={value == o.value}
              onChange={onChange}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
            />
            <label htmlFor={id} className="ml-3 block text-sm font-medium text-gray-700">
              {o.label}
            </label>
          </div>
        );
      })}
    </fieldset>
  )
}

export function FormItem({ label, htmlFor, input }: { label:ReactNode, htmlFor:string, input:ReactNode }) {
  return (
    <>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 relative rounded-md shadow-sm">
        {input}
      </div>
    </>
  )
}
