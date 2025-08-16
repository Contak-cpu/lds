import React from "react"
import { Label } from "./label"
import { Input } from "./input"
import { Textarea } from "./textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

interface FormFieldProps {
  label: string
  name: string
  type?: "text" | "email" | "tel" | "number" | "textarea" | "select"
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  required?: boolean
  options?: { value: string; label: string }[]
  className?: string
}

export function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required = false,
  options = [],
  className = "",
}: FormFieldProps) {
  const inputId = `field-${name}`
  const hasError = !!error

  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <Textarea
            id={inputId}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`${hasError ? "border-red-500 focus:border-red-500" : ""} ${className}`}
          />
        )
      case "select":
        return (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className={`${hasError ? "border-red-500 focus:border-red-500" : ""} ${className}`}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      default:
        return (
          <Input
            id={inputId}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`${hasError ? "border-red-500 focus:border-red-500" : ""} ${className}`}
          />
        )
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId} className="text-sm font-medium text-muted-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {renderInput()}
      {hasError && (
        <p className="text-red-500 text-xs mt-1 flex items-center">
          <span className="mr-1">⚠️</span>
          {error}
        </p>
      )}
    </div>
  )
}
