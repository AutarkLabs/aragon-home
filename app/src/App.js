import React, { useState } from 'react'
import PropTypes from 'prop-types'
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
  GU,
  Button,
  Text,
  useTheme,
} from '@aragon/ui'

import PanelContent from './components/panel/PanelContent'
import Widget from './components/content/Widget'
import { toHex } from 'web3-utils'
import illustration from './assets/empty.svg'

const Illustration = () => <img src={illustration} height={20 * GU} />

function App() {
  const theme = useTheme()
  const [panelVisible, setPanelVisible] = useState(false)
  // TODO: useState(false) to start editMode disabled
  // const [editMode, setEditMode] = useState(true)
  const [editMode] = useState(true)
  const [selectedWidget, setSelectedWidget] = useState(0)

  const { api, appState } = useAragonApi()
  const { entries = [] } = appState

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

  if (entries.length === 0) {
    return (
      <Main>
        <EmptyLayout>
          <EmptyStateCard
            action={
              <Button
                label="Customize about page"
                onClick={handleClickNewWidget}
              />
            }
            text={
              <>
                <Text>No information here</Text>
                <Text.Block
                  size="small"
                  color={`${theme.surfaceContentSecondary}`}
                >
                  Present important information to current and prospective
                  members of your organization.
                </Text.Block>
              </>
            }
            illustration={<Illustration />}
          />
        </EmptyLayout>
        <SideContent
          panelVisible={panelVisible}
          closePanel={closePanel}
          entries={entries}
          selectedWidget={selectedWidget}
          newWidget={newWidget}
          updateWidget={updateWidget}
        />
      </Main>
    )
  }

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
          <WidgetsLayout> {widgetList} </WidgetsLayout>
        </AppView>
      </BaseLayout>
      <SideContent
        panelVisible={panelVisible}
        closePanel={closePanel}
        entries={entries}
        selectedWidget={selectedWidget}
        newWidget={newWidget}
        updateWidget={updateWidget}
      />
    </Main>
  )
}

const SideContent = ({
  panelVisible,
  closePanel,
  entries,
  selectedWidget,
  newWidget,
  updateWidget,
}) => (
  <SidePanel
    opened={panelVisible}
    onClose={closePanel}
    title="Content Block Editor"
  >
    <SidePanelContainer>
      {entries.length !== 0 && selectedWidget !== null ? (
        <PanelContent
          ipfsAddr={entries[selectedWidget].addr}
          content={entries[selectedWidget].content}
          newWidget={newWidget}
          updateWidget={updateWidget}
          closePanel={closePanel}
          position={selectedWidget}
        />
      ) : (
        <PanelContent
          newWidget={newWidget}
          updateWidget={updateWidget}
          closePanel={closePanel}
          position={selectedWidget}
        />
      )}
    </SidePanelContainer>
  </SidePanel>
)

SideContent.propTypes = {
  panelVisible: PropTypes.bool.isRequired,
  closePanel: PropTypes.func.isRequired,
  entries: PropTypes.array.isRequired,
  selectedWidget: PropTypes.number,
  newWidget: PropTypes.func.isRequired,
  updateWidget: PropTypes.func.isRequired,
}

const BaseLayout = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
`

const EmptyLayout = styled.div`
  display: flex;
  height: 95vh;
  justify-content: center;
  align-items: center;
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
