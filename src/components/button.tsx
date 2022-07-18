import { HTMLProps, ReactNode } from 'react';

export function ButtonGroup({ className, children }: { className?: string, children: ReactNode }) {
  return (
    <div className={"flex flex-row justify-center items-center "+ className}>
      <div className="flex gap-4">
        {children}
      </div>
    </div>
  )
}

type ButtonType = "primary"|"secondary";

interface ButtontProps extends HTMLProps<HTMLButtonElement> {
  buttonType:ButtonType,
}
export function Button(props: ButtontProps) {
  return (
    <button className={["h-10 px-6 font-semibold rounded-md", props.buttonType ==  "primary" ? "bg-black text-white" : "border border-slate-200 text-slate-900"].join(" ")}
      {...props} />
  );
}
