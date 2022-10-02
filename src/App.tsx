import React, { useCallback, useReducer, useState } from 'react';
import styled from "styled-components";
import { Button } from "src/components/Button";
import { Center } from "src/components/Center";
import { ProgressBar } from "src/components/ProgressBar";
import { AddBar } from "src/components/AddBar";
import { ProgressBarDefinition } from './model/ProgressBarDefinition';
import { loadFromStorage, saveToStorage } from './util/storage';


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

const Item = styled.div`
  :not(:first-child) {
    margin-top: 16px;
  }

  :last-child {
    margin-top: 32px;
  }
`

function App() {
  const [isAdding, setAdding] = useState<boolean>();
  const [bars, setBars] = useState<Record<string, ProgressBarDefinition>>(loadFromStorage);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const persistAndSet = useCallback((mutate: (value: Record<string, ProgressBarDefinition>) => void) => {
    setBars(value => {
      mutate(value);
      saveToStorage(value);
      forceUpdate();
      return value;
    });
  }, []);

  const removeBar = useCallback(
    (id: string) => persistAndSet(map => (delete map[id])),
    [persistAndSet]
  );
  const updateBar = useCallback(
    (id: string, value: number) => persistAndSet(map => (map[id].value = value)),
    [persistAndSet]
  );
  const addBar = useCallback(
    (bar: ProgressBarDefinition) => persistAndSet(map => map[bar.id] = bar),
    [persistAndSet]
  );

  return (
    <Container>
      <Title>Progress Cats</Title>
      <Body>
        {
          Object.values(bars).map(bar =>
            <Item key={ bar.id }>
              <ProgressBar bar={ bar } removeBar={ removeBar } updateBar={ updateBar }/>
            </Item>
          )
        }
        <Item>
          {
            isAdding
              ? <AddBar add={ (bar: ProgressBarDefinition) => {
                addBar(bar);
                setAdding(false);
              } } cancel={ () => setAdding(false) }/>
              : <Button onClick={ () => setAdding(true) } color="#FFA500" label="Add"/>
          }
        </Item>
      </Body>
    </Container>
  );
}

export default App;
