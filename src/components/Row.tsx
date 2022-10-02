import styled from "styled-components";
import { Center } from "src/components/Center";

export const Row = styled.div<{gap?: number}>`
  ${Center};
  justify-content: start;
  flex-direction: row;
  gap: ${({gap}) => gap || 20}px;
`
