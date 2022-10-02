import styled from "styled-components";
import { Center } from "src/components/Center";

type Props = {
  label: string;
  onClick: () => void;
  color: string;
}

const StyledDiv = styled.div<Props>`
  ${Center};
  height: 40px;
  width: 80px;
  border-radius: 10px;
  background-color: ${ props => props.color };
  font-weight: bold;
  cursor: pointer;
`

export const Button = (props: Props) => {
  const {label} = props;
  return <StyledDiv { ...props }>
    { label }
  </StyledDiv>
}
