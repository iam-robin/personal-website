import clsx from "clsx";
import { RoughNotation } from "react-rough-notation";
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../tailwind.config.js'

const MarkerLink = (props) => {
  const fullConfig = resolveConfig(tailwindConfig);

  return (
    <RoughNotation
      type={props.type}
      show={true}
      color={fullConfig.theme.colors.blue[450]}
      strokeWidth={3}
      iterations={1}
      padding={props.type === "circle" ? [16,10] : 6}
      animationDelay={props.delay}
      animationDuration={400}
      multiline={true}
      className={clsx('font-bold', props.type === "circle" ? "mx-3": "")}
    >
      <span className={props.type !== "circle" ? "hover:text-blue" : ""}>
        {props.text}
      </span>
    </RoughNotation>
  );
}

export default MarkerLink;
