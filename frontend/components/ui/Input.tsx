import { forwardRef, InputHTMLAttributes } from 'react'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={[
          'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
          'placeholder:text-gray-400 text-gray-900',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        ].join(' ')}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
