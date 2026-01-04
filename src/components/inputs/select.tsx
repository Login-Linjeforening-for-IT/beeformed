'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Search } from 'lucide-react'
import Field from './field'

type Option = {
    value: string
    label: string
    disabled?: boolean
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string
    error?: string
    description?: string
    options: Option[]
    searchable?: boolean
    placeholder?: string
}

export default function Select({
    label,
    error,
    description,
    options,
    searchable = false,
    placeholder = 'Select an option...',
    value,
    onChange,
    ...props
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const dropdownRef = useRef<HTMLDivElement>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)

    const selectedOption = options.find(option => option.value === value)

    const filteredOptions = searchable
        ? options.filter(option =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : options

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                setSearchTerm('')
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        if (isOpen && searchable && searchInputRef.current) {
            searchInputRef.current.focus()
        }
    }, [isOpen, searchable])

    function handleSelect(option: Option) {
        if (option.disabled) return
        const syntheticEvent = {
            target: { value: option.value, name: props.name }
        } as React.ChangeEvent<HTMLSelectElement>
        onChange?.(syntheticEvent)
        setIsOpen(false)
        setSearchTerm('')
    }

    function handleKeyDown(event: React.KeyboardEvent) {
        if (event.key === 'Escape') {
            setIsOpen(false)
            setSearchTerm('')
        } else if (event.key === 'Enter' && !isOpen) {
            setIsOpen(true)
        }
    }

    const errorClasses = error
        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
        : ''

    return (
        <Field
            label={label}
            error={error}
            description={description}
            required={props.required}
        >
            <div className='relative' ref={dropdownRef}>
                <button
                    type='button'
                    onClick={() => !props.disabled && setIsOpen(!isOpen)}
                    onKeyDown={handleKeyDown}
                    disabled={props.disabled}
                    className={`
                        w-full px-3 py-2 text-left
                        bg-login-800 border rounded-md
                        text-login-50 placeholder-login-300
                        ring-login-300 border-login-300
                        focus:outline-none focus:ring-1 focus:ring-login-100 focus:border-login-100
                        transition-colors flex items-center justify-between
                        ${errorClasses}
                        ${props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-login-300'}
                    `}
                    aria-haspopup='listbox'
                    aria-expanded={isOpen}
                >
                    <span className={selectedOption ? 'text-login-50' : 'text-login-300'}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-login-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className={`
                        absolute z-50 w-full mt-1 bg-login-800 border border-login-500
                        rounded-md shadow-lg max-h-60 overflow-auto
                    `}>
                        {searchable && (
                            <div className='p-2 border-b border-login-600'>
                                <div className='relative'>
                                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-login-400' />
                                    <input
                                        ref={searchInputRef}
                                        type='text'
                                        placeholder='Search...'
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className={`
                                            w-full pl-10 pr-3 py-2 bg-login-700 border border-login-500 rounded
                                            text-login-50 placeholder-login-300 focus:outline-none focus:ring-1
                                            focus:ring-login-100 focus:border-login-100
                                        `}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </div>
                        )}

                        <div className='py-1'>
                            {filteredOptions.length === 0 ? (
                                <div className='px-3 py-2 text-login-300 text-sm'>
                                    {searchable && searchTerm ? 'No options found' : 'No options available'}
                                </div>
                            ) : (
                                filteredOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type='button'
                                        onClick={() => handleSelect(option)}
                                        disabled={option.disabled}
                                        className={`
                                            w-full px-3 py-2 text-left flex items-center justify-between
                                            hover:bg-login-700 focus:bg-login-700 focus:outline-none
                                            ${option.disabled
                                        ? 'opacity-50 cursor-not-allowed text-login-400'
                                        : 'text-login-50 cursor-pointer'
                                    }
                                            ${value === option.value ? 'bg-login-600' : ''}
                                        `.trim()}
                                    >
                                        <span>{option.label}</span>
                                        {value === option.value && (
                                            <Check className='w-4 h-4 text-login-100' />
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Field>
    )
}