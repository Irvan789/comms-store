import styles from './Button.module.scss'

type PropTypes = {
    type: 'button' | 'submit' | 'reset' | undefined
    onClick?: () => void
    children: React.ReactNode
    variant?: string
    className?: string
    disabled?: boolean
}

const Button = (props: PropTypes) => {
    const {
        type,
        onClick,
        children,
        variant = 'primary',
        className,
        disabled
    } = props
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${styles.button} ${styles[variant]} ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    )
}

export default Button
