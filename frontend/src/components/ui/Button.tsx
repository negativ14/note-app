import type { IconType } from "react-icons"

interface CustomButtonProps {
  variant: "simple" | "purple" | "red"
  icon?: IconType
  isActive?: boolean
  title?: string
  size?: "sm" | "md" | "lg"
}

export const Button: React.FC<CustomButtonProps> = ({
  variant,
  icon: Icon,
  isActive = false,
  title,
  size = "md"
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-colors duration-200 rounded-full cursor-pointer focus:outline-none"

  const variantClasses = {
    simple: ` bg-gray-100 text-gray-500 hover:bg-gray-200 active:bg-gray-300`,
    purple: "bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800",
    red: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
  }

  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs gap-1",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-3",
  }

  const iconSize = {
    sm: "0.75rem",
    md: "1rem",
    lg: "1.25rem",
  }

  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    // Force square when only icon is present
  ].join(" ")

  return (
    <button 
      className={buttonClasses}
      aria-pressed={isActive}
    >
      {Icon && <Icon size={iconSize[size]} />}
      {title}
    </button>
  )
}