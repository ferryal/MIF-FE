import React, { InputHTMLAttributes } from "react";
import styles from "./styles.module.scss";

const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <input {...props} className={`${styles.input} ${props.className || ""}`} />
  );
};

export default Input;
