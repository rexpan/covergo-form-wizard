import { ReactNode } from 'react';

export function PageCard({ title, children }: { title:ReactNode, children?:ReactNode }) {
  return (
    <div className="grid h-screen place-items-center">
      <div className="mt-4 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-900/5 rounded-xl p-8 w-1/2 sm:w-full md:w-1/2 ">
        <div className="pt-6 md:p-8 text-center space-y-4">
          <h1 className="text-xl font-medium">{title}</h1>
        </div>

        {children}
      </div>
    </div>
  )
}
