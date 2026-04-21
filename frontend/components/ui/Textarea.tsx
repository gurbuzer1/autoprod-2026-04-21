import { forwardRef, TextareaHTMLAttributes } from 'react'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={[
          'flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
          'placeholder:text-gray-400 text-gray-900',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50 resize-y',
          className,
        ].join(' ')}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'
