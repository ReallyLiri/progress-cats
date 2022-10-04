import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import styled from "styled-components";
import { Button } from "src/components/Button";
import { Center } from "src/components/Center";
import { ProgressBar } from "src/components/ProgressBar";
import { AddBar } from "src/components/AddBar";
import { ProgressBarDefinition } from './model/ProgressBarDefinition';
import { loadFromStorage, saveToStorage } from './util/storage';
import { Cat } from "src/components/Cat";
import { Row } from "src/components/Row";
import { useIsMobile } from "src/util/isMobile";


const Container = styled.div<{ isMobile: boolean }>`
  ${ Center };
  height: 100vh;
  width: 100vw;
  background-color: black;
  flex-direction: column;
  gap: ${ ({isMobile}) => isMobile ? 10 : 40 }px;
`

const TitleStyle = styled.div<{ isMobile: boolean }>`
  color: white;
  font-size: ${ ({isMobile}) => isMobile ? 24 : 40 }px;
  font-weight: bold;
`

const Title = ({isMobile}: { isMobile: boolean }) =>
  <TitleStyle isMobile={ isMobile }>Progress Cats</TitleStyle>

const TitleRow = styled(Row)`
  justify-content: center;
`

const Body = styled.div<{ isMobile: boolean }>`
  height: ${ ({isMobile}) => isMobile ? 92 : 75 }vh;
  width: ${ ({isMobile}) => isMobile ? 94 : 75 }vw;
  background-color: white;
  border-radius: 40px;
  padding: ${ ({isMobile}) => isMobile ? 10 : 40 }px;
  overflow-y: auto;
`

const Item = styled.div<{ isMobile: boolean }>`
  :first-child {
    margin-top: ${ ({isMobile}) => isMobile ? 16 : 0 }px;
  }

  :not(:first-child) {
    margin-top: ${ ({isMobile}) => isMobile ? 32 : 16 }px;
  }

  :last-child {
    margin-top: 32px;
  }
`

function App() {
  const [isAdding, setAdding] = useState<boolean>();
  const [bars, setBars] = useState<Record<string, ProgressBarDefinition>>(loadFromStorage);
  const {isMobile} = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
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
  useEffect(() => {
    const div = ref.current
    if (isAdding && div) {
      div.scrollTo(0, div.scrollHeight - div.clientHeight);
    }
  }, [isAdding]);

  return (
    <Container isMobile={ isMobile }>
      <TitleRow>
        {
          Object.keys(bars).length === 0
            ? <>
              <Cat/>
              <Title isMobile={ isMobile }/>
              <Cat/>
            </>
            : <Title isMobile={ isMobile }/>
        }
      </TitleRow>
      <Body isMobile={ isMobile } ref={ ref }>
        {
          Object.values(bars).map(bar =>
            <Item key={ bar.id } isMobile={ isMobile }>
              <ProgressBar bar={ bar } removeBar={ removeBar } updateBar={ updateBar }/>
            </Item>
          )
        }
        <Item isMobile={ isMobile }>
          {
            isAdding
              ? <AddBar add={ (bar: ProgressBarDefinition) => {
                addBar(bar);
                setAdding(false);
              } } cancel={ () => setAdding(false) }/>
              : <Button onClick={ () => {
                setAdding(true);
              }
              } color="#FFA500" label="Add"/>
          }
        </Item>
      </Body>
    </Container>
  );
}

export default App;
