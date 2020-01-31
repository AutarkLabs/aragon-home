import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'

import { GU, Header, Main, SidePanel, SyncIndicator } from '@aragon/ui'

import { EditProvider, useEditMode } from '../context/Edit'
import Layout from './Content/Layout'
import EmptyState from './Content/EmptyState'
import Panel from './Panel/Panel'
import ActionsButton from './ActionsButton'
import EditModeButtons from './EditModeButtons'
import * as types from '../utils/prop-types'
import { useAragonApi } from '../api-react'
import { ipfs } from '../utils/ipfs'
import { IdentityProvider } from '../utils/identity-manager'

const App = ({ api, widgets, isSyncing }) => {
  const { editMode, setEditMode, editedWidgets } = useEditMode()
  const [ panelVisible, setPanelVisible ] = useState(true)

  const handleEditLayout = () => {
    setEditMode(true)
  }

  const handleNewWidget = () => {
    setPanelVisible(true)
  }

  const handlePanelSubmit = useCallback(async widgetObject => {
    setPanelVisible(false)
    const nextWidgets = [ ...widgets, widgetObject ]
    const cId = (
      await ipfs.dag.put(nextWidgets, { pin: true })
    ).toBaseEncodedString()
    api.updateContent(cId).toPromise()
  }, [ api, widgets ])

  const handleEditModeCancel = () => {
    setEditMode(false)
  }

  const handleEditModeSubmit = useCallback(async () => {
    const cId = (
      await ipfs.dag.put(editedWidgets, { pin: true })
    ).toBaseEncodedString()
    api.updateContent(cId).toPromise()
    setEditMode(false)
  }, [ api, editedWidgets, setEditMode ])

  return (
    <>
      {widgets.length === 0 && (
        <div
          css={`
            height: calc(100vh - ${12 * GU}px);
            display: flex;
            align-items: center;
            justify-content: center;
          `}
        >
          <EmptyState isSyncing={isSyncing} onActionClick={handleNewWidget} />
        </div>
      )}
      {widgets.length > 0 && (
        <>
          <SyncIndicator visible={isSyncing} />
          <Header
            primary="About"
            secondary={editMode
              ? <EditModeButtons onCancel={handleEditModeCancel} onSubmit={handleEditModeSubmit} />
              : <ActionsButton
                onClickEditLayout={handleEditLayout}
                onClickNewWidget={handleNewWidget}
              />
            }
          />
          <Layout widgets={widgets} />
        </>
      )}
      <SidePanel
        opened={panelVisible}
        onClose={() => setPanelVisible(false)}
        title={'New widget'}
      >
        <Panel onSubmit={handlePanelSubmit} />
      </SidePanel>
    </>
  )
}

App.propTypes = {
  api: PropTypes.shape({
    updateContent: PropTypes.func,
  }),
  // appStateReady: PropTypes.bool,
  isSyncing: PropTypes.bool,
  widgets: PropTypes.arrayOf(types.widget),
}

App.defaultProps = {
  // TODO: implement appStateReady
  // appStateReady: false,
  api: {},
  isSyncing: true,
  widgets: [],
}

// Passing api-react by props allows to type-check with propTypes
const AboutApp = () => {
  const { api, appState, guiStyle = {} } = useAragonApi()
  const { appearance } = guiStyle

  return (
    <Main assetsUrl="./aragon-ui" theme={appearance}>
      <EditProvider>
        <IdentityProvider>
          <App api={api} {...appState} />
        </IdentityProvider>
      </EditProvider>
    </Main>
  )
}

export default AboutApp
