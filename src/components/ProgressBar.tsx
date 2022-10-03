import React, { useCallback, useMemo, useState } from "react"
import styled from "styled-components";
import { ProgressBarDefinition } from "src/model/ProgressBarDefinition";
import { plural } from "pluralize";
import { Row } from "./Row";
import { InputNumber, Modal } from "antd";
import { Theme } from "src/util/theme";
import { Cat } from "src/components/Cat";
import { useIsMobile } from "src/util/isMobile";

const percentage = (value: number, fullValue: number) => {
  const portion = value / fullValue
  const percentage = (portion > 1 ? 1 : portion) * 100
  return Math.round(percentage)
}

const displayUnit = (bar: ProgressBarDefinition) => {
  if (bar.unit.length <= 1) {
    return ""
  }
  return plural(bar.unit)
}

const Container = styled.div`
  height: 24px;
  width: 100%;
  background-color: ${ Theme.BACKGROUND };
  border-radius: 50px;
  margin: 8px;
`

const paddedPercentage = (percentage: number, isMobile: boolean) => {
  const PADDING = isMobile ? 48 : 16;
  const value = percentage / 100
  return PADDING + value * (100 - PADDING);
}

const Filler = styled.div<{ percentage: number, color: string, isMobile: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: end;
  height: 100%;
  width: ${ ({percentage, isMobile}) => paddedPercentage(percentage, isMobile) }%;
  max-width: 100%;
  background-color: ${ Theme.ACTION_MAIN };
  border-radius: inherit;
  text-align: end;
  transition: width 1s ease-in-out;
`

const FillerFiller = styled.div`
  width: 100%;
  flex: 1;
`

const Title = styled.div`
  padding: 5px;
  color: black;
  font-weight: bold;
`

const Label = styled.span<{isSubLabel?: boolean}>`
  text-align: end;
  padding: 5px;
  color: white;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  font-size: ${({isSubLabel}) => isSubLabel ? 10 : 14}px;
`

const StyledCat = styled(Cat)`
  align-self: end;
`

const StyledInputNumber = styled(InputNumber)`
  width: 80px;
`

const ActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
`

const Action = styled.div`
  cursor: pointer;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  margin: 2px;
  padding-top: 3px;
  border-radius: 16px;
  height: 24px;
  width: 24px;
  background-color: ${ Theme.ACTION_MAIN };
`

const Delete = styled.div`
  cursor: pointer;
  filter: grayscale(1);
`

type Props = {
  bar: ProgressBarDefinition,
  updateBar: (id: string, value: number) => void,
  removeBar: (id: string) => void
}

function percentageDisplay(percentageValue: number, bar: ProgressBarDefinition) {
  return `${ percentageValue }% ${ displayUnit(bar) }`.trim();
}

function valueDisplay(bar: ProgressBarDefinition) {
  return `(${bar.value}/${bar.fullValue})`;
}

const ActionRow = styled(Row)<{isMobile: boolean}>`
  margin-top: -32px;
  justify-content: end;
`

const Assign = styled(Action)`
  padding-top: 4px;
  padding-right: 1px;
  font-size: 20px;
  color: #635342;
`

export const ProgressBar = ({bar, updateBar, removeBar}: Props) => {
  const {isMobile} = useIsMobile();
  const [delta, setDelta] = useState<number>(bar.defaultDelta);
  const [explicitValue, setExplicitValue] = useState<number>(bar.value);
  const [isModalOpen, setIdModalOpen] = useState(false);
  const percentageValue = useMemo(
    () => percentage(bar.value, bar.fullValue),
    [bar.value, bar.fullValue]
  );

  const updateValue = useCallback((add: boolean) => {
    let nextValue = bar.value + (add ? delta : -1 * delta)
    if (nextValue < 0) {
      nextValue = 0
    }
    if (nextValue > bar.fullValue) {
      nextValue = bar.fullValue
    }
    updateBar(bar.id, nextValue)
  }, [bar.id, bar.fullValue, bar.value, delta, updateBar]);

  return <Row gap={ 0 } vertical={isMobile}>
    <Row gap={4} flex={1}>
      <Title>{ bar.name }</Title>
      <Container title={ `${percentageDisplay(percentageValue, bar)} ${valueDisplay(bar)}` }>
        <Filler percentage={ percentageValue } color={ bar.color } isMobile={isMobile}>
          <StyledCat color={ bar.color }/>
          <FillerFiller/>
          <Label>{ percentageDisplay(percentageValue, bar) }</Label>
          {
            percentageValue > 30 && <Label isSubLabel>{ valueDisplay(bar) }</Label>
          }
        </Filler>
      </Container>
    </Row>
    <ActionRow gap={4} flex={0} isMobile={isMobile}>
      <StyledInputNumber value={ explicitValue } onChange={ value => value && setExplicitValue(value as number) }/>
      <Assign title="Assign" onClick={ () => updateBar(bar.id, explicitValue) }>↵</Assign>
      <StyledInputNumber value={ delta } onChange={ value => value && setDelta(value as number) }/>
      <ActionWrapper>
        <Action title="Add" onClick={ () => updateValue(true) }>➕</Action>
        <Action title="Sub" onClick={ () => updateValue(false) }>➖</Action>
      </ActionWrapper>
      <Delete title="Delete" onClick={ () => setIdModalOpen(true) }>❌</Delete>
    </ActionRow>
    <Modal title="Are you sure?"
           open={ isModalOpen }
           onOk={ () => {
             setIdModalOpen(false);
             removeBar(bar.id);
           } } onCancel={ () => setIdModalOpen(false) }
    >Deleting { bar.name } forever!</Modal>
  </Row>
}
