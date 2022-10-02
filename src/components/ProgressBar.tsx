import React, { useCallback, useMemo, useState } from "react"
import styled from "styled-components";
import { ProgressBarDefinition } from "src/model/ProgressBarDefinition";
import { plural } from "pluralize";
import { Row } from "./Row";
import { InputNumber, Modal } from "antd";

const percentage = (value: number, fullValue: number) => {
  const portion = value / fullValue
  return (portion > 1 ? 1 : portion) * 100
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
  background-color: #a5a5a5;
  border-radius: 50px;
  margin: 8px;
`

const Filler = styled.div<{ percentage: number }>`
  height: 100%;
  width: ${ ({percentage}) => percentage }%;
  background-color: #FFA500;
  border-radius: inherit;
  text-align: end;
  transition: width 1s ease-in-out;
`

const Title = styled.div`
  padding: 5px;
  color: black;
  font-weight: bold;
`

const Label = styled.span`
  padding: 5px;
  color: white;
  font-weight: bold;
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
  background-color: #FFA500;
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
    <Container>
      <Filler percentage={ percentageValue }>
        <Label>
          { `${ percentageValue }% ${ displayUnit(bar) }`.trim() }
        </Label>
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
    >Deleting {bar.name} forever!</Modal>
  </Row>
}
