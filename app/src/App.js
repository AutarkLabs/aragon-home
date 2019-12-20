import React, { useState } from 'react'
// import PropTypes from 'prop-types'
import styled from 'styled-components'

import { useAragonApi } from '@aragon/api-react'
import {
  Main,
  AppBar,
  AppView,
  // TODO: temporarily disabled edit-mode
  // Button,
  BREAKPOINTS,
  breakpoint,
  SidePanel,
  EmptyStateCard,
  IconHome,
  Link,
} from '@aragon/ui'

import PanelContent from './components/panel/PanelContent'
import Widget from './components/content/Widget'
import { toHex } from 'web3-utils'

function App() {
  const [panelVisible, setPanelVisible] = useState(false)
  // TODO: useState(false) to start editMode disabled
  // const [editMode, setEditMode] = useState(true)
  const [editMode] = useState(true)
  const [selectedWidget, setSelectedWidget] = useState(0)

  const { api, appState } = useAragonApi()
  const { entries } = appState

  const handleClickUpdateWidget = index => e => {
    setSelectedWidget(index)
    setPanelVisible(true)
  }

  const handleClickNewWidget = e => {
    setSelectedWidget(null)
    setPanelVisible(true)
  }

  const closePanel = () => {
    setPanelVisible(false)
  }

  const updateWidget = (_index, _ipfsAddr) => {
    return api.updateWidget(toHex(_index), _ipfsAddr)
  }

  const newWidget = _ipfsAddr => {
    return api.addWidget(_ipfsAddr)
  }

  // TODO: temporarily disabled
  // const toggleEditMode = () => {
  //   setEditMode(!editMode)
  // }

  const widgetList =
    entries &&
    entries.map((widget, index) => (
      <Widget
        key={index}
        id={index}
        isLoading={widget.isLoading}
        errorMessage={widget.errorMessage}
        content={widget.content}
        ipfsAddr={widget.addr}
        handleClick={handleClickUpdateWidget}
        active={editMode}
      />
    ))
  return (
    <Main>
      <BaseLayout>
        <AppView
          appBar={
            <AppBar
              title="Home"
              // TODO: uncomment this block for edit functionality
              // endContent={
              //   <div>
              //     {editMode && (
              //       <div>
              //         <Button
              //           mode="outline"
              //           onClick={toggleEditMode}
              //           style={{ marginRight: 20 }}
              //         >
              //           Cancel and Exit
              //         </Button>

              //         <Button mode="strong" onClick={toggleEditMode}>
              //           Submit changes
              //         </Button>
              //       </div>
              //     )}

              //     {!editMode && (
              //       <Button mode="strong" onClick={toggleEditMode}>
              //         Edit Page
              //       </Button>
              //     )}
              //   </div>
              // }
            />
          }
        >
          <WidgetsLayout>
            {entries ? (
              widgetList
            ) : (
              <EmptyStateCard
                action={
                  <Link href="#" onClick={handleClickNewWidget}>
                    Add new widget
                  </Link>
                }
                text="You seem to not have any content on your wall."
                icon={<IconHome color="blue" />}
              />
            )}
          </WidgetsLayout>
        </AppView>
      </BaseLayout>
      <SidePanel
        opened={panelVisible}
        onClose={closePanel}
        title="Content Block Editor"
      >
        <SidePanelContainer>
          <PanelContent
            ipfsAddr={
              entries !== undefined &&
              selectedWidget !== null &&
              entries[selectedWidget].addr
            }
            content={
              entries !== undefined &&
              selectedWidget !== null &&
              entries[selectedWidget].content
            }
            newWidget={newWidget}
            updateWidget={updateWidget}
            closePanel={closePanel}
            position={selectedWidget}
          />
        </SidePanelContainer>
      </SidePanel>
    </Main>
  )
}

const BaseLayout = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
`

const WidgetsLayout = styled.div`
  margin: 0 auto;
  max-width: ${BREAKPOINTS.large}px;
  width: 100%;
  ${breakpoint(
    'small',
    `
      display: grid;
      grid-gap: 30px;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    `
  )};
  ${breakpoint('large', 'grid-template-columns: 6.7fr 3.3fr')};
`

// With this style the scrollbar on SidePanel is disabled, so we can handle it ourselves
const SidePanelContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 30px;
  left: 30px;
  top: 80px;

  @media only screen and (max-height: 380px) {
    position: relative;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
  }
`

// const Syncing = styled.div.attrs({children: 'Syncing…' })`
//   position: absolute;
//   top: 15px;
//   right: 20px;
// `

export default App
