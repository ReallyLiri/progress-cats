import React, { useState } from 'react';
import styled from "styled-components";
import { Button } from "src/components/Button";
import { Center } from "src/components/Center";
import { useProgressBars } from "src/hooks/progressBars";
import { ProgressBar } from "src/components/ProgressBar";
import { AddBar } from "src/components/AddBar";
import { ProgressBarDefinition } from './model/ProgressBarDefinition';


const Container = styled.div`
  ${ Center };
  height: 100vh;
  width: 100vw;
  background-color: black;
  flex-direction: column;
  gap: 40px;
`

const Title = styled.div`
  color: white;
  font-size: 40px;
  font-weight: bold;
`

const Body = styled.div`
  height: 75vh;
  width: 75vw;
  background-color: white;
  border-radius: 40px;
  padding: 40px;
  overflow-y: auto;
`

function App() {
  const [isAdding, setAdding] = useState<boolean>();
  const {barIds, addBar} = useProgressBars();

  return (
    <Container>
      <Title>Progress Cats</Title>
      <Body>
        {
          barIds.map(barId =>
            <ProgressBar
              key={ barId }
              barId={ barId }
            />
          )
        }
        {
          isAdding
            ? <AddBar add={ (bar: ProgressBarDefinition) => {
              addBar(bar);
              setAdding(false);
            } } cancel={ () => setAdding(false) }/>
            : <Button onClick={ () => setAdding(true) } color="#FFA500" label="Add"/>
        }
      </Body>
    </Container>
  );
}

export default App;
