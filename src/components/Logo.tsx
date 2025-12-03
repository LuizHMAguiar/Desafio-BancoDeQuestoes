import logo from "../../assets/logo.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-auto",
    md: "h-12 w-auto",
    lg: "h-16 w-auto",
  };

  return (
    <img
      src={logo}
      alt="Logo do Sistema de Questões"
      className={`${sizeClasses[size]} ${className}`}
    />
  );
}
