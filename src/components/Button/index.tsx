import React from "react";
import { IconType } from "react-icons";
import styles from "./styles.module.scss";

export interface ButtonProps {
  type?: "button" | "submit";
  variant?: "remove" | "add" | "refresh" | "submit" | "default";
  onClick?: () => void;
  disabled?: boolean;
  icon?: IconType;
  label: string;
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  variant = "default",
  onClick,
  disabled = false,
  icon: Icon,
  label,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.btn} ${styles[`btn--${variant}`]}`}
    >
      {Icon && <Icon className={label && styles.icon} />}
      {label && <span>{label}</span>}
    </button>
  );
};

export default Button;
