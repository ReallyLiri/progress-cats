import styled from "styled-components";
import { Center } from "src/components/Center";

export const Row = styled.div<{
  gap?: number,
  vertical?: boolean,
  flex?: number,
}>`
  ${ Center };
  width: 100%;
  justify-content: start;
  align-items: ${({vertical}) => vertical ? "start" : "center"};
  flex-direction: ${ ({vertical}) => vertical ? "column" : "row" };
  gap: ${ ({gap}) => gap || 20 }px;
  flex: ${({flex}) => flex ?? "unset"};
`
