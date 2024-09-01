import { Tooltip as AntTooltip } from 'antd';
import themeColors from "../configs/theme";
import Button from './Button';

const TooltipButton = ({
  backgroundColor = themeColors.btn.primary,
  type = 'primary',
  loading = false,
  name,
  margin = '0 0 0 10px',
  title,
  tooltipText,
  hasVerticalSpace = true,
  iconClass,
  onClick = (e) => { e?.preventDefault() },
  ...others
}) => {
  return (
    <AntTooltip title={tooltipText} color={backgroundColor}>
      <Button onClick={onClick} margin={margin} type={type} backgroundColor={backgroundColor} name={name} hasVerticalSpace={hasVerticalSpace} {...others}>
        {iconClass && <i class={`fa ${iconClass}`} aria-hidden="true"></i>}
        {title}
      </Button>
    </AntTooltip>
  );
};
export default TooltipButton;