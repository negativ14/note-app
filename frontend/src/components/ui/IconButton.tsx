import type { IconType } from "react-icons"

interface CustomButtonProps {
  variant: "simple" | "purple" | "red"
  icon: IconType
}

export const IconButton: React.FC<CustomButtonProps> = ({
  variant,
  icon: Icon,
}) => {
  const baseClasses =
    "inline-flex items-center justify-center p-2 text-xs font-medium transition-colors duration-200 rounded-full cursor-pointer focus:outline-none "

  const variantClasses = {
    simple: `bg-gray-100 text-gray-500 hover:bg-gray-200 active:bg-gray-300`,
    purple: "bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800",
    red: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
  }


  const buttonClasses = `${baseClasses} ${variantClasses[variant]}`

  return (
    <button className={buttonClasses}>
      <Icon className="w-3 h-3" />
    </button>
  )
}