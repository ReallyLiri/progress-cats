import React, { useCallback, useMemo, useState } from "react"
import styled from "styled-components";
import { ProgressBarDefinition } from "src/model/ProgressBarDefinition";
import { plural } from "pluralize";
import { Row } from "./Row";
import { InputNumber } from "antd";
import { useProgressBars } from "src/hooks/progressBars";

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
  margin: 50px;
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
  text-align: center;
  margin: 2px;
  border-radius: 16px;
  height: 20px;
  width: 20px;
  background-color: #FFA500;
`

type Props = {
  barId: string
}

export const ProgressBar = ({barId}: Props) => {
  const {barById, updateBar} = useProgressBars();
  const [value, setValue] = useState<number>(barById(barId).value)
  const bar = useMemo(() => barById(barId), [barId, barById]);
  const [delta, setDelta] = useState<number>(bar.defaultDelta);
  const percentageValue = useMemo(
    () => percentage(value, bar.fullValue),
    [value, bar.fullValue]
  );

  const updateValue = useCallback((add: boolean) => {
    let nextValue = value + (add ? delta : -1 * delta)
    if (nextValue < 0) {
      nextValue = 0
    }
    if (nextValue > bar.fullValue) {
      nextValue = bar.fullValue
    }
    updateBar(bar.id, nextValue)
    setValue(nextValue)
  }, [bar.id, bar.fullValue, value, delta, updateBar])

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
      <Action title="Add" onClick={ () => updateValue(true) }>+</Action>
      <Action title="Sub" onClick={ () => updateValue(false) }>-</Action>
    </ActionWrapper>
  </Row>
}
