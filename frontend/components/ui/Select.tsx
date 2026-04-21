import { forwardRef, SelectHTMLAttributes } from 'react'

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={[
          'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
          'text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        ].join(' ')}
        {...props}
      >
        {children}
      </select>
    )
  }
)

Select.displayName = 'Select'
