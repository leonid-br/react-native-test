import Svg, { Circle, Path } from 'react-native-svg';
export const AddSvg = props => {
    return (
        <Svg viewBox="0 0 100 100" {...props}>
            <Circle
                cx="12.5"
                cy="12.5"
                r="12"
                fill="#cbccc9"
                stroke="#808080"
            />
            <Path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M13 6H12V12H6V13H12V19H13V13H19V12H13V6Z"
                fill="#808080"
            />
        </Svg>
    );
};
