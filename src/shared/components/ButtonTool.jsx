import {ReactNode, cloneElement} from 'react';

/**
 * Reusable button with optional icon and label
 * 
 * @param {{
 *   icon?: { src: string | ReactNode, alt?: string, width?: number, height?: number },
 *   label?: string,
 *   isActive?: boolean,
 *   disabled?: boolean,
 *   onClick?: () => void,
 *   layout?: 'row' | 'column',
 *   className?: string,
 * }} props 
 */
export const ButtonTool = ({
  icon,
  label = '',
  isActive = false,
  disabled = false,
  onClick,
  layout = 'column',
  className = '',
}) => {
  const flexLayout = layout === 'row' ? 'flex-row gap-1' : 'flex-col';

  const iconElement = icon ? (
    typeof icon.src === 'string' ? (
      <img
        src={icon.src}
        alt={icon.alt || 'icon'}
        style={{
          width: icon.width || 24,
          height: icon.height || 24,
        }}
        className={`object-contain transition-all ${
          disabled ? 'grayscale opacity-50' : ''
        }`}
      />
    ) : (
      cloneElement(icon.src, {
        width: icon.width || 24,
        height: icon.height || 24,
        className: `object-contain transition-all ${
          disabled ? 'grayscale opacity-50' : ''
        } ${icon.src.props.className || ''}`.trim(),
      })
    )
  ) : null;

  const labelElement = label ? (
    <span
      className={`mt-0.5 text-[11px] ${
        disabled
          ? 'text-gray-300'
          : 'text-gray-900 font-medium'
      }`}
    >
      {label}
    </span>
  ) : null;

  return (
    <button
      type="button"
      title={icon?.alt || label}
      disabled={disabled}
      onClick={onClick}
      className={`flex ${flexLayout} items-center justify-center p-1 rounded text-[11px] transition-colors
        ${isActive ? 'text-[#49b0f2] bg-blue-100' : 'hover:text-gray-900'}
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {iconElement}
      {labelElement}
    </button>
  );
};
