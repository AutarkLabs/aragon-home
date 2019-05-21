import React from 'react'
import styled from 'styled-components'
import Octicon, {
  Bold,
  Italic,
  TextSize,
  Quote,
  Code,
  Link,
  ListUnordered,
} from '@githubprimer/octicons-react'

import { Button, TabBar } from '@aragon/ui'

const EditorTabBar = ({ screenIndex, handleChange, setSelectionBold }) => (
  <TabBarWrapper>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: '20px',
      }}
    >
      <TabBar
        items={['Write', 'Preview']}
        selected={screenIndex}
        onChange={handleChange}
      />
      <EditToolBar>
        <EditToolBarButton onClick={setSelectionBold} compact>
          <Octicon icon={TextSize} />
        </EditToolBarButton>
        <EditToolBarButton onClick={setSelectionBold} compact>
          <Octicon icon={Bold} />
        </EditToolBarButton>
        <EditToolBarButton onClick={setSelectionBold} compact>
          <Octicon icon={Italic} />
        </EditToolBarButton>
        <EditToolBarSeparator />
        <EditToolBarButton onClick={setSelectionBold} compact>
          <Octicon icon={Quote} />
        </EditToolBarButton>
        <EditToolBarButton onClick={setSelectionBold} compact>
          <Octicon icon={Code} />
        </EditToolBarButton>
        <EditToolBarButton onClick={setSelectionBold} compact>
          <Octicon icon={Link} />
        </EditToolBarButton>
        <EditToolBarButton onClick={setSelectionBold} compact>
          <Octicon icon={ListUnordered} />
        </EditToolBarButton>
        <EditToolBarSeparator />
      </EditToolBar>
    </div>
  </TabBarWrapper>
)

const TabBarWrapper = styled.div`
  margin: 0 -30px 30px;
`

const EditToolBar = styled.div`
  margin-top: -4px;
`

const EditToolBarButton = styled(Button)`
  width: 22px;
  height: 22px;
  text-align: center;
  padding: 0;
  margin: 0;
`
const EditToolBarSeparator = styled.div`
  display: inline-block;
  width: 10px;
  height: 1px;
`

export default EditorTabBar