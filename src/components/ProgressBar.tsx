import React, { useCallback, useMemo, useState } from "react"
import styled from "styled-components";
import { ProgressBarDefinition } from "src/model/ProgressBarDefinition";
import { plural } from "pluralize";
import { Row } from "./Row";
import { InputNumber, Modal } from "antd";
import { Theme } from "src/util/theme";
import { Cat } from "src/components/Cat";

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

const paddedPercentage = (percentage: number) => {
  const PADDING = 16;
  const value = percentage / 100
  return PADDING + value * (100 - PADDING);
}

const Filler = styled.div<{ percentage: number, color: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: end;
  height: 100%;
  width: ${ ({percentage}) => paddedPercentage(percentage) }%;
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

const Label = styled.span`
  text-align: end;
  padding: 5px;
  color: white;
  font-weight: bold;
  white-space: pre-wrap;
  overflow: hidden;
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

function barText(percentageValue: number, bar: ProgressBarDefinition) {
  return `${ percentageValue }% ${ displayUnit(bar) }`.trim();
}

export const ProgressBar = ({bar, updateBar, removeBar}: Props) => {
  const [delta, setDelta] = useState<number>(bar.defaultDelta);
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
  }, [bar.id, bar.fullValue, bar.value, delta, updateBar])

  return <Row gap={ 4 }>
    <Title>{ bar.name }</Title>
    <Container title={ barText(percentageValue, bar) }>
      <Filler percentage={ percentageValue } color={ bar.color }>
        <StyledCat color={ bar.color }/>
        <FillerFiller/>
        <Label>{ barText(percentageValue, bar) }</Label>
      </Filler>
    </Container>
    <StyledInputNumber value={ delta } onChange={ value => value && setDelta(value as number) }/>
    <ActionWrapper>
      <Action title="Add" onClick={ () => updateValue(true) }>➕</Action>
      <Action title="Sub" onClick={ () => updateValue(false) }>➖</Action>
    </ActionWrapper>
    <Delete title="Delete" onClick={ () => setIdModalOpen(true) }>❌</Delete>
    <Modal title="Are you sure?"
           open={ isModalOpen }
           onOk={ () => {
             setIdModalOpen(false);
             removeBar(bar.id);
           } } onCancel={ () => setIdModalOpen(false) }
    >Deleting { bar.name } forever!</Modal>
  </Row>
}
