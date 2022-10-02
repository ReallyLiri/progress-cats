import { ProgressBarDefinition } from "src/model/ProgressBarDefinition";
import { Button } from "src/components/Button";
import { Row } from "src/components/Row";
import React, { useCallback, useState } from "react";
import { v4 as uuid } from 'uuid';
import { Input, InputNumber } from 'antd';
import styled from "styled-components";

const Wrapper = styled.div`
  height: fit-content;
  width: fit-content;
  padding: 16px;
  gap: 16px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  background-color: #eaeaea;
`

const Label = styled.div`
  font-weight: bold;
`

type Props = {
  add: (progressBar: ProgressBarDefinition) => void;
  cancel: () => void;
}

const getEmptyBar = (): ProgressBarDefinition => ({
  defaultDelta: 1,
  fullValue: 100,
  id: uuid(),
  name: "New progress bar",
  unit: "-",
  value: 0
})

export const AddBar = ({add, cancel}: Props) => {
  const [bar, setBar] = useState<ProgressBarDefinition>(getEmptyBar())
  const setProperty = useCallback((name: keyof ProgressBarDefinition, value: string | number) => {
    setBar(b => ({...b, [name]: value}))
  }, [setBar])

  return <Wrapper>
    <Row>
      <Label>Name</Label>
      <Input value={ bar.name } onChange={ (e) => setProperty("name", e.target.value) }/>
      <Label>Target</Label>
      <div><InputNumber min={1} value={bar.fullValue} onChange={(value) => value && setProperty("fullValue", value)}/></div>
      <Label>Unit</Label>
      <Input value={ bar.unit } onChange={ (e) => setProperty("unit", e.target.value) }/>
    </Row>
    <Row>
      <Button label="Done" onClick={ () => {
        add(bar);
        setBar(() => getEmptyBar())
      }
      } color="#FFA500"/>
      <Button label="Cancel" onClick={ () => {
        cancel();
        setBar(() => getEmptyBar())
      }
      } color="#a5a5a5"/>
    </Row>
  </Wrapper>
}